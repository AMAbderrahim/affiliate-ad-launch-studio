/**
 * Cloudflare Worker Example - Gemini Integration
 * 
 * This worker proxies requests from the frontend to Google's Gemini API
 * keeping the API key secure on the server side.
 * 
 * Setup Instructions:
 * 1. Create a new Cloudflare Worker
 * 2. Copy this code to your worker
 * 3. Add GEMINI_API_KEY to your worker's environment variables/secrets:
 *    wrangler secret put GEMINI_API_KEY
 * 4. Deploy: wrangler deploy
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// CORS headers for frontend access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // In production, set this to your domain
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders 
      });
    }

    try {
      const { role, system, input, campaignData } = await request.json();

      // Validate required fields
      if (!role || !input) {
        return new Response(JSON.stringify({
          error: 'Missing required fields: role and input'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Build the prompt
      const systemPrompt = system || `You are a ${role} assistant.`;
      const userPrompt = typeof input === 'string' 
        ? input 
        : JSON.stringify(input);

      const fullPrompt = `${systemPrompt}\n\nCampaign Data: ${JSON.stringify(campaignData || {})}\n\nUser Request: ${userPrompt}`;

      // Call Gemini API
      const geminiResponse = await fetch(
        `${GEMINI_API_URL}/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: fullPrompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            }
          })
        }
      );

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.text();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API error: ${geminiResponse.status}`);
      }

      const data = await geminiResponse.json();
      
      // Extract the response text
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Try to parse structured JSON from the response
      let structured = null;
      try {
        // Look for JSON in the response (might be wrapped in markdown code blocks)
        const jsonMatch = reply.match(/```json\n?([\s\S]*?)\n?```/) || 
                         reply.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          structured = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        }
      } catch (e) {
        // Not JSON, that's okay
      }

      // Return formatted response
      return new Response(JSON.stringify({
        reply,
        structured,
        logs: [
          `Role: ${role}`,
          `Model: gemini-1.5-flash`,
          `Response length: ${reply.length} chars`
        ]
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: error.message || 'Internal server error',
        logs: [error.stack]
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
  }
};

/**
 * Alternative: Using Gemini Pro (more powerful, higher cost)
 * 
 * Change the model endpoint from:
 *   gemini-1.5-flash:generateContent
 * to:
 *   gemini-1.5-pro:generateContent
 * 
 * Gemini Flash: Faster, cheaper, good for most tasks
 * Gemini Pro: More powerful, better for complex reasoning
 */

/**
 * Deployment Commands:
 * 
 * # Install Wrangler CLI
 * npm install -g wrangler
 * 
 * # Login to Cloudflare
 * wrangler login
 * 
 * # Create wrangler.toml in your worker directory:
 * cat > wrangler.toml << EOF
 * name = "affiliate-ad-agent-worker"
 * main = "worker.js"
 * compatibility_date = "2024-01-01"
 * 
 * [env.production]
 * name = "affiliate-ad-agent-worker"
 * EOF
 * 
 * # Set your API key as a secret
 * wrangler secret put GEMINI_API_KEY
 * # Paste your key when prompted
 * 
 * # Deploy
 * wrangler deploy
 * 
 * # Your worker URL will be:
 * # https://affiliate-ad-agent-worker.YOUR_ACCOUNT.workers.dev
 */

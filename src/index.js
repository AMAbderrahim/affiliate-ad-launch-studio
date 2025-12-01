/**
 * Cloudflare Worker for Affiliate Ad Launch Studio
 * Proxies requests to Google Gemini API (1.5 Flash)
 * Keeps API key secure on server side
 * Returns structured responses with logs for agent chaining
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(),
      });
    }
    
    // Handle POST to /generate
    if (url.pathname === '/generate' && request.method === 'POST') {
      return handleGenerate(request, env);
    }
    
    // Default 404
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  },
};

async function handleGenerate(request, env) {
  const logs = [];
  
  try {
    // Get API key from environment
    const GEMINI_API_KEY = env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      logs.push('ERROR: API key not configured');
      return response({ success: false, message: 'API key not configured', logs }, 500);
    }
    
    // Parse request body
    let body;
    try {
      body = await request.json();
      logs.push('✓ Request parsed successfully');
    } catch (e) {
      logs.push('ERROR: Invalid JSON in request');
      return response({ success: false, message: 'Invalid JSON', logs }, 400);
    }
    
    const { role, system, prompt, input, campaignData } = body;
    
    // Validate required fields
    if (!prompt && !input) {
      logs.push('ERROR: Missing both prompt and input');
      return response({ success: false, message: 'Missing prompt or input', logs }, 400);
    }
    
    logs.push(`Processing role: ${role || 'general'}`);
    
    // Build effective prompt
    let fullPrompt = prompt || input || '';
    
    if (system) {
      fullPrompt = `[SYSTEM]: ${system}\n\n${fullPrompt}`;
    }
    
    if (role) {
      fullPrompt = `[ROLE]: ${role}\n${fullPrompt}`;
    }
    
    if (campaignData) {
      fullPrompt = `${fullPrompt}\n\n[CAMPAIGN_CONTEXT]:\n${JSON.stringify(campaignData, null, 2)}`;
    }
    
    logs.push('✓ Prompt constructed');
    
    // Call Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const geminiPayload = {
      contents: [{
        parts: [{ text: fullPrompt }],
      }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
      },
    };
    
    logs.push('→ Calling Gemini API...');
    
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });
    
    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      logs.push(`ERROR: Gemini API ${geminiResponse.status}`);
      console.error('Gemini API Error:', geminiResponse.status, errorData);
      return response(
        {
          success: false,
          message: `Gemini API error: ${geminiResponse.status}`,
          error: errorData,
          logs,
        },
        500
      );
    }
    
    const geminiData = await geminiResponse.json();
    logs.push('✓ Gemini response received');
    
    // Extract text response
    const textResult = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!textResult) {
      logs.push('ERROR: No text content in Gemini response');
      return response(
        {
          success: false,
          message: 'No response from Gemini API',
          logs,
        },
        500
      );
    }
    
    logs.push('✓ Text extracted from response');
    
    // Try to parse structured data from response
    let structured = null;
    try {
      // Look for JSON in the response
      const jsonMatch = textResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        structured = JSON.parse(jsonMatch[0]);
        logs.push('✓ Structured data extracted from response');
      }
    } catch (e) {
      logs.push('⚠ No JSON found in response (will return as text)');
    }
    
    logs.push('✓ Processing complete');
    
    return response({
      success: true,
      text: textResult,
      structured: structured,
      role: role || null,
      logs,
    });
    
  } catch (error) {
    logs.push(`CRITICAL ERROR: ${error.message}`);
    console.error('Worker error:', error);
    return response(
      {
        success: false,
        message: error.message || 'Unknown error',
        logs,
      },
      500
    );
  }
}

function response(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'application/json',
    },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

/**
 * Cloudflare Worker for Affiliate Ad Launch Studio
 * Proxies requests to Google Gemini API (2.5 Pro)
 * Keeps API key secure on server side
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
  try {
    // Get API key from environment
    const GEMINI_API_KEY = env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return response({ success: false, message: 'API key not configured' }, 500);
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return response({ success: false, message: 'Invalid JSON' }, 400);
    }

    const { prompt, role, system, input, context, campaignData } = body;

    // Validate required fields
    if (!prompt && !input) {
      return response({ success: false, message: 'Missing prompt or input' }, 400);
    }

    // Build effective prompt
    let fullPrompt = prompt || input || '';
    if (role) {
      fullPrompt = `[role:${role}]\n${fullPrompt}`;
    }
    if (system) {
      fullPrompt = `[system:${system}]\n${fullPrompt}`;
    }
    if (context) {
      fullPrompt = `${fullPrompt}\n[context:${context}]`;
    }
    if (campaignData) {
      fullPrompt = `${fullPrompt}\n[campaignData:${JSON.stringify(campaignData)}]`;
    }

    // Call Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const geminiPayload = {
      contents: [
        {
          parts: [
            {
              text: fullPrompt,
            },
          ],
        },
      ],
    };

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error('Gemini API Error:', geminiResponse.status, errorData);
      return response(
        {
          success: false,
          message: `Gemini API error: ${geminiResponse.status}`,
          error: errorData,
        },
        500
      );
    }

    const geminiData = await geminiResponse.json();

    // Extract text response
    const textResult =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!textResult) {
      return response(
        {
          success: false,
          message: 'No response from Gemini API',
        },
        500
      );
    }

    return response({
      success: true,
      role: role || null,
      text: textResult,
      context: context || null,
    });
  } catch (error) {
    console.error('Worker error:', error);
    return response(
      {
        success: false,
        message: error.message || 'Unknown error',
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

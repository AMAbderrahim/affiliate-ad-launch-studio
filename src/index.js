/**
 * Cloudflare Worker "marketer helper" (assistant IA Gemini, pas text-to-image)
 * Route /generate, role pris en compte, connexion a Gemini 2.5 Pro
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS global
    if (request.method === 'OPTIONS') return handleOptions(request);

    // Route POST sur /generate uniquement
    if (url.pathname === '/generate' && request.method === 'POST')
      return handleGenerate(request, env);

    // Autres cas = 404
    return new Response('Not Found', { status: 404 });
  },
};

async function handleGenerate(request, env) {
  const GEMINI_API_KEY = env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY)
    return jsonResponse({ success: false, message: 'API key not set.' }, 500);

  let requestBody;
  try {
    requestBody = await request.json();
  } catch (e) {
    return jsonResponse({ success: false, message: 'Invalid JSON.' }, 400);
  }

  const { prompt, role, context, campaignData } = requestBody;
  if (!prompt)
    return jsonResponse({ success: false, message: 'Missing "prompt".' }, 400);

  let effectivePrompt = role ? `[role:${role}]\n${prompt}` : prompt;
  if (context) effectivePrompt = `${effectivePrompt}\n[context:${context}]`;
  if (campaignData) effectivePrompt = `${effectivePrompt}\n[campaignData:${JSON.stringify(campaignData)}]`;

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
      contents: [{ parts: [{ text: effectivePrompt }] }]
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
    const result = await response.json();
    const textResult = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return jsonResponse({
      success: true,
      role: role || null,
      text: textResult,
      context: context || null
    });
  } catch (error) {
    return jsonResponse({ success: false, message: error.message || 'Error' }, 500);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
  };
}

function handleOptions(request) {
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) return new Response(null, { headers: corsHeaders() });
  else return new Response(null, { headers: { Allow: 'POST, OPTIONS' } });
}

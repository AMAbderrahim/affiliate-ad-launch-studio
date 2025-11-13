// Cloudflare Worker Service
// Connects to a Cloudflare Worker that proxies LLM API calls
// This keeps API keys secure on the server side

export interface WorkerRequest {
  role: 'marketing_strategist' | 'creative_strategist' | 'video_director' | 'designer' | 
        'prompt_generator' | 'copywriter' | 'media_buyer' | 'data_ops' | 'compliance' | 
        'competitor_analysis' | 'campaign_scheduler' | 'chat';
  system: string;
  input: any;
  campaignData?: any;
}

export interface WorkerResponse {
  reply: string;
  structured?: any;
  error?: string;
  logs?: string[];
}

// Agent role system prompts
export const AGENT_ROLES = {
  system: `You are an AI-powered Affiliate Ad Launch Studio assistant. You help professional affiliate marketers launch high-performing advertising campaigns through specialized agent roles. Be concise, action-oriented, and provide JSON structured outputs when asked.`,

  marketing_strategist: `You are the Marketing Strategist. Given product info, goals (CPA/ROAS), and constraints, propose target audiences with demographic and interest targeting, performance hypotheses, budget allocation across channels, and recommended testing strategies. Return structured JSON with audiences array, hypotheses array, budget_split array, and recommended_channels.`,

  creative_strategist: `You are the Creative Strategist. Create comprehensive creative briefs including value propositions, hooks, audience targeting, format recommendations, thumbnail ideas, tone guidelines, and messaging pillars. Return structured JSON with briefs array containing all creative direction.`,

  video_director: `You are the Video Director. Create detailed video scripts with scene-by-scene breakdowns including timing, shot descriptions, dialogue, on-screen text, and captions. Include pacing notes, music style, and color palette recommendations. Return structured JSON with scripts array.`,

  designer: `You are the Design Director. Create design specifications for ads including layouts, typography, color palettes, dimensions for different platforms, and asset requirements. Return structured JSON with design_specs array and thumbnail_concepts array.`,

  prompt_generator: `You are the AI Prompt Generator. Create detailed prompts for AI image/video generation tools (Midjourney, DALL-E, Runway, etc.) based on creative briefs. Include style descriptions, composition details, and technical parameters. Return structured JSON with prompts array.`,

  copywriter: `You are the Ad Copywriter. Write compelling ad copy variations including headlines, primary text, descriptions, and CTAs for different platforms and formats. Create landing page copy and email sequences. Return structured JSON with ad_copy, landing_page_copy, and email_sequences.`,

  media_buyer: `You are the Media Buyer. Create test matrices with ad/audience combinations, budget allocations, bidding strategies, placement recommendations, and scaling rules. Return structured JSON with test_matrix array and campaign_structure object.`,

  data_ops: `You are the Data Ops specialist. Define pixel events, tracking parameters, UTM templates, conversion events, and dashboard configurations. Return structured JSON with pixel_events, utm_templates, and dashboard_config.`,

  compliance: `You are the Compliance specialist. Review ad creatives and copy for platform policy compliance, flag potential issues, suggest required disclaimers, and provide platform-specific restrictions. Return structured JSON with compliance_checks array and required_disclaimers.`,

  competitor_analysis: `You are the Competitor Analysis specialist. Analyze competitor ads, identify market gaps, positioning strategies, pricing analysis, and bid landscape insights. Return structured JSON with competitor_ads array, market_gaps array, and bid_landscape object.`,

  campaign_scheduler: `You are the Campaign Scheduler. Create launch timelines, set campaign dates, configure scheduling rules, and budget pacing. Return structured JSON with schedule object including launch_dates, daily_schedules, and budget_pacing.`,

  chat: `You are CampaignGPT, a helpful assistant for the Affiliate Ad Launch Studio. Answer questions about the campaign, provide insights, make recommendations, and help users navigate the workflow. Be conversational and helpful.`
};

// Helper function to safely get environment variables
function getEnvVar(key: string): string | undefined {
  // Check for Vite environment variables (import.meta.env)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  // Check for Create React App environment variables (process.env)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  // Check for variables set on window object
  if (typeof window !== 'undefined' && (window as any).env) {
    return (window as any).env[key];
  }
  return undefined;
}

// Worker endpoint - configured by admin
const WORKER_ENDPOINT = getEnvVar('REACT_APP_AGENT_WORKER') || 
                        getEnvVar('VITE_AGENT_WORKER') || 
                        '';

// Always use production worker (no mock mode for users)
const USE_MOCK = false;

/**
 * Call the Cloudflare Worker to process agent requests
 * Always uses the admin-configured worker endpoint
 */
export async function callWorker(request: WorkerRequest): Promise<WorkerResponse> {
  if (!WORKER_ENDPOINT) {
    return {
      reply: '',
      error: 'Worker endpoint not configured. Please contact administrator.',
      logs: ['Error: Worker endpoint not configured'],
    };
  }

  try {
    const response = await fetch(WORKER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: request.role,
        system: request.system || AGENT_ROLES[request.role] || AGENT_ROLES.system,
        input: request.input,
        campaignData: request.campaignData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Worker call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      reply: data.reply || '',
      structured: data.structured || null,
      logs: data.logs || [],
    };
  } catch (error: any) {
    console.error('Worker service error:', error);
    return {
      reply: '',
      error: error.message || 'Failed to connect to worker service',
      logs: [`Error: ${error.message}`],
    };
  }
}



/**
 * Helper to send a chat message to the agent
 */
export async function sendChatMessage(
  message: string,
  campaignData?: any,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<WorkerResponse> {
  return callWorker({
    role: 'chat',
    system: AGENT_ROLES.chat,
    input: {
      message,
      campaign: campaignData,
      history: conversationHistory,
    },
    campaignData,
  });
}

/**
 * Export configuration helper
 */
export function getWorkerConfig() {
  return {
    endpoint: WORKER_ENDPOINT,
    isConfigured: !!WORKER_ENDPOINT,
  };
}

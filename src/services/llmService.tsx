// Mock LLM service for demonstration
// In production, this would call your Cloudflare Worker
// The Cloudflare Worker integrates with Google Gemini API

export interface LLMRequest {
  agent: string;
  promptTemplateId: string;
  campaignData: any;
  params: any;
  parentOutputs?: any;
}

export interface LLMResponse {
  status: "ok" | "error";
  payload: any;
  logs: string[];
  promptUsedId: string;
  error?: string;
}

// Mock prompt templates
const PROMPT_TEMPLATES: Record<string, any> = {
  marketing_strategist_v1: {
    system:
      "You are a Marketing Strategist focused on acquisition and ROI. Output JSON only.",
    temperature: 0.3,
    expected_schema: {
      audiences: Array,
      hypotheses: Array,
      budget_split: Array,
    },
  },
  creative_strategist_v1: {
    system:
      "You are a senior creative strategist. Output MUST be JSON only and conform to the schema.",
    temperature: 0.4,
    expected_schema: {
      briefs: Array,
    },
  },
  // Add more templates...
};

// Mock responses for each agent
const MOCK_RESPONSES: Record<string, any> = {
  marketing_strategist: {
    audiences: [
      {
        id: "aud1",
        name: "Health-Conscious Adults 25-45",
        criteria: {
          age: [25, 45],
          interests: [
            "health",
            "wellness",
            "nutrition",
            "fitness",
          ],
          behaviors: [
            "supplement_buyers",
            "health_content_consumers",
          ],
        },
        estimated_cpa: 18.5,
        potential_reach: 2500000,
      },
      {
        id: "aud2",
        name: "Digestive Health Seekers",
        criteria: {
          age: [30, 55],
          interests: [
            "digestive_health",
            "probiotics",
            "gut_health",
          ],
          behaviors: ["health_supplement_research"],
        },
        estimated_cpa: 22.3,
        potential_reach: 800000,
      },
      {
        id: "aud3",
        name: "Wellness Enthusiasts 35-50",
        criteria: {
          age: [35, 50],
          interests: [
            "holistic_health",
            "natural_remedies",
            "wellness",
          ],
          behaviors: ["premium_health_buyers"],
        },
        estimated_cpa: 25.0,
        potential_reach: 1200000,
      },
    ],
    hypotheses: [
      {
        id: "h1",
        angle: "Daily Digestive Comfort",
        audience_id: "aud1",
        metric: "CPA",
        expected_lift: "-15%",
        reasoning:
          "Health-conscious audience responds well to comfort-focused messaging",
      },
      {
        id: "h2",
        angle: "Science-Backed Formula",
        audience_id: "aud2",
        metric: "CPA",
        expected_lift: "-20%",
        reasoning:
          "Digestive health seekers value scientific validation",
      },
      {
        id: "h3",
        angle: "Natural Wellness Solution",
        audience_id: "aud3",
        metric: "CPA",
        expected_lift: "-10%",
        reasoning:
          "Wellness enthusiasts prefer natural positioning",
      },
    ],
    budget_split: [
      {
        channel: "facebook",
        pct: 45,
        reasoning:
          "Strong targeting capabilities for health audience",
      },
      {
        channel: "tiktok",
        pct: 30,
        reasoning:
          "Growing health/wellness content consumption",
      },
      {
        channel: "google",
        pct: 25,
        reasoning:
          "Capture high-intent digestive health searches",
      },
    ],
    recommended_channels: ["facebook", "tiktok", "google"],
    testing_strategy:
      "Start with Facebook for audience validation, expand to TikTok for scale, use Google for high-intent capture",
  },

  creative_strategist: {
    briefs: [
      {
        id: "b-001",
        title: "Daily Comfort Promise",
        value_prop:
          "Feel comfortable after every meal with our 15-second daily routine",
        hooks: [
          "Stop bloating in 15 seconds",
          "Finally enjoy food again",
          "The comfort you've been missing",
        ],
        audience: {
          age_min: 25,
          age_max: 45,
          interests: [
            "health",
            "wellness",
            "digestive_comfort",
          ],
        },
        format_recs: ["15s", "30s"],
        thumbnail_idea:
          "Close-up of someone smiling while eating + overlay: '15s routine'",
        tone: "Reassuring, solution-focused",
        messaging_pillars: [
          "Quick relief",
          "Daily routine",
          "Food enjoyment",
        ],
      },
      {
        id: "b-002",
        title: "Science-First Approach",
        value_prop:
          "Clinically-studied 3-in-1 formula supports complete digestive wellness",
        hooks: [
          "3 clinically-studied ingredients",
          "What doctors recommend",
          "Science meets digestive health",
        ],
        audience: {
          age_min: 30,
          age_max: 55,
          interests: [
            "scientific_health",
            "research",
            "clinical_studies",
          ],
        },
        format_recs: ["30s", "60s"],
        thumbnail_idea:
          "Lab/clinical setting with product + '3-in-1 Formula' text",
        tone: "Authoritative, educational",
        messaging_pillars: [
          "Clinical validation",
          "Scientific formula",
          "Doctor-recommended",
        ],
      },
      {
        id: "b-003",
        title: "Natural Transformation",
        value_prop:
          "Gentle, natural ingredients restore your digestive balance naturally",
        hooks: [
          "Nature's digestive reset",
          "Gentle yet powerful",
          "Feel the natural difference",
        ],
        audience: {
          age_min: 35,
          age_max: 50,
          interests: [
            "natural_health",
            "holistic_wellness",
            "organic",
          ],
        },
        format_recs: ["15s", "30s"],
        thumbnail_idea:
          "Natural ingredients montage with soft lighting + 'Natural Balance' text",
        tone: "Gentle, nurturing",
        messaging_pillars: [
          "Natural ingredients",
          "Gentle approach",
          "Holistic wellness",
        ],
      },
    ],
    creative_themes: [
      "Before/After transformation",
      "Day-in-the-life comfort",
      "Scientific credibility",
      "Natural ingredient story",
    ],
    recommended_formats: {
      primary: "15-30s vertical video",
      secondary: "Static carousel with testimonials",
      tertiary: "UGC-style testimonials",
    },
  },

  video_director: {
    scripts: [
      {
        id: "script-001",
        brief_id: "b-001",
        duration: "15s",
        scenes: [
          {
            scene_number: 1,
            timing: "0-3s",
            shot_description:
              "Close-up: Person looking uncomfortable after eating",
            dialogue: "",
            on_screen_text: "After every meal...",
            captions: "Feeling uncomfortable after meals?",
          },
          {
            scene_number: 2,
            timing: "3-8s",
            shot_description:
              "Product shot: Hand holding supplement bottle",
            dialogue: "VO: Just 15 seconds to comfort",
            on_screen_text: "15-Second Solution",
            captions: "Just 15 seconds to digestive comfort",
          },
          {
            scene_number: 3,
            timing: "8-12s",
            shot_description:
              "Same person smiling, enjoying food",
            dialogue: "VO: Finally enjoy every bite",
            on_screen_text: "Enjoy Food Again",
            captions: "Finally enjoy every bite again",
          },
          {
            scene_number: 4,
            timing: "12-15s",
            shot_description: "Product + guarantee badge",
            dialogue: "VO: Try it risk-free today",
            on_screen_text: "Try Risk-Free • Link in Bio",
            captions: "Try risk-free today",
          },
        ],
        pacing_notes:
          "Quick cuts for first 8s, slower reveal for comfort moment",
        music_style: "Upbeat, hopeful",
        color_palette: "Warm, inviting tones",
      },
    ],
    production_specs: {
      aspect_ratios: ["9:16", "1:1"],
      resolutions: ["1080x1920", "1080x1080"],
      frame_rate: "30fps",
      formats: ["MP4", "MOV"],
    },
    editing_guidelines: {
      text_overlay: "Bold, readable fonts (min 24pt)",
      captions: "Auto-generated with manual review",
      logo_placement: "Bottom right, 2s minimum duration",
      cta_timing: "Final 3-5 seconds",
    },
  },

  designer: {
    design_specs: [
      {
        id: "design-001",
        brief_id: "b-001",
        type: "static_ad",
        dimensions: {
          facebook_feed: "1200x628",
          instagram_square: "1080x1080",
          instagram_story: "1080x1920",
          tiktok: "1080x1920",
        },
        layout: {
          hero_image:
            "Product shot with ingredients background",
          headline_position: "Top third",
          cta_position: "Bottom right",
          logo_position: "Top left",
        },
        typography: {
          headline_font: "Montserrat Bold",
          body_font: "Open Sans Regular",
          cta_font: "Montserrat SemiBold",
          sizes: {
            headline: "32-40px",
            body: "16-18px",
            cta: "18-20px",
          },
        },
        color_palette: {
          primary: "#2E7D32",
          secondary: "#66BB6A",
          accent: "#FFA726",
          text_dark: "#1B5E20",
          text_light: "#FFFFFF",
          background: "#F1F8E9",
        },
        elements: [
          "Product bottle (hero)",
          "Ingredient icons",
          "Trust badges",
          "Guarantee seal",
          "CTA button",
        ],
      },
    ],
    thumbnail_concepts: [
      {
        id: "thumb-001",
        concept: "Split screen: Discomfort vs Comfort",
        description:
          "Left side shows person looking uncomfortable, right side shows same person smiling",
        text_overlay: "15-Second Solution",
      },
      {
        id: "thumb-002",
        concept: "Product hero with benefit callouts",
        description:
          "Central product shot with floating benefit icons around it",
        text_overlay: "3-in-1 Digestive Support",
      },
    ],
    asset_requirements: {
      source_files: [
        "PSD with layers",
        "AI/Vector files for logos",
      ],
      export_formats: ["PNG", "JPG", "PDF"],
      naming_convention: "campaign-id_platform_size_version",
    },
  },

  copywriter: {
    ad_copy: {
      short_form: [
        {
          id: "copy-001",
          brief_id: "b-001",
          headline: "Stop Bloating in 15 Seconds",
          body: "Finally enjoy every meal without discomfort. Our 3-in-1 formula works fast.",
          cta: "Try Risk-Free Today",
          character_count: 89,
        },
        {
          id: "copy-002",
          brief_id: "b-001",
          headline: "Feel Comfortable After Every Meal",
          body: "Join thousands who've discovered the 15-second digestive solution.",
          cta: "Shop Now",
          character_count: 76,
        },
      ],
      long_form: [
        {
          id: "copy-long-001",
          brief_id: "b-001",
          headline:
            "The 15-Second Routine That Changed Everything",
          body: "Sarah used to dread meals. Bloating, discomfort, avoiding her favorite foods... sound familiar?\n\nThen she discovered our 3-in-1 digestive formula. Just 15 seconds a day, and now she enjoys every bite without worry.\n\nWith clinically-studied probiotics, digestive enzymes, and prebiotics, this isn't just another supplement – it's your daily comfort solution.\n\nJoin over 50,000 happy customers who've transformed their digestive health.",
          cta: "Try Risk-Free for 60 Days",
          word_count: 89,
        },
      ],
    },
    landing_page_copy: {
      hero_headline:
        "Finally Enjoy Every Meal Without Digestive Discomfort",
      hero_subtext:
        "The 3-in-1 formula that supports complete digestive wellness in just 15 seconds a day",
      benefits: [
        "Reduces bloating and gas within minutes",
        "Supports healthy digestion with every meal",
        "Clinically-studied ingredients you can trust",
        "Easy 15-second daily routine",
      ],
      testimonial_headlines: [
        "I can finally eat pizza again!",
        "No more avoiding my favorite foods",
        "Game-changer for my digestive health",
      ],
    },
    email_sequences: [
      {
        day: 1,
        subject: "Your digestive comfort journey starts now",
        preview: "Here's what to expect in your first week...",
      },
      {
        day: 3,
        subject: "Are you feeling the difference yet?",
        preview: "Most customers notice changes by day 3...",
      },
    ],
  },

  media_buyer: {
    test_matrix: [
      {
        cell_id: "c-001",
        creative_id: "ad-001",
        audience_id: "aud1",
        placement: "facebook_feed",
        daily_budget: 50,
        target_metric: "CPA",
        target_value: 18.5,
        sample_size: 500,
        start_date: "2025-10-07",
        end_date: "2025-10-14",
        early_stop_rule:
          "if CPA > 2x target AND 95% confidence",
        scale_rule:
          "if CPA <= target for 3 days -> increase +30%",
      },
      {
        cell_id: "c-002",
        creative_id: "ad-002",
        audience_id: "aud1",
        placement: "instagram_stories",
        daily_budget: 40,
        target_metric: "CPA",
        target_value: 20.0,
        sample_size: 400,
        start_date: "2025-10-07",
        end_date: "2025-10-14",
        early_stop_rule:
          "if CPA > 2x target AND 95% confidence",
        scale_rule:
          "if CPA <= target for 3 days -> increase +25%",
      },
    ],
    campaign_structure: {
      account_setup: "CBO with 3 ad sets per audience",
      bidding_strategy:
        "Lowest cost with bid cap at 1.5x target CPA",
      optimization_event: "Purchase",
      attribution_window: "7-day click, 1-day view",
    },
    scaling_thresholds: {
      successful_cell:
        "CPA <= target for 3+ days with 95% confidence",
      scale_increment: "20-30% budget increase",
      scale_frequency: "Every 3 days maximum",
      kill_threshold:
        "CPA > 2x target with statistical significance",
    },
  },

  data_ops: {
    pixel_events: [
      {
        event_name: "PageView",
        properties: ["page_title", "page_url", "referrer"],
        description: "Track all page visits for optimization",
      },
      {
        event_name: "ViewContent",
        properties: [
          "content_name",
          "content_category",
          "value",
          "currency",
        ],
        description: "Product page views for remarketing",
      },
      {
        event_name: "AddToCart",
        properties: [
          "content_name",
          "value",
          "currency",
          "num_items",
        ],
        description: "Add to cart for funnel optimization",
      },
      {
        event_name: "InitiateCheckout",
        properties: ["value", "currency", "num_items"],
        description: "Checkout start for abandonment tracking",
      },
      {
        event_name: "Purchase",
        properties: [
          "value",
          "currency",
          "transaction_id",
          "content_ids",
        ],
        description: "Conversion tracking for ROAS",
      },
    ],
    utm_templates: {
      facebook:
        "?utm_source=facebook&utm_medium={{placement}}&utm_campaign={{campaign_id}}&utm_content={{creative_id}}&utm_term={{audience_id}}",
      tiktok:
        "?utm_source=tiktok&utm_medium={{placement}}&utm_campaign={{campaign_id}}&utm_content={{creative_id}}&utm_term={{audience_id}}",
      google:
        "?utm_source=google&utm_medium=cpc&utm_campaign={{campaign_id}}&utm_content={{creative_id}}&utm_term={{keyword}}",
    },
    dashboard_config: {
      primary_kpis: [
        "CPA",
        "ROAS",
        "Purchase Volume",
        "CTR",
        "CVR",
      ],
      secondary_metrics: ["CPM", "CPC", "Frequency", "Reach"],
      breakdowns: [
        "campaign",
        "ad_set",
        "creative",
        "placement",
        "audience",
      ],
      refresh_frequency: "hourly",
    },
  },

  compliance: {
    compliance_checks: [
      {
        creative_id: "ad-001",
        copy_id: "copy-001",
        status: "approved",
        flags: [],
        notes:
          "Clean health benefit claims, no medical terminology",
      },
      {
        creative_id: "ad-002",
        copy_id: "copy-002",
        status: "flagged",
        flags: ["medical_claim_concern"],
        notes:
          "Review 'clinically-studied' claim for substantiation",
        required_edits: [
          "Add disclaimer about FDA evaluation",
          "Soften clinical claim language",
        ],
      },
    ],
    required_disclaimers: [
      "These statements have not been evaluated by the FDA",
      "This product is not intended to diagnose, treat, cure, or prevent any disease",
      "Individual results may vary",
    ],
    channel_restrictions: {
      facebook: [
        "No before/after images without disclaimers",
        "Health claims must be substantiated",
      ],
      google: [
        "FDA disclaimer required for all health products",
        "No absolute claims",
      ],
      tiktok: [
        "Community guidelines for health content",
        "No medical advice positioning",
      ],
    },
  },

  competitor_analysis: {
    competitor_ads: [
      {
        competitor: "Digestive Health Co",
        ad_format: "video",
        hook: "Bloating relief in 30 minutes",
        positioning: "Fast-acting enzyme formula",
        price_point: "$39.99",
        usp: "Speed of relief",
        estimated_spend: "high",
        creative_style: "before/after testimonials",
      },
      {
        competitor: "Gut Wellness Pro",
        ad_format: "static",
        hook: "Doctor-formulated digestive support",
        positioning: "Medical credibility",
        price_point: "$54.99",
        usp: "Doctor endorsement",
        estimated_spend: "medium",
        creative_style: "clinical/professional",
      },
    ],
    market_gaps: [
      "No competitor emphasizes 15-second routine",
      "Limited focus on daily comfort vs. problem-solving",
      "Opportunity for more lifestyle-focused positioning",
    ],
    bid_landscape: {
      avg_cpc: "$1.25-$2.50",
      competitive_density: "medium-high",
      peak_times: ["evening 6-9pm", "weekend mornings"],
      recommended_strategy:
        "Focus on unique 15-second angle to differentiate",
    },
  },
};

export async function callLLM(
  request: LLMRequest,
): Promise<LLMResponse> {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 2000 + Math.random() * 3000),
  );

  // Get mock response
  const mockResponse = MOCK_RESPONSES[request.agent];

  if (!mockResponse) {
    return {
      status: "error",
      payload: null,
      logs: [
        `No mock response available for agent: ${request.agent}`,
      ],
      promptUsedId: request.promptTemplateId,
      error: `Agent ${request.agent} not implemented`,
    };
  }

  return {
    status: "ok",
    payload: mockResponse,
    logs: [
      `Called LLM for agent: ${request.agent}`,
      `Used prompt template: ${request.promptTemplateId}`,
      `Response generated successfully`,
    ],
    promptUsedId: request.promptTemplateId,
  };
}
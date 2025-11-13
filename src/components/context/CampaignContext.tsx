import React, { createContext, useContext, useState, ReactNode } from 'react';

// Core data models
export interface Campaign {
  id: string;
  name: string;
  product: {
    name: string;
    price: number;
    category: string;
    images: string[];
    landing_page: string;
    short_desc: string;
  };
  goals: {
    primary_kpi: 'CPA' | 'ROAS' | 'ROI';
    target_cpa?: number;
    target_roas?: number;
    target_roi?: number;
  };
  geo: string[];
  budget: {
    daily: number;
    total: number;
  };
  traffic_sources: string[];
  constraints: string;
  brand_requirements: string;
  created_at: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
}

export interface AgentOutput {
  [key: string]: any;
}

export interface AgentOutputs {
  marketing_strategist?: AgentOutput;
  creative_strategist?: AgentOutput;
  video_director?: AgentOutput;
  designer?: AgentOutput;
  prompt_generator?: AgentOutput;
  copywriter?: AgentOutput;
  media_buyer?: AgentOutput;
  data_ops?: AgentOutput;
  compliance?: AgentOutput;
  competitor_analysis?: AgentOutput;
  campaign_scheduler?: AgentOutput;
}

interface CampaignContextType {
  campaign: Campaign | null;
  agentOutputs: AgentOutputs;
  setCampaign: (campaign: Campaign) => void;
  setAgentOutput: (agent: keyof AgentOutputs, output: AgentOutput) => void;
  getAgentOutput: (agent: keyof AgentOutputs) => AgentOutput | undefined;
  isAgentComplete: (agent: keyof AgentOutputs) => boolean;
  getRequiredInputs: (agent: keyof AgentOutputs) => string[];
  areRequiredInputsReady: (agent: keyof AgentOutputs) => boolean;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

// Agent dependencies
const AGENT_DEPENDENCIES: Record<keyof AgentOutputs, (keyof AgentOutputs)[]> = {
  marketing_strategist: [],
  creative_strategist: ['marketing_strategist'],
  video_director: ['creative_strategist'],
  designer: ['creative_strategist', 'video_director'],
  prompt_generator: [],
  copywriter: ['creative_strategist'],
  media_buyer: ['marketing_strategist', 'copywriter'],
  data_ops: ['media_buyer'],
  compliance: ['copywriter', 'designer'],
  competitor_analysis: [],
  campaign_scheduler: ['media_buyer', 'data_ops', 'compliance']
};

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [agentOutputs, setAgentOutputsState] = useState<AgentOutputs>({});

  const setAgentOutput = (agent: keyof AgentOutputs, output: AgentOutput) => {
    setAgentOutputsState(prev => ({
      ...prev,
      [agent]: output
    }));
  };

  const getAgentOutput = (agent: keyof AgentOutputs): AgentOutput | undefined => {
    return agentOutputs[agent];
  };

  const isAgentComplete = (agent: keyof AgentOutputs): boolean => {
    return !!agentOutputs[agent];
  };

  const getRequiredInputs = (agent: keyof AgentOutputs): string[] => {
    const dependencies = AGENT_DEPENDENCIES[agent] || [];
    return dependencies;
  };

  const areRequiredInputsReady = (agent: keyof AgentOutputs): boolean => {
    if (!campaign) return false;
    
    const dependencies = AGENT_DEPENDENCIES[agent] || [];
    return dependencies.every(dep => isAgentComplete(dep));
  };

  return (
    <CampaignContext.Provider value={{
      campaign,
      agentOutputs,
      setCampaign,
      setAgentOutput,
      getAgentOutput,
      isAgentComplete,
      getRequiredInputs,
      areRequiredInputsReady
    }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
}
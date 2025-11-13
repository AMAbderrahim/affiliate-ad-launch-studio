import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCampaign } from '../context/CampaignContext';
import { CheckCircle, Circle, Lock, Database, Target, Lightbulb, Video, PaintBucket, Wand2, PenTool, TrendingUp, BarChart3, Shield, Search, Calendar, FileText, Zap } from 'lucide-react';
import { Separator } from './ui/separator';

const AGENT_PAGES = [
  { 
    path: '/data-hub', 
    name: 'Campaign Setup', 
    agent: null, 
    icon: Database,
    category: 'setup'
  },
  { 
    path: '/marketing-strategist', 
    name: 'Marketing Strategy', 
    agent: 'marketing_strategist',
    icon: Target,
    category: 'strategy'
  },
  { 
    path: '/creative-strategist', 
    name: 'Creative Strategy', 
    agent: 'creative_strategist',
    icon: Lightbulb,
    category: 'strategy'
  },
  { 
    path: '/competitor-analysis', 
    name: 'Competitor Intel', 
    agent: 'competitor_analysis',
    icon: Search,
    category: 'strategy'
  },
  { 
    path: '/video-director', 
    name: 'Video Director', 
    agent: 'video_director',
    icon: Video,
    category: 'creative'
  },
  { 
    path: '/designer', 
    name: 'Designer', 
    agent: 'designer',
    icon: PaintBucket,
    category: 'creative'
  },
  { 
    path: '/prompt-generator', 
    name: 'AI Prompts', 
    agent: 'prompt_generator',
    icon: Wand2,
    category: 'creative'
  },
  { 
    path: '/copywriter', 
    name: 'Copywriter', 
    agent: 'copywriter',
    icon: PenTool,
    category: 'creative'
  },
  { 
    path: '/media-buyer', 
    name: 'Media Buyer', 
    agent: 'media_buyer',
    icon: TrendingUp,
    category: 'execution'
  },
  { 
    path: '/data-ops', 
    name: 'Data & Analytics', 
    agent: 'data_ops',
    icon: BarChart3,
    category: 'execution'
  },
  { 
    path: '/compliance', 
    name: 'Compliance', 
    agent: 'compliance',
    icon: Shield,
    category: 'execution'
  },
  { 
    path: '/campaign-scheduler', 
    name: 'Scheduler', 
    agent: 'campaign_scheduler',
    icon: Calendar,
    category: 'execution'
  },
  { 
    path: '/weekly-reports', 
    name: 'Reports & Analytics', 
    agent: null,
    icon: FileText,
    category: 'reporting'
  }
];

const CATEGORIES = [
  { id: 'setup', label: 'Setup' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'creative', label: 'Creative Production' },
  { id: 'execution', label: 'Campaign Execution' },
  { id: 'reporting', label: 'Reporting' }
];

export function Navigation() {
  const location = useLocation();
  const { campaign, isAgentComplete, areRequiredInputsReady } = useCampaign();

  const getPageStatus = (agent: string | null) => {
    if (!agent) return 'available'; // Data Hub and Reports are always available
    if (!campaign) return 'locked';
    if (isAgentComplete(agent as any)) return 'complete';
    if (areRequiredInputsReady(agent as any)) return 'available';
    return 'locked';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-3.5 h-3.5 text-green-400" />;
      case 'available':
        return <Circle className="w-3.5 h-3.5 text-slate-400" />;
      case 'locked':
        return <Lock className="w-3.5 h-3.5 text-slate-600" />;
      default:
        return <Circle className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  // Calculate completion stats
  const totalAgents = AGENT_PAGES.filter(p => p.agent).length;
  const completedAgents = AGENT_PAGES.filter(p => p.agent && isAgentComplete(p.agent as any)).length;
  const completionPercentage = campaign ? Math.round((completedAgents / totalAgents) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg leading-tight">Affiliate Ad Studio</h1>
            <p className="text-xs text-slate-400">AI-Powered Campaign Builder</p>
          </div>
        </div>
        
        {campaign && (
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Active Campaign</span>
              <span className="text-xs text-blue-400">{completionPercentage}%</span>
            </div>
            <p className="text-sm truncate mb-2">{campaign.name}</p>
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {CATEGORIES.map((category) => {
          const categoryPages = AGENT_PAGES.filter(p => p.category === category.id);
          
          return (
            <div key={category.id}>
              <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-2 px-2">
                {category.label}
              </h3>
              <div className="space-y-1">
                {categoryPages.map((page) => {
                  const status = getPageStatus(page.agent);
                  const isActive = location.pathname === page.path;
                  const isLocked = status === 'locked';
                  const Icon = page.icon;
                  
                  return (
                    <Link
                      key={page.path}
                      to={page.path}
                      className={`
                        group flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30' 
                          : isLocked
                            ? 'text-slate-500 cursor-not-allowed opacity-60'
                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                        }
                      `}
                      onClick={(e) => isLocked && e.preventDefault()}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1">{page.name}</span>
                      <div className="flex-shrink-0">
                        {getStatusIcon(status)}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 text-center">
          <p>Powered by AI Agents</p>
        </div>
      </div>
    </div>
  );
}
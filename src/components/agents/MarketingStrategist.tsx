import React, { useState } from 'react';
import { AgentLayout } from '../AgentLayout';
import { AgentLoadingState } from '../AgentLoadingState';
import { AgentChatPanel } from '../AgentChatPanel';
import { useCampaign } from '../../context/CampaignContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Play, RotateCcw, Users, Target, DollarSign } from 'lucide-react';
import { callWorker, AGENT_ROLES } from '../../services/workerService';

export function MarketingStrategist() {
  const { campaign, setAgentOutput, getAgentOutput } = useCampaign();
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const existingOutput = getAgentOutput('marketing_strategist');

  const runAgent = async () => {
    if (!campaign) return;
    
    setIsLoading(true);
    setLogs([]);

    try {
      const response = await callWorker({
        role: 'marketing_strategist',
        system: AGENT_ROLES.marketing_strategist,
        input: {
          product_category: campaign.product.category,
          target_kpi: campaign.goals.primary_kpi,
          budget_range: campaign.budget.daily,
          geo_markets: campaign.geo
        },
        campaignData: campaign
      });

      if (response.logs) {
        setLogs(response.logs);
      }

      if (response.error) {
        setLogs(prev => [...prev, `Error: ${response.error}`]);
      } else if (response.structured) {
        setAgentOutput('marketing_strategist', response.structured);
      }
    } catch (error: any) {
      setLogs(['Error calling worker service: ' + error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <AgentLayout
      agentName="Marketing Strategist"
      agentKey="marketing_strategist"
      title="Marketing Strategist"
      description="Generate target audiences, performance hypotheses, and budget allocation recommendations"
      requiredInputs={[]}
      nextAgent="creative-strategist"
    >
      <div className="space-y-6">
        {/* Agent Controls */}
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>🤖 AI Agent Controls</span>
              {existingOutput && (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Analysis Complete
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button 
                onClick={runAgent} 
                disabled={isLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{existingOutput ? 'Re-run Analysis' : 'Generate Strategy'}</span>
              </Button>
              
              {existingOutput && (
                <Button 
                  variant="outline" 
                  onClick={runAgent}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Regenerate</span>
                </Button>
              )}
            </div>

          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <AgentLoadingState agentName="Marketing Strategist" logs={logs} />
        )}

        {/* Results */}
        {!isLoading && existingOutput && (
          <div className="space-y-6">
            {/* Target Audiences */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>Target Audiences</span>
                  <Badge variant="secondary" className="ml-2">
                    {existingOutput.audiences?.length || 0} Segments
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {existingOutput.audiences?.map((audience: any) => (
                    <div key={audience.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">{audience.name}</h4>
                        <Badge variant="secondary">
                          Est. CPA: {formatCurrency(audience.estimated_cpa)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Demographics:</strong>
                          <p>Age: {audience.criteria.age[0]}-{audience.criteria.age[1]}</p>
                        </div>
                        <div>
                          <strong>Potential Reach:</strong>
                          <p>{audience.potential_reach?.toLocaleString()} people</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <strong>Interests:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {audience.criteria.interests?.map((interest: string) => (
                            <Badge key={interest} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {audience.criteria.behaviors && (
                        <div className="mt-3">
                          <strong>Behaviors:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {audience.criteria.behaviors.map((behavior: string) => (
                              <Badge key={behavior} variant="outline" className="text-xs">
                                {behavior}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Hypotheses */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Hypotheses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {existingOutput.hypotheses?.map((hypothesis: any) => (
                    <div key={hypothesis.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{hypothesis.angle}</h4>
                        <Badge 
                          variant={hypothesis.expected_lift.includes('-') ? 'default' : 'secondary'}
                        >
                          {hypothesis.expected_lift} {hypothesis.metric}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Target:</strong> {existingOutput.audiences?.find((a: any) => a.id === hypothesis.audience_id)?.name}
                      </p>
                      <p className="text-sm">{hypothesis.reasoning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Budget Split</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {existingOutput.budget_split?.map((split: any) => (
                    <div key={split.channel} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium capitalize">{split.channel}</div>
                        <div className="text-sm text-gray-600">{split.reasoning}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{split.pct}%</div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency((campaign?.budget.daily || 0) * split.pct / 100)}/day
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testing Strategy */}
            {existingOutput.testing_strategy && (
              <Card>
                <CardHeader>
                  <CardTitle>Testing Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{existingOutput.testing_strategy}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!existingOutput && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Click "Run Analysis" to generate marketing strategy recommendations
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chat Panel */}
      <div className="mt-6">
        <AgentChatPanel 
          agentContext="Marketing Strategist - helping with audience targeting, budget allocation, and campaign strategy"
          quickActions={[
            { label: '🎯 More Audiences', prompt: 'Suggest 2 more target audience segments for this campaign' },
            { label: '💰 Budget Tips', prompt: 'How should I allocate my budget across channels?' },
            { label: '📊 KPI Advice', prompt: 'What are realistic KPI targets for this campaign?' },
            { label: '🔍 Competitor Intel', prompt: 'What should I know about competitors in this niche?' },
          ]}
        />
      </div>
    </AgentLayout>
  );
}
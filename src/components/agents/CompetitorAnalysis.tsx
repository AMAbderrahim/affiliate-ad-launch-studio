import React, { useState } from 'react';
import { AgentLayout } from '../AgentLayout';
import { useCampaign } from '../../context/CampaignContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Play, RotateCcw, Search, TrendingUp, DollarSign } from 'lucide-react';
import { callLLM } from '../../services/llmService';

export function CompetitorAnalysis() {
  const { campaign, setAgentOutput, getAgentOutput } = useCampaign();
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const existingOutput = getAgentOutput('competitor_analysis');

  const runAgent = async () => {
    if (!campaign) return;
    
    setIsLoading(true);
    setLogs([]);

    try {
      const response = await callLLM({
        agent: 'competitor_analysis',
        promptTemplateId: 'competitor_analysis_v1',
        campaignData: campaign,
        params: {
          product_category: campaign.product.category,
          target_geo: campaign.geo,
          traffic_sources: campaign.traffic_sources
        }
      });

      setLogs(response.logs);

      if (response.status === 'ok') {
        setAgentOutput('competitor_analysis', response.payload);
      }
    } catch (error) {
      setLogs(['Error calling LLM service']);
    } finally {
      setIsLoading(false);
    }
  };

  const getSpendLevel = (spend: string) => {
    switch (spend) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AgentLayout
      agentName="Competitor Analysis"
      agentKey="competitor_analysis"
      title="Competitor Analysis"
      description="Analyze competitor advertising strategies, creative approaches, and market positioning"
      requiredInputs={[]}
      nextAgent="campaign-scheduler"
    >
      <div className="space-y-6">
        {/* Agent Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button 
                onClick={runAgent} 
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{existingOutput ? 'Re-run Analysis' : 'Analyze Competitors'}</span>
              </Button>
              
              {existingOutput && (
                <Button 
                  variant="outline" 
                  onClick={runAgent}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Refresh Analysis</span>
                </Button>
              )}
            </div>

            {logs.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Execution Logs</h4>
                <div className="bg-gray-100 p-3 rounded text-sm space-y-1">
                  {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {existingOutput && (
          <div className="space-y-6">
            {/* Competitor Ad Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Competitor Ad Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {existingOutput.competitor_ads?.map((ad: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{ad.competitor}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{ad.ad_format}</Badge>
                            <Badge className={getSpendLevel(ad.estimated_spend)}>
                              {ad.estimated_spend} spend
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{ad.price_point}</div>
                          <div className="text-sm text-gray-600">{ad.creative_style}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <strong>Hook:</strong>
                          <p className="bg-blue-50 p-2 rounded text-sm mt-1">"{ad.hook}"</p>
                        </div>
                        <div>
                          <strong>USP:</strong>
                          <p className="bg-green-50 p-2 rounded text-sm mt-1">{ad.usp}</p>
                        </div>
                        <div className="md:col-span-2">
                          <strong>Positioning:</strong>
                          <p className="text-sm mt-1">{ad.positioning}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Gaps */}
            {existingOutput.market_gaps && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Market Opportunity Gaps</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {existingOutput.market_gaps.map((gap: string, index: number) => (
                      <div key={index} className="bg-green-50 border border-green-200 p-3 rounded">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-sm">{gap}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded">
                    <h4 className="font-medium mb-2">Competitive Advantage Opportunities</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Focus on unique selling propositions not being used by competitors</li>
                      <li>• Target underserved audience segments or messaging angles</li>
                      <li>• Leverage gaps in competitor creative formats or platforms</li>
                      <li>• Position against competitor weaknesses while highlighting strengths</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bid Landscape */}
            {existingOutput.bid_landscape && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Bid Landscape Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cost Metrics */}
                    <div>
                      <h4 className="font-medium mb-3">Cost Benchmarks</h4>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Average CPC</span>
                            <span className="font-medium">{existingOutput.bid_landscape.avg_cpc}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Competition Density</span>
                            <Badge variant="outline">{existingOutput.bid_landscape.competitive_density}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timing Insights */}
                    <div>
                      <h4 className="font-medium mb-3">Optimal Timing</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <strong>Peak Competition Times:</strong>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {existingOutput.bid_landscape.peak_times?.map((time: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Strategy Recommendation */}
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <h4 className="font-medium mb-2">Recommended Strategy</h4>
                    <p className="text-sm">{existingOutput.bid_landscape.recommended_strategy}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Competitive Insights Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Key Insights & Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Competitive Strengths */}
                  <div>
                    <h4 className="font-medium mb-3">Competitor Strengths to Watch</h4>
                    <div className="space-y-2">
                      {existingOutput.competitor_ads?.map((ad: any, index: number) => (
                        <div key={index} className="text-sm">
                          <strong>{ad.competitor}:</strong> {ad.usp}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Our Differentiation */}
                  <div>
                    <h4 className="font-medium mb-3">Our Differentiation Strategy</h4>
                    <div className="space-y-2 text-sm">
                      {existingOutput.market_gaps?.slice(0, 3).map((gap: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span>{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Items */}
                <div className="mt-6 p-4 bg-blue-50 rounded">
                  <h4 className="font-medium mb-3">Immediate Action Items</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>Update creative briefs to emphasize unique differentiators</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>Adjust bidding strategy based on competitive landscape</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>Test messaging angles not currently used by competitors</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>Monitor competitor campaigns for changes in strategy</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!existingOutput && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Click "Analyze Competitors" to research competitor strategies and identify market opportunities
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AgentLayout>
  );
}
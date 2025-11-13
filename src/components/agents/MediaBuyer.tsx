import React, { useState } from 'react';
import { AgentLayout } from '../AgentLayout';
import { useCampaign } from '../../context/CampaignContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Play, RotateCcw, Target, TrendingUp, DollarSign } from 'lucide-react';
import { callLLM } from '../../services/llmService';

export function MediaBuyer() {
  const { campaign, setAgentOutput, getAgentOutput } = useCampaign();
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const existingOutput = getAgentOutput('media_buyer');
  const marketingOutput = getAgentOutput('marketing_strategist');
  const copyOutput = getAgentOutput('copywriter');

  const runAgent = async () => {
    if (!campaign) return;
    
    setIsLoading(true);
    setLogs([]);

    try {
      const response = await callLLM({
        agent: 'media_buyer',
        promptTemplateId: 'media_buyer_v1',
        campaignData: campaign,
        params: {
          audiences: marketingOutput?.audiences || [],
          ad_copy: copyOutput?.ad_copy || {}
        },
        parentOutputs: {
          marketing_strategist: marketingOutput,
          copywriter: copyOutput
        }
      });

      setLogs(response.logs);

      if (response.status === 'ok') {
        setAgentOutput('media_buyer', response.payload);
      }
    } catch (error) {
      setLogs(['Error calling LLM service']);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <AgentLayout
      agentName="Media Buyer"
      agentKey="media_buyer"
      title="Media Buyer"
      description="Create test matrices, budget allocation, and campaign optimization strategies"
      requiredInputs={['marketing_strategist', 'copywriter']}
      nextAgent="data-ops"
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
                <span>{existingOutput ? 'Re-run Analysis' : 'Generate Media Plan'}</span>
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
            {/* A/B Test Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>A/B Test Matrix</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 text-left">Cell ID</th>
                        <th className="border border-gray-300 p-2 text-left">Creative</th>
                        <th className="border border-gray-300 p-2 text-left">Audience</th>
                        <th className="border border-gray-300 p-2 text-left">Placement</th>
                        <th className="border border-gray-300 p-2 text-left">Daily Budget</th>
                        <th className="border border-gray-300 p-2 text-left">Target CPA</th>
                        <th className="border border-gray-300 p-2 text-left">Sample Size</th>
                        <th className="border border-gray-300 p-2 text-left">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {existingOutput.test_matrix?.map((cell: any) => (
                        <tr key={cell.cell_id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-2">
                            <Badge variant="outline">{cell.cell_id}</Badge>
                          </td>
                          <td className="border border-gray-300 p-2">{cell.creative_id}</td>
                          <td className="border border-gray-300 p-2">{cell.audience_id}</td>
                          <td className="border border-gray-300 p-2">{cell.placement}</td>
                          <td className="border border-gray-300 p-2">{formatCurrency(cell.daily_budget)}</td>
                          <td className="border border-gray-300 p-2">{formatCurrency(cell.target_value)}</td>
                          <td className="border border-gray-300 p-2">{cell.sample_size}</td>
                          <td className="border border-gray-300 p-2">
                            {cell.start_date} - {cell.end_date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Test Matrix Summary */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Total Test Cells</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {existingOutput.test_matrix?.length || 0}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Total Daily Budget</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(
                        existingOutput.test_matrix?.reduce((sum: number, cell: any) => sum + cell.daily_budget, 0) || 0
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Expected Sample Size</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {existingOutput.test_matrix?.reduce((sum: number, cell: any) => sum + cell.sample_size, 0)?.toLocaleString() || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Structure */}
            {existingOutput.campaign_structure && (
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(existingOutput.campaign_structure).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded">
                        <div className="font-medium capitalize mb-1">
                          {key.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-600">{value as string}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scaling Strategy */}
            {existingOutput.scaling_thresholds && (
              <Card>
                <CardHeader>
                  <CardTitle>Scaling & Optimization Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(existingOutput.scaling_thresholds).map(([key, value]) => (
                        <div key={key} className="border rounded p-3">
                          <div className="font-medium capitalize mb-1">
                            {key.replace('_', ' ')}
                          </div>
                          <div className="text-sm">{value as string}</div>
                        </div>
                      ))}
                    </div>

                    {/* Rules Summary */}
                    <div className="bg-yellow-50 p-4 rounded">
                      <h4 className="font-medium mb-2">Optimization Rules Summary</h4>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Scale trigger:</strong> CPA ≤ target for 3+ days with statistical significance</li>
                        <li>• <strong>Scale increment:</strong> 20-30% budget increase every 3 days maximum</li>
                        <li>• <strong>Kill criteria:</strong> CPA {'>'} 2x target with 95% confidence</li>
                        <li>• <strong>Frequency cap:</strong> Monitor for ad fatigue when frequency {'>'} 3</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Test Matrix Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Test Matrix Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {existingOutput.test_matrix?.map((cell: any) => (
                    <div key={cell.cell_id} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline">{cell.cell_id}</Badge>
                        <div className="text-sm text-gray-600">
                          {cell.placement} • {cell.audience_id}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <strong>Early Stop Rule:</strong>
                          <p className="text-gray-600">{cell.early_stop_rule}</p>
                        </div>
                        <div>
                          <strong>Scale Rule:</strong>
                          <p className="text-gray-600">{cell.scale_rule}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!existingOutput && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Click "Generate Media Plan" to create A/B test matrices and campaign optimization strategies
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AgentLayout>
  );
}
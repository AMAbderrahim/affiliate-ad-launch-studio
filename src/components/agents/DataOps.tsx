import React, { useState } from 'react';
import { AgentLayout } from '../AgentLayout';
import { useCampaign } from '../../context/CampaignContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Play, RotateCcw, Database, Link2, BarChart3 } from 'lucide-react';
import { callLLM } from '../../services/llmService';

export function DataOps() {
  const { campaign, setAgentOutput, getAgentOutput } = useCampaign();
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const existingOutput = getAgentOutput('data_ops');
  const mediaBuyerOutput = getAgentOutput('media_buyer');

  const runAgent = async () => {
    if (!campaign) return;
    
    setIsLoading(true);
    setLogs([]);

    try {
      const response = await callLLM({
        agent: 'data_ops',
        promptTemplateId: 'data_ops_v1',
        campaignData: campaign,
        params: {
          test_matrix: mediaBuyerOutput?.test_matrix || [],
          traffic_sources: campaign.traffic_sources
        },
        parentOutputs: {
          media_buyer: mediaBuyerOutput
        }
      });

      setLogs(response.logs);

      if (response.status === 'ok') {
        setAgentOutput('data_ops', response.payload);
      }
    } catch (error) {
      setLogs(['Error calling LLM service']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AgentLayout
      agentName="Data Ops"
      agentKey="data_ops"
      title="Data Operations"
      description="Setup tracking pixels, UTM parameters, and analytics dashboard configurations"
      requiredInputs={['media_buyer']}
      nextAgent="compliance"
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
                <span>{existingOutput ? 'Re-run Analysis' : 'Generate Data Setup'}</span>
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
            {/* Pixel Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Tracking Pixel Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {existingOutput.pixel_events?.map((event: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">{event.event_name}</h4>
                        <Badge variant="outline">Pixel Event</Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      
                      <div>
                        <h5 className="font-medium mb-2">Required Properties</h5>
                        <div className="flex flex-wrap gap-1">
                          {event.properties?.map((prop: string) => (
                            <Badge key={prop} variant="secondary" className="text-xs font-mono">
                              {prop}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Sample Implementation */}
                      <div className="mt-3">
                        <h5 className="font-medium mb-2">Sample Implementation</h5>
                        <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
                          {`fbq('track', '${event.event_name}', {
  ${event.properties?.map((prop: string) => `  ${prop}: 'value'`).join(',\n')}
});`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* UTM Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link2 className="w-5 h-5" />
                  <span>UTM Parameter Templates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(existingOutput.utm_templates || {}).map(([source, template]) => (
                    <div key={source} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium capitalize">{source}</h4>
                        <Badge variant="outline">UTM Template</Badge>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded font-mono text-sm break-all">
                        {campaign?.product.landing_page}{template as string}
                      </div>

                      {/* Parameter Breakdown */}
                      <div className="mt-3">
                        <h5 className="font-medium mb-2">Parameter Breakdown</h5>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                          <div className="bg-blue-50 p-2 rounded">
                            <strong>Source:</strong> {source}
                          </div>
                          <div className="bg-green-50 p-2 rounded">
                            <strong>Medium:</strong> {(template as string).includes('medium=cpc') ? 'cpc' : '{{placement}}'}
                          </div>
                          <div className="bg-yellow-50 p-2 rounded">
                            <strong>Campaign:</strong> {'{{campaign_id}}'}
                          </div>
                          <div className="bg-purple-50 p-2 rounded">
                            <strong>Content:</strong> {'{{creative_id}}'}
                          </div>
                          <div className="bg-pink-50 p-2 rounded">
                            <strong>Term:</strong> {'{{audience_id || keyword}}'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dashboard Configuration */}
            {existingOutput.dashboard_config && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Analytics Dashboard Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary KPIs */}
                    <div>
                      <h4 className="font-medium mb-3">Primary KPIs</h4>
                      <div className="space-y-2">
                        {existingOutput.dashboard_config.primary_kpis?.map((kpi: string) => (
                          <div key={kpi} className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded" />
                            <span className="text-sm">{kpi}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Secondary Metrics */}
                    <div>
                      <h4 className="font-medium mb-3">Secondary Metrics</h4>
                      <div className="space-y-2">
                        {existingOutput.dashboard_config.secondary_metrics?.map((metric: string) => (
                          <div key={metric} className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-400 rounded" />
                            <span className="text-sm">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Breakdowns */}
                    <div>
                      <h4 className="font-medium mb-3">Data Breakdowns</h4>
                      <div className="flex flex-wrap gap-1">
                        {existingOutput.dashboard_config.breakdowns?.map((breakdown: string) => (
                          <Badge key={breakdown} variant="outline" className="text-xs">
                            {breakdown}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Settings */}
                    <div>
                      <h4 className="font-medium mb-3">Dashboard Settings</h4>
                      <div className="text-sm space-y-1">
                        <div>
                          <strong>Refresh:</strong> {existingOutput.dashboard_config.refresh_frequency}
                        </div>
                        <div>
                          <strong>Attribution:</strong> 7-day click, 1-day view
                        </div>
                        <div>
                          <strong>Currency:</strong> USD
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sample Dashboard Layout */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Recommended Dashboard Layout</h4>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="bg-white p-3 rounded text-center text-xs">
                          <div className="font-medium">CPA</div>
                          <div className="text-gray-600">Real-time</div>
                        </div>
                        <div className="bg-white p-3 rounded text-center text-xs">
                          <div className="font-medium">ROAS</div>
                          <div className="text-gray-600">Real-time</div>
                        </div>
                        <div className="bg-white p-3 rounded text-center text-xs">
                          <div className="font-medium">Conversions</div>
                          <div className="text-gray-600">Daily</div>
                        </div>
                        <div className="bg-white p-3 rounded text-center text-xs">
                          <div className="font-medium">Spend</div>
                          <div className="text-gray-600">Real-time</div>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded text-center text-xs">
                        <div className="font-medium">Performance by Creative × Audience Matrix</div>
                        <div className="text-gray-600">Hourly breakdown</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Implementation Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Implementation Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Install Facebook Pixel on landing page</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Setup Google Analytics 4 with enhanced ecommerce</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Configure UTM parameter auto-tagging</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Test all conversion events in Facebook Events Manager</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Setup dashboard with real-time data connections</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Create automated alerts for CPA threshold breaches</span>
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
                Click "Generate Data Setup" to create tracking configurations and analytics dashboard specs
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AgentLayout>
  );
}
import React, { useState } from 'react';
import { AgentLayout } from '../AgentLayout';
import { useCampaign } from '../../context/CampaignContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Play, RotateCcw, Calendar, Clock, Settings } from 'lucide-react';
import { callLLM } from '../../services/llmService';

export function CampaignScheduler() {
  const { campaign, setAgentOutput, getAgentOutput } = useCampaign();
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const existingOutput = getAgentOutput('campaign_scheduler');
  const mediaBuyerOutput = getAgentOutput('media_buyer');
  const dataOpsOutput = getAgentOutput('data_ops');
  const complianceOutput = getAgentOutput('compliance');

  const runAgent = async () => {
    if (!campaign) return;
    
    setIsLoading(true);
    setLogs([]);

    try {
      const response = await callLLM({
        agent: 'campaign_scheduler',
        promptTemplateId: 'campaign_scheduler_v1',
        campaignData: campaign,
        params: {
          test_matrix: mediaBuyerOutput?.test_matrix || [],
          compliance_status: complianceOutput?.compliance_checks || [],
          tracking_setup: dataOpsOutput?.pixel_events || []
        },
        parentOutputs: {
          media_buyer: mediaBuyerOutput,
          data_ops: dataOpsOutput,
          compliance: complianceOutput
        }
      });

      setLogs(response.logs);

      if (response.status === 'ok') {
        setAgentOutput('campaign_scheduler', response.payload);
      }
    } catch (error) {
      setLogs(['Error calling LLM service']);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock schedule data for demonstration
  const mockSchedule = {
    launch_phases: [
      {
        phase: 'Phase 1: Learning',
        start_date: '2025-10-07',
        end_date: '2025-10-14',
        budget_allocation: '30%',
        objective: 'Gather initial performance data and optimize targeting',
        test_cells: ['c-001', 'c-002', 'c-003']
      },
      {
        phase: 'Phase 2: Optimization',
        start_date: '2025-10-14',
        end_date: '2025-10-21',
        budget_allocation: '50%',
        objective: 'Scale winning combinations and pause underperformers',
        test_cells: ['c-001', 'c-004', 'c-005']
      },
      {
        phase: 'Phase 3: Scale',
        start_date: '2025-10-21',
        end_date: '2025-10-31',
        budget_allocation: '100%',
        objective: 'Full budget allocation to proven performers',
        test_cells: ['c-001', 'c-006']
      }
    ],
    automation_rules: [
      {
        rule: 'Auto-pause high CPA',
        condition: 'CPA > 2x target for 24 hours',
        action: 'Pause ad set',
        frequency: 'Every 4 hours'
      },
      {
        rule: 'Auto-scale winners',
        condition: 'CPA < target for 3 days + 95% confidence',
        action: 'Increase budget by 25%',
        frequency: 'Daily at 9 AM'
      }
    ]
  };

  return (
    <AgentLayout
      agentName="Campaign Scheduler"
      agentKey="campaign_scheduler"
      title="Campaign Scheduler"
      description="Create launch schedules, automation rules, and campaign lifecycle management"
      requiredInputs={['media_buyer', 'data_ops', 'compliance']}
      nextAgent="weekly-reports"
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
                <span>{existingOutput ? 'Re-run Analysis' : 'Generate Launch Schedule'}</span>
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

        {/* Campaign Readiness Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Campaign Readiness Check</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${campaign ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">Campaign Configuration</span>
                  <Badge variant={campaign ? 'default' : 'destructive'}>
                    {campaign ? 'Complete' : 'Missing'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${mediaBuyerOutput ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">Test Matrix</span>
                  <Badge variant={mediaBuyerOutput ? 'default' : 'destructive'}>
                    {mediaBuyerOutput ? 'Ready' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${dataOpsOutput ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">Tracking Setup</span>
                  <Badge variant={dataOpsOutput ? 'default' : 'destructive'}>
                    {dataOpsOutput ? 'Configured' : 'Pending'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    complianceOutput?.compliance_checks?.every((check: any) => check.status === 'approved') 
                      ? 'bg-green-500' 
                      : 'bg-orange-500'
                  }`} />
                  <span className="text-sm">Compliance Review</span>
                  <Badge variant={
                    complianceOutput?.compliance_checks?.every((check: any) => check.status === 'approved') 
                      ? 'default' 
                      : 'secondary'
                  }>
                    {complianceOutput?.compliance_checks?.every((check: any) => check.status === 'approved') 
                      ? 'Approved' 
                      : 'In Review'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Creative Assets</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-sm">Landing Page</span>
                  <Badge variant="outline">Live</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Launch Phases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Campaign Launch Phases</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSchedule.launch_phases.map((phase, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{phase.phase}</h4>
                      <p className="text-sm text-gray-600">{phase.objective}</p>
                    </div>
                    <Badge variant="outline">{phase.budget_allocation}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Timeline:</strong>
                      <p>{phase.start_date} to {phase.end_date}</p>
                    </div>
                    <div>
                      <strong>Test Cells:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {phase.test_cells.map((cell) => (
                          <Badge key={cell} variant="secondary" className="text-xs">
                            {cell}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <strong>Budget:</strong>
                      <p>{phase.budget_allocation} of total budget</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Automation Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Automation Rules</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSchedule.automation_rules.map((rule, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{rule.rule}</h4>
                    <Badge variant="outline">{rule.frequency}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Trigger Condition:</strong>
                      <p className="bg-yellow-50 p-2 rounded mt-1">{rule.condition}</p>
                    </div>
                    <div>
                      <strong>Automated Action:</strong>
                      <p className="bg-blue-50 p-2 rounded mt-1">{rule.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Rule */}
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">Custom Automation Rules</h4>
              <p className="text-sm text-gray-600 mb-3">
                Additional rules can be configured based on specific campaign requirements and KPIs.
              </p>
              <Button variant="outline" size="sm">
                Add Custom Rule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Daily Operations Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-medium mb-1">9:00 AM - Morning Review</div>
                  <ul className="text-sm space-y-1">
                    <li>• Check overnight performance</li>
                    <li>• Review automation actions</li>
                    <li>• Apply scaling decisions</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-medium mb-1">2:00 PM - Midday Check</div>
                  <ul className="text-sm space-y-1">
                    <li>• Monitor real-time metrics</li>
                    <li>• Adjust budgets if needed</li>
                    <li>• Check creative fatigue</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 p-3 rounded">
                  <div className="font-medium mb-1">6:00 PM - Evening Optimization</div>
                  <ul className="text-sm space-y-1">
                    <li>• Final budget adjustments</li>
                    <li>• Prepare overnight settings</li>
                    <li>• Schedule next day tests</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-3 rounded">
                  <div className="font-medium mb-1">Weekly Tasks</div>
                  <ul className="text-sm space-y-1">
                    <li>• Generate performance reports</li>
                    <li>• Creative refresh analysis</li>
                    <li>• Competitor monitoring</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Launch Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Pre-Launch Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm">All test cells configured in ad platforms</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm">Tracking pixels installed and tested</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm">UTM parameters configured</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Compliance review completed</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Automation rules activated</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Dashboard monitoring setup</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Team notification preferences set</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button size="lg" className="px-8">
                🚀 Launch Campaign
              </Button>
            </div>
          </CardContent>
        </Card>

        {!existingOutput && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Click "Generate Launch Schedule" to create a comprehensive campaign launch and management plan
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AgentLayout>
  );
}
import React, { useState } from 'react';
import { AgentLayout } from '../AgentLayout';
import { useCampaign } from '../../context/CampaignContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Play, RotateCcw, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { callLLM } from '../../services/llmService';

export function Compliance() {
  const { campaign, setAgentOutput, getAgentOutput } = useCampaign();
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const existingOutput = getAgentOutput('compliance');
  const copywriterOutput = getAgentOutput('copywriter');
  const designerOutput = getAgentOutput('designer');

  const runAgent = async () => {
    if (!campaign) return;
    
    setIsLoading(true);
    setLogs([]);

    try {
      const response = await callLLM({
        agent: 'compliance',
        promptTemplateId: 'compliance_v1',
        campaignData: campaign,
        params: {
          ad_copy: copywriterOutput?.ad_copy || {},
          design_specs: designerOutput?.design_specs || [],
          product_category: campaign.product.category,
          traffic_sources: campaign.traffic_sources
        },
        parentOutputs: {
          copywriter: copywriterOutput,
          designer: designerOutput
        }
      });

      setLogs(response.logs);

      if (response.status === 'ok') {
        setAgentOutput('compliance', response.payload);
      }
    } catch (error) {
      setLogs(['Error calling LLM service']);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'flagged':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'rejected':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'flagged':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'rejected':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <AgentLayout
      agentName="Compliance"
      agentKey="compliance"
      title="Compliance Lead"
      description="Review content for regulatory compliance, platform policies, and brand safety requirements"
      requiredInputs={['copywriter', 'designer']}
      nextAgent="competitor-analysis"
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
                <span>{existingOutput ? 'Re-run Review' : 'Run Compliance Review'}</span>
              </Button>
              
              {existingOutput && (
                <Button 
                  variant="outline" 
                  onClick={runAgent}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Re-review</span>
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
            {/* Compliance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Compliance Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Summary */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Approved</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {existingOutput.compliance_checks?.filter((check: any) => check.status === 'approved').length || 0}
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <span className="font-medium text-orange-800">Flagged</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {existingOutput.compliance_checks?.filter((check: any) => check.status === 'flagged').length || 0}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Total Items</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {existingOutput.compliance_checks?.length || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Checks */}
            <Card>
              <CardHeader>
                <CardTitle>Individual Compliance Checks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {existingOutput.compliance_checks?.map((check: any, index: number) => (
                    <div key={index} className={`border rounded-lg p-4 ${getStatusColor(check.status)}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(check.status)}
                          <span className="font-medium">
                            {check.creative_id && `Creative: ${check.creative_id}`}
                            {check.copy_id && ` • Copy: ${check.copy_id}`}
                          </span>
                        </div>
                        <Badge 
                          variant={check.status === 'approved' ? 'default' : 'destructive'}
                          className="capitalize"
                        >
                          {check.status}
                        </Badge>
                      </div>

                      {check.notes && (
                        <div className="mb-3">
                          <strong>Notes:</strong>
                          <p className="text-sm mt-1">{check.notes}</p>
                        </div>
                      )}

                      {check.flags && check.flags.length > 0 && (
                        <div className="mb-3">
                          <strong>Compliance Flags:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {check.flags.map((flag: string, flagIndex: number) => (
                              <Badge key={flagIndex} variant="destructive" className="text-xs">
                                {flag.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {check.required_edits && check.required_edits.length > 0 && (
                        <div>
                          <strong>Required Edits:</strong>
                          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                            {check.required_edits.map((edit: string, editIndex: number) => (
                              <li key={editIndex}>{edit}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Required Disclaimers */}
            {existingOutput.required_disclaimers && (
              <Card>
                <CardHeader>
                  <CardTitle>Required Disclaimers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {existingOutput.required_disclaimers.map((disclaimer: string, index: number) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{disclaimer}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded">
                    <h4 className="font-medium mb-2">Disclaimer Placement Guidelines</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Place disclaimers prominently and clearly visible</li>
                      <li>• Use font size no smaller than 10pt for print, clearly readable for digital</li>
                      <li>• Position near related claims or at bottom of ad creative</li>
                      <li>• Ensure disclaimers are included in all ad formats and variations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Channel-Specific Restrictions */}
            {existingOutput.channel_restrictions && (
              <Card>
                <CardHeader>
                  <CardTitle>Channel-Specific Restrictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(existingOutput.channel_restrictions).map(([channel, restrictions]) => (
                      <div key={channel} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant="outline" className="capitalize">{channel}</Badge>
                          <span className="font-medium">Platform Requirements</span>
                        </div>
                        
                        <ul className="space-y-1 text-sm">
                          {(restrictions as string[]).map((restriction: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                              <span>{restriction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Compliance Action Items */}
            <Card>
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {existingOutput.compliance_checks?.filter((check: any) => check.status === 'flagged').map((check: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium">
                          {check.creative_id && `Creative ${check.creative_id}`}
                          {check.copy_id && ` / Copy ${check.copy_id}`}
                        </div>
                        {check.required_edits && (
                          <ul className="text-sm text-gray-600 mt-1 space-y-1">
                            {check.required_edits.map((edit: string, editIndex: number) => (
                              <li key={editIndex}>• {edit}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  ))}

                  {existingOutput.compliance_checks?.every((check: any) => check.status === 'approved') && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="font-medium text-green-800 mb-2">All Content Approved</h3>
                      <p className="text-sm text-green-600">
                        All creative assets and copy have passed compliance review and are ready for campaign launch.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!existingOutput && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Click "Run Compliance Review" to analyze content for regulatory and platform policy compliance
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AgentLayout>
  );
}
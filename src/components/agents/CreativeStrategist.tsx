import React, { useState } from 'react';
import { AgentLayout } from '../AgentLayout';
import { useCampaign } from '../../context/CampaignContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Play, RotateCcw, Clock, Users } from 'lucide-react';
import { callLLM } from '../../services/llmService';

export function CreativeStrategist() {
  const { campaign, setAgentOutput, getAgentOutput } = useCampaign();
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const existingOutput = getAgentOutput('creative_strategist');
  const marketingOutput = getAgentOutput('marketing_strategist');

  const runAgent = async () => {
    if (!campaign) return;
    
    setIsLoading(true);
    setLogs([]);

    try {
      const response = await callLLM({
        agent: 'creative_strategist',
        promptTemplateId: 'creative_strategist_v1',
        campaignData: campaign,
        params: {
          product_name: campaign.product.name,
          value_proposition: campaign.product.short_desc,
          constraints: campaign.constraints,
          brand_requirements: campaign.brand_requirements
        },
        parentOutputs: {
          marketing_strategist: marketingOutput
        }
      });

      setLogs(response.logs);

      if (response.status === 'ok') {
        setAgentOutput('creative_strategist', response.payload);
      }
    } catch (error) {
      setLogs(['Error calling LLM service']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AgentLayout
      agentName="Creative Strategist"
      agentKey="creative_strategist"
      title="Creative Strategist"
      description="Generate creative briefs, hooks, and messaging strategies for ad campaigns"
      requiredInputs={['marketing_strategist']}
      nextAgent="video-director"
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
                <span>{existingOutput ? 'Re-run Analysis' : 'Generate Creative Briefs'}</span>
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
            {/* Creative Briefs */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Creative Briefs</h3>
              {existingOutput.briefs?.map((brief: any) => (
                <Card key={brief.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{brief.title}</CardTitle>
                      <Badge variant="outline">{brief.id}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Value Proposition */}
                    <div>
                      <h4 className="font-medium mb-2">Value Proposition</h4>
                      <p className="text-sm bg-blue-50 p-3 rounded">{brief.value_prop}</p>
                    </div>

                    {/* Hooks */}
                    <div>
                      <h4 className="font-medium mb-2">Hooks</h4>
                      <div className="grid gap-2">
                        {brief.hooks?.map((hook: string, index: number) => (
                          <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                            "{hook}"
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Target Audience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          Target Audience
                        </h4>
                        <div className="text-sm space-y-1">
                          <p><strong>Age:</strong> {brief.audience?.age_min}-{brief.audience?.age_max}</p>
                          <div>
                            <strong>Interests:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {brief.audience?.interests?.map((interest: string) => (
                                <Badge key={interest} variant="outline" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Format Recommendations
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {brief.format_recs?.map((format: string) => (
                            <Badge key={format} variant="secondary" className="text-xs">
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Thumbnail Concept */}
                    <div>
                      <h4 className="font-medium mb-2">Thumbnail Concept</h4>
                      <p className="text-sm bg-green-50 p-3 rounded">{brief.thumbnail_idea}</p>
                    </div>

                    {/* Tone & Messaging */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Tone</h4>
                        <p className="text-sm">{brief.tone}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Messaging Pillars</h4>
                        <div className="flex flex-wrap gap-1">
                          {brief.messaging_pillars?.map((pillar: string) => (
                            <Badge key={pillar} variant="outline" className="text-xs">
                              {pillar}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Creative Themes */}
            {existingOutput.creative_themes && (
              <Card>
                <CardHeader>
                  <CardTitle>Creative Themes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {existingOutput.creative_themes.map((theme: string, index: number) => (
                      <Badge key={index} variant="secondary" className="justify-center p-2">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended Formats */}
            {existingOutput.recommended_formats && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Formats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="font-medium">Primary Format</span>
                      <Badge variant="default">{existingOutput.recommended_formats.primary}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">Secondary Format</span>
                      <Badge variant="secondary">{existingOutput.recommended_formats.secondary}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">Tertiary Format</span>
                      <Badge variant="outline">{existingOutput.recommended_formats.tertiary}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!existingOutput && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Click "Generate Creative Briefs" to create comprehensive creative strategies
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AgentLayout>
  );
}
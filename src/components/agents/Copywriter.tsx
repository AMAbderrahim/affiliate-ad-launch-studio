import React, { useState } from 'react';
import { AgentLayout } from '../AgentLayout';
import { useCampaign } from '../../context/CampaignContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Play, RotateCcw, FileText, MessageSquare } from 'lucide-react';
import { callLLM } from '../../services/llmService';

export function Copywriter() {
  const { campaign, setAgentOutput, getAgentOutput } = useCampaign();
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const existingOutput = getAgentOutput('copywriter');
  const creativeOutput = getAgentOutput('creative_strategist');

  const runAgent = async () => {
    if (!campaign) return;
    
    setIsLoading(true);
    setLogs([]);

    try {
      const response = await callLLM({
        agent: 'copywriter',
        promptTemplateId: 'copywriter_v1',
        campaignData: campaign,
        params: {
          creative_briefs: creativeOutput?.briefs || [],
          product_benefits: campaign.product.short_desc
        },
        parentOutputs: {
          creative_strategist: creativeOutput
        }
      });

      setLogs(response.logs);

      if (response.status === 'ok') {
        setAgentOutput('copywriter', response.payload);
      }
    } catch (error) {
      setLogs(['Error calling LLM service']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AgentLayout
      agentName="Copywriter"
      agentKey="copywriter"
      title="Copywriter"
      description="Create compelling ad copy, headlines, CTAs, and landing page content optimized for conversion"
      requiredInputs={['creative_strategist']}
      nextAgent="media-buyer"
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
                <span>{existingOutput ? 'Re-run Analysis' : 'Generate Copy Variations'}</span>
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
            {/* Ad Copy Variations */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Ad Copy Variations</h3>
              
              {/* Short Form Copy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Short-Form Ad Copy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {existingOutput.ad_copy?.short_form?.map((copy: any) => (
                      <div key={copy.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="outline">{copy.id}</Badge>
                          <div className="flex space-x-2">
                            <Badge variant="secondary">Brief: {copy.brief_id}</Badge>
                            <Badge variant="outline">{copy.character_count} chars</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium mb-1">Headline</h4>
                            <p className="bg-blue-50 p-3 rounded">{copy.headline}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-1">Body</h4>
                            <p className="bg-gray-50 p-3 rounded">{copy.body}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-1">CTA</h4>
                            <p className="bg-green-50 p-3 rounded font-medium">{copy.cta}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Long Form Copy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Long-Form Ad Copy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {existingOutput.ad_copy?.long_form?.map((copy: any) => (
                      <div key={copy.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="outline">{copy.id}</Badge>
                          <div className="flex space-x-2">
                            <Badge variant="secondary">Brief: {copy.brief_id}</Badge>
                            <Badge variant="outline">{copy.word_count} words</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium mb-1">Headline</h4>
                            <p className="bg-blue-50 p-3 rounded">{copy.headline}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-1">Body</h4>
                            <div className="bg-gray-50 p-3 rounded whitespace-pre-line">
                              {copy.body}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-1">CTA</h4>
                            <p className="bg-green-50 p-3 rounded font-medium">{copy.cta}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Landing Page Copy */}
            {existingOutput.landing_page_copy && (
              <Card>
                <CardHeader>
                  <CardTitle>Landing Page Copy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Hero Section</h4>
                    <div className="space-y-2">
                      <div>
                        <strong>Headline:</strong>
                        <p className="bg-blue-50 p-3 rounded mt-1">{existingOutput.landing_page_copy.hero_headline}</p>
                      </div>
                      <div>
                        <strong>Subtext:</strong>
                        <p className="bg-gray-50 p-3 rounded mt-1">{existingOutput.landing_page_copy.hero_subtext}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Benefits</h4>
                    <div className="space-y-1">
                      {existingOutput.landing_page_copy.benefits?.map((benefit: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Testimonial Headlines</h4>
                    <div className="grid gap-2">
                      {existingOutput.landing_page_copy.testimonial_headlines?.map((headline: string, index: number) => (
                        <div key={index} className="bg-yellow-50 p-2 rounded text-sm">
                          "{headline}"
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Email Sequences */}
            {existingOutput.email_sequences && (
              <Card>
                <CardHeader>
                  <CardTitle>Email Sequence Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {existingOutput.email_sequences.map((email: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <Badge variant="outline">Day {email.day}</Badge>
                        </div>
                        <div className="space-y-1">
                          <div>
                            <strong>Subject:</strong> {email.subject}
                          </div>
                          <div>
                            <strong>Preview:</strong> {email.preview}
                          </div>
                        </div>
                      </div>
                    ))}
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
                Click "Generate Copy Variations" to create compelling ad copy and landing page content
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AgentLayout>
  );
}
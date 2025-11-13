import React, { useState } from 'react';
import { AgentLayout } from '../AgentLayout';
import { useCampaign } from '../../context/CampaignContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Play, RotateCcw, Palette, Monitor } from 'lucide-react';
import { callLLM } from '../../services/llmService';

export function Designer() {
  const { campaign, setAgentOutput, getAgentOutput } = useCampaign();
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const existingOutput = getAgentOutput('designer');
  const creativeOutput = getAgentOutput('creative_strategist');
  const videoOutput = getAgentOutput('video_director');

  const runAgent = async () => {
    if (!campaign) return;
    
    setIsLoading(true);
    setLogs([]);

    try {
      const response = await callLLM({
        agent: 'designer',
        promptTemplateId: 'designer_v1',
        campaignData: campaign,
        params: {
          creative_briefs: creativeOutput?.briefs || [],
          video_scripts: videoOutput?.scripts || []
        },
        parentOutputs: {
          creative_strategist: creativeOutput,
          video_director: videoOutput
        }
      });

      setLogs(response.logs);

      if (response.status === 'ok') {
        setAgentOutput('designer', response.payload);
      }
    } catch (error) {
      setLogs(['Error calling LLM service']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AgentLayout
      agentName="Designer"
      agentKey="designer"
      title="Designer"
      description="Create visual design specifications, layouts, and asset requirements for campaigns"
      requiredInputs={['creative_strategist', 'video_director']}
      nextAgent="copywriter"
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
                <span>{existingOutput ? 'Re-run Analysis' : 'Generate Design Specs'}</span>
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
            {/* Design Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Design Specifications</h3>
              {existingOutput.design_specs?.map((spec: any) => (
                <Card key={spec.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center space-x-2">
                        <Monitor className="w-5 h-5" />
                        <span>{spec.type.replace('_', ' ').toUpperCase()}</span>
                      </CardTitle>
                      <Badge variant="secondary">Brief: {spec.brief_id}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Dimensions */}
                    <div>
                      <h4 className="font-medium mb-2">Platform Dimensions</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(spec.dimensions || {}).map(([platform, size]) => (
                          <Badge key={platform} variant="outline" className="justify-center p-2">
                            {platform}: {size as string}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Layout */}
                    <div>
                      <h4 className="font-medium mb-2">Layout Structure</h4>
                      <div className="bg-gray-50 p-4 rounded space-y-2">
                        {Object.entries(spec.layout || {}).map(([element, position]) => (
                          <div key={element} className="flex justify-between text-sm">
                            <span className="capitalize">{element.replace('_', ' ')}:</span>
                            <span>{position as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Typography */}
                    <div>
                      <h4 className="font-medium mb-2">Typography</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <strong>Fonts:</strong>
                          <div className="mt-1 space-y-1 text-sm">
                            {Object.entries(spec.typography || {}).filter(([key]) => key.includes('font')).map(([type, font]) => (
                              <div key={type}>
                                {type.replace('_', ' ')}: {font as string}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <strong>Sizes:</strong>
                          <div className="mt-1 space-y-1 text-sm">
                            {Object.entries(spec.typography?.sizes || {}).map(([element, size]) => (
                              <div key={element}>
                                {element}: {size as string}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Color Palette */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Palette className="w-4 h-4 mr-1" />
                        Color Palette
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(spec.color_palette || {}).map(([name, color]) => (
                          <div key={name} className="flex items-center space-x-2">
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: color as string }}
                            />
                            <div className="text-sm">
                              <div className="capitalize">{name.replace('_', ' ')}</div>
                              <div className="text-gray-500">{color as string}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Design Elements */}
                    <div>
                      <h4 className="font-medium mb-2">Required Elements</h4>
                      <div className="flex flex-wrap gap-1">
                        {spec.elements?.map((element: string) => (
                          <Badge key={element} variant="outline" className="text-xs">
                            {element}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Thumbnail Concepts */}
            {existingOutput.thumbnail_concepts && (
              <Card>
                <CardHeader>
                  <CardTitle>Thumbnail Concepts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {existingOutput.thumbnail_concepts.map((concept: any) => (
                      <div key={concept.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{concept.concept}</h4>
                          <Badge variant="outline">{concept.id}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{concept.description}</p>
                        <div className="bg-blue-50 p-3 rounded">
                          <strong>Text Overlay:</strong> "{concept.text_overlay}"
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Asset Requirements */}
            {existingOutput.asset_requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Asset Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Source Files</h4>
                      <div className="space-y-1 text-sm">
                        {existingOutput.asset_requirements.source_files?.map((file: string) => (
                          <div key={file}>{file}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Export Formats</h4>
                      <div className="space-y-1 text-sm">
                        {existingOutput.asset_requirements.export_formats?.map((format: string) => (
                          <div key={format}>{format}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Naming Convention</h4>
                      <div className="text-sm bg-gray-50 p-2 rounded">
                        {existingOutput.asset_requirements.naming_convention}
                      </div>
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
                Click "Generate Design Specs" to create detailed visual design specifications
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AgentLayout>
  );
}
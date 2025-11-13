import React, { useState } from 'react';
import { AgentLayout } from '../AgentLayout';
import { useCampaign } from '../../context/CampaignContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Play, RotateCcw, Film, Clock } from 'lucide-react';
import { callLLM } from '../../services/llmService';

export function VideoDirector() {
  const { campaign, setAgentOutput, getAgentOutput } = useCampaign();
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const existingOutput = getAgentOutput('video_director');
  const creativeOutput = getAgentOutput('creative_strategist');

  const runAgent = async () => {
    if (!campaign) return;
    
    setIsLoading(true);
    setLogs([]);

    try {
      const response = await callLLM({
        agent: 'video_director',
        promptTemplateId: 'video_director_v1',
        campaignData: campaign,
        params: {
          creative_briefs: creativeOutput?.briefs || []
        },
        parentOutputs: {
          creative_strategist: creativeOutput
        }
      });

      setLogs(response.logs);

      if (response.status === 'ok') {
        setAgentOutput('video_director', response.payload);
      }
    } catch (error) {
      setLogs(['Error calling LLM service']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AgentLayout
      agentName="Video Director"
      agentKey="video_director"
      title="Video Director / Editor"
      description="Create video scripts, shot lists, and editing specifications for ad creatives"
      requiredInputs={['creative_strategist']}
      nextAgent="designer"
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
                <span>{existingOutput ? 'Re-run Analysis' : 'Generate Video Scripts'}</span>
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
            {/* Video Scripts */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Video Scripts</h3>
              {existingOutput.scripts?.map((script: any) => (
                <Card key={script.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center space-x-2">
                        <Film className="w-5 h-5" />
                        <span>Script {script.id}</span>
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Badge variant="outline">{script.duration}</Badge>
                        <Badge variant="secondary">Brief: {script.brief_id}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Script Timeline */}
                    <div className="space-y-3">
                      {script.scenes?.map((scene: any) => (
                        <div key={scene.scene_number} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{scene.timing}</span>
                            </Badge>
                            <span className="font-medium">Scene {scene.scene_number}</span>
                          </div>
                          
                          <div className="grid gap-2 text-sm">
                            <div>
                              <strong>Shot:</strong> {scene.shot_description}
                            </div>
                            {scene.dialogue && (
                              <div>
                                <strong>Dialogue:</strong> {scene.dialogue}
                              </div>
                            )}
                            <div>
                              <strong>On-screen text:</strong> {scene.on_screen_text}
                            </div>
                            <div>
                              <strong>Captions:</strong> {scene.captions}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Production Notes */}
                    <div className="bg-gray-50 p-4 rounded space-y-2">
                      <h4 className="font-medium">Production Notes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Pacing:</strong> {script.pacing_notes}
                        </div>
                        <div>
                          <strong>Music:</strong> {script.music_style}
                        </div>
                        <div className="md:col-span-2">
                          <strong>Color Palette:</strong> {script.color_palette}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Production Specifications */}
            {existingOutput.production_specs && (
              <Card>
                <CardHeader>
                  <CardTitle>Production Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Technical Specs</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Aspect Ratios:</strong> {existingOutput.production_specs.aspect_ratios?.join(', ')}</div>
                        <div><strong>Resolutions:</strong> {existingOutput.production_specs.resolutions?.join(', ')}</div>
                        <div><strong>Frame Rate:</strong> {existingOutput.production_specs.frame_rate}</div>
                        <div><strong>Formats:</strong> {existingOutput.production_specs.formats?.join(', ')}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Editing Guidelines</h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(existingOutput.editing_guidelines || {}).map(([key, value]) => (
                          <div key={key}>
                            <strong>{key.replace('_', ' ')}:</strong> {value as string}
                          </div>
                        ))}
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
                Click "Generate Video Scripts" to create detailed video production plans
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AgentLayout>
  );
}
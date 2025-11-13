import React, { useState } from 'react';
import { AgentLayout } from '../AgentLayout';
import { useCampaign } from '../../context/CampaignContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Play, RotateCcw, FileText, Copy } from 'lucide-react';
import { callLLM } from '../../services/llmService';

export function PromptGenerator() {
  const { campaign, setAgentOutput, getAgentOutput } = useCampaign();
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const existingOutput = getAgentOutput('prompt_generator');

  const runAgent = async () => {
    if (!campaign) return;
    
    setIsLoading(true);
    setLogs([]);

    try {
      const response = await callLLM({
        agent: 'prompt_generator',
        promptTemplateId: 'prompt_generator_v1',
        campaignData: campaign,
        params: {
          campaign_context: campaign,
          required_agents: ['marketing_strategist', 'creative_strategist', 'video_director', 'designer', 'copywriter', 'media_buyer', 'data_ops', 'compliance', 'competitor_analysis']
        }
      });

      setLogs(response.logs);

      if (response.status === 'ok') {
        setAgentOutput('prompt_generator', response.payload);
      }
    } catch (error) {
      setLogs(['Error calling LLM service']);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(promptId);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  // Mock prompt templates for demonstration
  const mockPrompts = {
    marketing_strategist: {
      system: "You are a Marketing Strategist focused on acquisition and ROI. Always output JSON matching the provided schema.",
      template: `Campaign: {{campaign.name}}
Product: {{product.name}} - {{product.short_desc}}
Primary Goal: {{goals.primary_kpi}} target {{goals.target_cpa}} USD
Budget: ${'{{budget.daily}}'}/day, ${'{{budget.total}}'} total
Geography: {{geo}}
Traffic Sources: {{traffic_sources}}

Generate target audiences, performance hypotheses, and budget allocation. Output JSON with:
- audiences: array of audience objects with id, name, criteria, estimated_cpa
- hypotheses: array of hypothesis objects with angle, audience_id, expected_lift
- budget_split: array of channel allocations with channel, pct, reasoning`,
      temperature: 0.3,
      max_tokens: 1500
    },
    creative_strategist: {
      system: "You are a senior creative strategist. Output MUST be JSON only and conform to the schema.",
      template: `Campaign: {{campaign.name}}
Product: {{product.name}} - {{product.short_desc}}
Marketing Insights: {{parent_outputs.marketing_strategist.audiences}}
Constraints: {{constraints}}

Generate 5 creative briefs. For each brief return:
- id, title, value_prop, hooks (3 short hooks), audience (age_min, age_max, interests), format_recs, thumbnail_idea, tone, messaging_pillars

Output JSON: { "briefs": [...] }`,
      temperature: 0.4,
      max_tokens: 2000
    }
  };

  return (
    <AgentLayout
      agentName="Prompt Generator"
      agentKey="prompt_generator"
      title="Prompt Generator (Meta-Prompter)"
      description="Generate modular, reusable prompts for all agent workflows with parameter interpolation"
      requiredInputs={[]}
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
                <span>{existingOutput ? 'Re-generate Prompts' : 'Generate Prompt Library'}</span>
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

        {/* Prompt Library */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Modular Prompt Templates</h3>
          
          {Object.entries(mockPrompts).map(([agentKey, prompt]) => (
            <Card key={agentKey}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span className="capitalize">{agentKey.replace('_', ' ')}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Temp: {prompt.temperature}</Badge>
                    <Badge variant="outline">Tokens: {prompt.max_tokens}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* System Message */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">System Message</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(prompt.system, `${agentKey}-system`)}
                      className="flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedPrompt === `${agentKey}-system` ? 'Copied!' : 'Copy'}</span>
                    </Button>
                  </div>
                  <div className="bg-blue-50 p-3 rounded text-sm font-mono">
                    {prompt.system}
                  </div>
                </div>

                {/* User Template */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">User Template</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(prompt.template, `${agentKey}-template`)}
                      className="flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedPrompt === `${agentKey}-template` ? 'Copied!' : 'Copy'}</span>
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-sm font-mono whitespace-pre-wrap">
                    {prompt.template}
                  </div>
                </div>

                {/* Parameter Placeholders */}
                <div>
                  <h4 className="font-medium mb-2">Available Parameters</h4>
                  <div className="flex flex-wrap gap-1">
                    {prompt.template.match(/\{\{[^}]+\}\}/g)?.map((param, index) => (
                      <Badge key={index} variant="outline" className="text-xs font-mono">
                        {param}
                      </Badge>
                    )) || []}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Prompt Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Prompt Engineering Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Parameter Interpolation</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Use <code className="bg-gray-100 px-1 rounded">{'{{variable}}'}</code> syntax for parameter placeholders</li>
                  <li>Support nested object access with <code className="bg-gray-100 px-1 rounded">{'{{campaign.product.name}}'}</code></li>
                  <li>Array access with <code className="bg-gray-100 px-1 rounded">{'{{audiences[0].name}}'}</code></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Safety & Validation</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>All prompts include JSON schema validation requirements</li>
                  <li>System messages enforce output format compliance</li>
                  <li>Parameter sanitization prevents prompt injection</li>
                  <li>Fallback templates for missing required parameters</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Template Storage</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Store templates in Cloudflare KV for fast global access</li>
                  <li>Version control with semantic versioning (v1, v2, etc.)</li>
                  <li>A/B test different prompt variations</li>
                  <li>Audit trail for all prompt executions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {!existingOutput && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Click "Generate Prompt Library" to create reusable prompt templates for all agents
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AgentLayout>
  );
}
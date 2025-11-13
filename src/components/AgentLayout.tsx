import React, { ReactNode } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AgentLayoutProps {
  agentName: string;
  agentKey: string;
  title: string;
  description: string;
  requiredInputs: string[];
  children: ReactNode;
  nextAgent?: string;
}

export function AgentLayout({ 
  agentName, 
  agentKey, 
  title, 
  description, 
  requiredInputs, 
  children, 
  nextAgent 
}: AgentLayoutProps) {
  const { 
    campaign, 
    areRequiredInputsReady, 
    isAgentComplete, 
    getAgentOutput,
    getRequiredInputs 
  } = useCampaign();

  if (!campaign) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl mb-2">Campaign Required</h2>
            <p className="text-gray-600 mb-4">
              Please create a campaign in the Data Hub before accessing agent pages.
            </p>
            <Link to="/data-hub">
              <Button>Go to Data Hub</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isReady = areRequiredInputsReady(agentKey as any);
  const isComplete = isAgentComplete(agentKey as any);
  const dependencies = getRequiredInputs(agentKey as any);
  const output = getAgentOutput(agentKey as any);

  const getInputStatus = (inputKey: string) => {
    return isAgentComplete(inputKey as any) ? 'complete' : 'pending';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </div>
          {isComplete && (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campaign Info */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-base">Campaign Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Product</span>
                <span className="text-sm">{campaign.product.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Primary Goal</span>
                <Badge variant="outline">{campaign.goals.primary_kpi}</Badge>
              </div>
              {campaign.goals.target_cpa && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Target CPA</span>
                  <span className="text-sm">${campaign.goals.target_cpa}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Daily Budget</span>
                <span className="text-sm">${campaign.budget.daily}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Geography</span>
                <span className="text-sm">{campaign.geo.join(', ')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dependencies */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Agent Dependencies</span>
              {isReady && (
                <Badge variant="outline" className="text-green-600 border-green-300">
                  Ready to Run
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dependencies.length === 0 ? (
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No dependencies required</span>
              </div>
            ) : (
              <div className="space-y-2">
                {dependencies.map((dep) => {
                  const status = getInputStatus(dep);
                  return (
                    <div 
                      key={dep} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {status === 'complete' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-orange-400" />
                        )}
                        <span className="text-sm capitalize">
                          {dep.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <Badge 
                        variant={status === 'complete' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {status === 'complete' ? 'Complete' : 'Pending'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Previous Output (if complete) */}
      {isComplete && output && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Saved Output</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
              <pre className="text-xs overflow-auto max-h-64 text-gray-700">
                {JSON.stringify(output, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {isReady ? (
        <div>
          {children}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg mb-2">Dependencies Not Ready</h3>
            <p className="text-gray-600 mb-4">
              This agent requires output from upstream agents before it can run.
            </p>
            <div className="space-y-2">
              {dependencies.map((dep) => (
                <div key={dep} className="flex items-center justify-center space-x-2">
                  <Badge variant="secondary">
                    {getInputStatus(dep) === 'complete' ? '✓' : '○'}
                  </Badge>
                  <span className="capitalize">{dep.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {isComplete && nextAgent && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium mb-1">✨ Great work! Ready for the next step?</h4>
                <p className="text-sm text-gray-600">Continue your campaign workflow with the next agent</p>
              </div>
              <Link to={`/${nextAgent}`}>
                <Button className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <span>Continue to Next Agent</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import React from 'react';
import { Card, CardContent } from './ui/card';
import { Loader2, Sparkles } from 'lucide-react';

interface AgentLoadingStateProps {
  agentName: string;
  logs?: string[];
}

export function AgentLoadingState({ agentName, logs = [] }: AgentLoadingStateProps) {
  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin absolute -bottom-2 -right-2" />
          </div>
          
          <div>
            <h3 className="text-xl mb-2">AI Agent Processing...</h3>
            <p className="text-gray-600">
              {agentName} is analyzing your campaign data and generating insights
            </p>
          </div>

          {logs.length > 0 && (
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h4 className="text-sm mb-2 text-gray-600">Processing Log:</h4>
                <div className="space-y-1 text-sm text-left">
                  {logs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-2 text-gray-700">
                      <span className="text-blue-500 flex-shrink-0">▸</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>This typically takes 3-5 seconds</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

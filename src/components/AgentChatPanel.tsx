import React, { useState, useEffect, useRef } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { MessageSquare, Send, Sparkles, User, Bot, Lightbulb } from 'lucide-react';
import { sendChatMessage, getWorkerConfig } from '../services/workerService';

interface ChatMessage {
  id: string;
  from: 'user' | 'agent' | 'system';
  text: string;
  timestamp: Date;
  structured?: any;
}

interface AgentChatPanelProps {
  agentContext?: string;
  quickActions?: Array<{ label: string; prompt: string }>;
}

export function AgentChatPanel({ agentContext, quickActions }: AgentChatPanelProps) {
  const { campaign } = useCampaign();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const workerConfig = getWorkerConfig();

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: '0',
      from: 'system',
      text: '🤖 CampaignGPT ready. Ask me anything about your campaign!',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      from: 'user',
      text: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history
      const history = messages.map(m => ({
        role: m.from === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      // Add context if provided
      let contextualMessage = messageText;
      if (agentContext) {
        contextualMessage = `Context: ${agentContext}\n\nUser question: ${messageText}`;
      }

      const response = await sendChatMessage(
        contextualMessage,
        campaign,
        history
      );

      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        from: 'agent',
        text: response.error ? `Error: ${response.error}` : response.reply,
        timestamp: new Date(),
        structured: response.structured,
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        from: 'agent',
        text: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  const defaultQuickActions = [
    { label: '📊 Campaign Summary', prompt: 'Summarize this campaign in one paragraph' },
    { label: '✍️ Ad Copy Ideas', prompt: 'Give me 3 ad copy variations with headlines' },
    { label: '🎯 Targeting Tips', prompt: 'Suggest audience targeting improvements' },
    { label: '📈 Optimization Ideas', prompt: 'How can I optimize this campaign?' },
  ];

  const actions = quickActions || defaultQuickActions;

  return (
    <Card className="h-full flex flex-col border-l-4 border-l-purple-500">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span>CampaignGPT</span>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            AI Assistant
          </Badge>
        </CardTitle>
      </CardHeader>

      {/* Quick Actions */}
      <div className="p-3 border-b bg-gray-50">
        <p className="text-xs text-gray-600 mb-2">Quick Actions:</p>
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.prompt)}
              disabled={isLoading}
              className="text-xs"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[85%] ${
                  message.from === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.from === 'user'
                      ? 'bg-blue-500'
                      : message.from === 'system'
                      ? 'bg-gray-400'
                      : 'bg-gradient-to-br from-purple-500 to-blue-600'
                  }`}
                >
                  {message.from === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.from === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.from === 'system'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {message.structured && (
                    <details className="mt-2 text-xs">
                      <summary className="cursor-pointer opacity-70 hover:opacity-100">
                        View structured data
                      </summary>
                      <pre className="mt-2 p-2 bg-white/50 rounded overflow-auto max-h-40">
                        {JSON.stringify(message.structured, null, 2)}
                      </pre>
                    </details>
                  )}
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-lg p-3">
                <Bot className="w-4 h-4 text-purple-600 animate-pulse" />
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Ask CampaignGPT anything..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </Card>
  );
}

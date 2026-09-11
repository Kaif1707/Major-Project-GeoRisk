import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw } from 'lucide-react';
import { useAiChatMutation } from '@/hooks/useAiNewsForecastData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  confidence?: number;
  sources?: string[];
}

export const AIAssistantPage: React.FC = () => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Welcome to GeoRisk AI Quantitative Analyst!\n\nI analyze real-time sovereign metrics across 45+ nations. You can ask me about specific countries (e.g. "India", "Germany", "USA"), compare sovereign risks, or query safest investment havens.',
      confidence: 0.98,
      sources: ['GeoRisk Knowledge Base'],
    },
  ]);

  const aiChatMutation = useAiChatMutation();

  const handleSendPrompt = (promptText?: string) => {
    const textToSend = promptText || inputPrompt;
    if (!textToSend.trim() || aiChatMutation.isPending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInputPrompt('');

    aiChatMutation.mutate(textToSend, {
      onSuccess: (data) => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.data.reply,
          confidence: data.data.confidence,
          sources: data.data.sources,
        };
        setMessages((prev) => [...prev, aiMsg]);
      },
    });
  };

  const suggestedPrompts = [
    'India',
    'Germany',
    'Compare United States and Germany',
    'Which Asian countries are safest for investment?',
    'Top safest investment havens',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-brand-400" /> RAG GeoRisk AI Intelligence Assistant
          </h1>
          <p className="text-xs text-gray-400 mt-1">Ask questions, request country dossiers, and generate institutional investment briefings grounded in live data.</p>
        </div>
      </div>

      {/* Chat Workspace */}
      <Card className="p-0 overflow-hidden flex flex-col h-[600px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-base/50">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl rounded-xl p-4 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none font-medium'
                  : 'bg-surface-elevated border border-surface-border text-gray-200 rounded-tl-none space-y-2'
              }`}>
                <div className="whitespace-pre-wrap font-sans text-xs">
                  {m.text.split('\n').map((line, idx) => {
                    if (line.startsWith('Sovereign Risk Dossier:') || line.startsWith('Sovereign Risk Comparison:') || line.startsWith('Top 5')) {
                      return <div key={idx} className="font-bold text-sm text-brand-300 pb-1 mb-1 border-b border-surface-border">{line}</div>;
                    }
                    if (line.startsWith('• ') || line.startsWith('  - ')) {
                      return <div key={idx} className="pl-2 py-0.5 text-gray-300 font-mono">{line}</div>;
                    }
                    return <div key={idx}>{line}</div>;
                  })}
                </div>

                {m.sender === 'ai' && m.confidence && (
                  <div className="pt-2 border-t border-surface-border flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <span>Grounding Confidence: {(m.confidence * 100).toFixed(0)}%</span>
                    <span>Sources: {m.sources?.join(', ') || 'Global DB'}</span>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-gray-700 text-gray-200 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {aiChatMutation.isPending && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-surface-elevated border border-surface-border text-gray-400 rounded-xl p-3 text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-spin" /> Retrieving context & synthesizing analyst briefing...
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompt Pills */}
        <div className="p-3 bg-surface-base border-t border-surface-border flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-400 mr-1">Quick Prompts:</span>
          {suggestedPrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(sp)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-surface-elevated border border-surface-border text-gray-300 hover:text-white hover:border-brand-500/50 transition-colors"
            >
              {sp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-surface-elevated border-t border-surface-border flex items-center gap-2">
          <input
            type="text"
            placeholder="Type country name (e.g. India, Germany) or ask a question..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            className="flex-1 bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-500"
          />
          <Button variant="primary" size="sm" onClick={() => handleSendPrompt()} disabled={aiChatMutation.isPending}>
            <Send className="w-4 h-4 mr-1" /> Ask AI
          </Button>
        </div>
      </Card>
    </div>
  );
};

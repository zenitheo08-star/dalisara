import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Loader2, Sparkles, RotateCcw } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const SUGGESTED_QUESTIONS = [
  'How do airport transfers work?',
  'What are the seasonal minimum stays?',
  'Explain the Shore Pavilions.',
  'Can I arrange a simulated dinner at The Shore Kitchen?',
];

export function GuestConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: 'Good day. I am the Dalisara digital host. How may I assist you with details regarding our pavilions, transfers, dining, or seasonal guidelines?' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMessage = queryText.trim();
    setInputValue('');
    
    // Optimistically add user message
    const newHistory = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Convert internal format to Gemini format
      const geminiHistory = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: geminiHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'model', text: data.text || 'I am at your service. Please let me know how else I may assist you.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Apologies, I am experiencing a brief network pause. Please try asking again in a moment.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    sendQuery(inputValue);
  };

  const handleKeyDown = (e: import('react').KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([
      { 
        role: 'model', 
        text: 'Good day. I am the Dalisara digital host. How may I assist you with details regarding our pavilions, transfers, dining, or seasonal guidelines?' 
      }
    ]);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="bg-ink-900 text-sand-50 p-4 rounded-full shadow-2xl hover:bg-ink-800 transition-colors flex items-center justify-center border border-sand-50/20 group"
              aria-label="Open Concierge Host"
            >
              <MessageSquare className="w-5 h-5 group-hover:rotate-6 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 right-0 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[calc(100vh-5rem)] bg-sand-50 border border-ink-900/15 shadow-2xl flex flex-col overflow-hidden rounded-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink-900/10 bg-sand-100/90 backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
                  <div>
                    <h3 className="font-serif text-base italic tracking-tight text-ink-900">Dalisara Host</h3>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-ink-700 opacity-60">Digital Concierge</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleReset}
                    className="p-1.5 text-ink-700 hover:text-ink-900 transition-colors rounded-full hover:bg-ink-900/5"
                    title="Reset conversation"
                    aria-label="Reset conversation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-ink-700 hover:text-ink-900 transition-colors rounded-full hover:bg-ink-900/5"
                    aria-label="Close Concierge"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-grow overflow-y-auto p-5 space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] p-3.5 text-xs md:text-sm leading-relaxed rounded-xl ${
                        msg.role === 'user' 
                          ? 'bg-ink-900 text-sand-50 rounded-tr-none' 
                          : 'bg-sand-100 border border-ink-900/10 text-ink-900 rounded-tl-none shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[85%] p-3.5 bg-sand-100 border border-ink-900/10 text-ink-900 flex items-center space-x-2 rounded-xl rounded-tl-none">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-ink-600" />
                      <span className="text-[10px] uppercase tracking-widest text-ink-500 font-mono">Composing</span>
                    </div>
                  </motion.div>
                )}

                {/* Suggested questions if only 1 initial message */}
                {messages.length === 1 && !isLoading && (
                  <div className="pt-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink-400">
                      <Sparkles className="w-3 h-3" />
                      <span>Suggested inquiries</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {SUGGESTED_QUESTIONS.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendQuery(q)}
                          className="text-left text-xs p-2.5 rounded-lg bg-sand-100/80 hover:bg-sand-200/80 text-ink-800 border border-ink-900/5 transition-all text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3.5 bg-sand-100/90 border-t border-ink-900/10">
                <div className="relative flex items-center">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about pavilions, transfers, policies..."
                    className="w-full bg-sand-50 border border-ink-900/15 rounded-xl p-3 pr-10 text-xs md:text-sm text-ink-900 placeholder:text-ink-900/40 focus:outline-none focus:border-ink-900/40 resize-none h-11 py-2.5 scrollbar-hide shadow-inner"
                    rows={1}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    className="absolute right-2 p-1.5 text-ink-900/60 hover:text-ink-900 disabled:opacity-30 transition-colors"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[9px] text-ink-400 text-center mt-1.5 uppercase tracking-widest">
                  Simulation Host &bull; Portfolio Concept
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

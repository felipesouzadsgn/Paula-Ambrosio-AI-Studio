import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { Plus, MessageSquare, Settings, User, Sparkles, Send, Loader2, X, ChevronLeft } from 'lucide-react';

interface Persona {
  id: string;
  name: string;
  role: string;
  personality: string;
  tone: string;
  avatarUrl: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const DEFAULT_PERSONAS: Persona[] = [
  {
    id: 'paula',
    name: 'Paula Ambrosio',
    role: 'Principal Architect',
    personality: 'Sophisticated, visionary, detail-oriented, and deeply knowledgeable about high-end luxury design.',
    tone: 'Professional, elegant, inspiring, and confident.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'marcus',
    name: 'Marcus Vance',
    role: 'Lighting Specialist',
    personality: 'Technical, moody, artistic, obsessed with how light shapes space and emotion.',
    tone: 'Analytical, poetic, precise.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  }
];

export function Assistants() {
  const [personas, setPersonas] = useState<Persona[]>(DEFAULT_PERSONAS);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New Persona State
  const [newPersona, setNewPersona] = useState<Partial<Persona>>({
    name: '',
    role: 'Interior Designer',
    personality: '',
    tone: '',
    avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${Date.now()}`
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleCreatePersona = () => {
    if (!newPersona.name || !newPersona.personality) return;
    
    const persona: Persona = {
      id: `custom-${Date.now()}`,
      name: newPersona.name,
      role: newPersona.role || 'Designer',
      personality: newPersona.personality,
      tone: newPersona.tone || 'Professional',
      avatarUrl: newPersona.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${newPersona.name}`
    };
    
    setPersonas([...personas, persona]);
    setIsCreating(false);
    setActivePersona(persona);
    setMessages([{
      id: Date.now().toString(),
      text: `Hello, I'm ${persona.name}, your new ${persona.role}. How can I assist you with your design project today?`,
      sender: 'ai',
      timestamp: new Date()
    }]);
  };

  const handleSelectPersona = (persona: Persona) => {
    setActivePersona(persona);
    setMessages([{
      id: Date.now().toString(),
      text: `Hello, I'm ${persona.name}. How can I help you with your interior design vision today?`,
      sender: 'ai',
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !activePersona) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key not found.");

      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `You are an AI assistant specialized in architecture and interior design. 
      Your name is ${activePersona.name}. Your role is ${activePersona.role}.
      Your personality is: ${activePersona.personality}.
      Your tone of voice is: ${activePersona.tone}.
      Always stay in character. Provide expert advice, design suggestions, and critique based on your persona.`;

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      // Send previous context (simplified for this demo, just sending the latest message)
      const response = await chat.sendMessage({ message: userMsg.text });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text || "I'm sorry, I couldn't process that request.",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to my design database right now. Please try again later.",
        sender: 'ai',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex flex-col md:flex-row">
      {/* Sidebar - Persona List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-border bg-white flex flex-col h-[calc(100vh-80px)] ${activePersona ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-serif mb-2">AI Assistants</h2>
          <p className="text-sm text-muted-foreground font-light">Collaborate with specialized virtual designers or create your own.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {personas.map(persona => (
            <button
              key={persona.id}
              onClick={() => handleSelectPersona(persona)}
              className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border ${
                activePersona?.id === persona.id 
                  ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                  : 'bg-muted/30 border-transparent hover:border-border hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-4">
                <img src={persona.avatarUrl} alt={persona.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-sm" />
                <div>
                  <h3 className={`font-serif text-lg ${activePersona?.id === persona.id ? 'text-white' : 'text-primary'}`}>{persona.name}</h3>
                  <p className={`text-xs uppercase tracking-widest ${activePersona?.id === persona.id ? 'text-white/70' : 'text-muted-foreground'}`}>{persona.role}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-border bg-muted/10">
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-4 bg-white border border-dashed border-primary/30 text-primary rounded-2xl text-sm uppercase tracking-widest font-medium hover:bg-primary/5 hover:border-primary transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Avatar
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-[calc(100vh-80px)] bg-muted/10 relative ${!activePersona && !isCreating ? 'hidden md:flex' : 'flex'}`}>
        
        {!activePersona && !isCreating ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-border/50">
              <User className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-serif mb-3">Select an Assistant</h3>
            <p className="text-muted-foreground max-w-md font-light">
              Choose a specialized AI designer from the sidebar to start collaborating, or create your own custom avatar to present your projects.
            </p>
          </div>
        ) : isCreating ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-border">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-border">
                <h2 className="text-3xl font-serif">Create AI Avatar</h2>
                <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <img src={newPersona.avatarUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-muted shadow-md" />
                  <div>
                    <button 
                      onClick={() => setNewPersona({...newPersona, avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${Date.now()}`})}
                      className="text-xs uppercase tracking-widest font-medium text-primary bg-muted px-4 py-2 rounded-full hover:bg-primary/10 transition-colors"
                    >
                      Regenerate Image
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-medium mb-2 text-muted-foreground">Name</label>
                    <input 
                      type="text" 
                      value={newPersona.name}
                      onChange={e => setNewPersona({...newPersona, name: e.target.value})}
                      placeholder="e.g. Elena Rossi"
                      className="w-full p-4 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-medium mb-2 text-muted-foreground">Role / Title</label>
                    <input 
                      type="text" 
                      value={newPersona.role}
                      onChange={e => setNewPersona({...newPersona, role: e.target.value})}
                      placeholder="e.g. Minimalist Architect"
                      className="w-full p-4 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-medium mb-2 text-muted-foreground">Personality</label>
                  <textarea 
                    value={newPersona.personality}
                    onChange={e => setNewPersona({...newPersona, personality: e.target.value})}
                    placeholder="Describe how they think and act. e.g. Highly analytical, obsessed with clean lines and functional spaces..."
                    className="w-full h-24 p-4 bg-muted/50 border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-medium mb-2 text-muted-foreground">Tone of Voice</label>
                  <input 
                    type="text" 
                    value={newPersona.tone}
                    onChange={e => setNewPersona({...newPersona, tone: e.target.value})}
                    placeholder="e.g. Direct, professional, slightly poetic"
                    className="w-full p-4 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                  />
                </div>

                <button
                  onClick={handleCreatePersona}
                  disabled={!newPersona.name || !newPersona.personality}
                  className="w-full mt-8 bg-primary text-primary-foreground py-4 rounded-xl text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Initialize Avatar
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <div className="flex-1 flex flex-col h-full bg-white relative">
            {/* Chat Header */}
            <div className="h-20 border-b border-border flex items-center px-6 justify-between bg-white/80 backdrop-blur-md z-10 absolute top-0 left-0 right-0">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActivePersona(null)}
                  className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-primary"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <img src={activePersona.avatarUrl} alt={activePersona.name} className="w-10 h-10 rounded-full object-cover border border-border shadow-sm" />
                <div>
                  <h3 className="font-serif text-lg leading-tight">{activePersona.name}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{activePersona.role}</p>
                </div>
              </div>
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 pt-28 pb-32 custom-scrollbar">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl p-5 ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-muted/50 border border-border rounded-tl-sm text-primary'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <span className={`text-[10px] mt-2 block ${msg.sender === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted/50 border border-border rounded-2xl rounded-tl-sm p-5 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      <span className="text-xs text-muted-foreground uppercase tracking-widest">{activePersona.name} is typing...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
              <div className="max-w-3xl mx-auto relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Ask ${activePersona.name} for design advice...`}
                  className="w-full bg-white border border-border shadow-lg rounded-2xl py-4 pl-6 pr-16 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary transition-shadow h-16"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

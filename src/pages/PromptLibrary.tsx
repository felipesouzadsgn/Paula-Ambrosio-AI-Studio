import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Search, Filter, ArrowRight } from 'lucide-react';
import { promptLibrary } from '../data/prompts';

export function PromptLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = ['All', ...Array.from(new Set(promptLibrary.map(p => p.category)))];

  const filteredPrompts = promptLibrary.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.positivePrompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUsePrompt = (positivePrompt: string, negativePrompt: string) => {
    navigate('/editor', { state: { positivePrompt, negativePrompt } });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] mb-4 block text-primary-foreground/70">Curated Collection</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">Prompt Library</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto font-light">
              Elevate your designs with our meticulously crafted prompts. From minimalist living rooms to luxury commercial spaces, find the perfect starting point for your next masterpiece.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="sticky top-28 space-y-8">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest font-medium mb-4 flex items-center gap-2 text-muted-foreground">
                <Filter className="w-4 h-4" /> Categories
              </h3>
              <div className="flex flex-col gap-1">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                      selectedCategory === category 
                        ? 'bg-primary text-primary-foreground font-medium shadow-md' 
                        : 'text-muted-foreground hover:bg-muted hover:text-primary'
                    }`}
                  >
                    {category}
                    <span className="float-right text-[10px] opacity-50 mt-0.5">
                      {category === 'All' ? promptLibrary.length : promptLibrary.filter(p => p.category === category).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPrompts.map((promptItem, index) => (
              <motion.div
                key={promptItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-border flex flex-col h-full hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] uppercase tracking-widest font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                    {promptItem.category}
                  </span>
                  {!promptItem.isFree ? (
                    <span className="text-[10px] uppercase tracking-widest font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> Premium
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                      Free
                    </span>
                  )}
                </div>
                
                <h4 className="font-serif text-xl mb-4 group-hover:text-accent transition-colors">{promptItem.title}</h4>
                
                <div className="flex-1 space-y-5 mb-8">
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                    <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Positive Prompt
                    </p>
                    <p className="text-sm leading-relaxed text-primary/90 line-clamp-4">{promptItem.positivePrompt}</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                    <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Negative Prompt
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{promptItem.negativePrompt}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleUsePrompt(promptItem.positivePrompt, promptItem.negativePrompt)}
                  className="w-full py-3.5 bg-white border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground rounded-xl text-sm uppercase tracking-widest font-medium transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                  Use Prompt <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
          
          {filteredPrompts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-border border-dashed">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-serif mb-2">No prompts found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your search or category filter.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-6 px-6 py-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full text-xs uppercase tracking-widest transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

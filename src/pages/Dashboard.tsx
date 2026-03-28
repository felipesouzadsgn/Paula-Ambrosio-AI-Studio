import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Image as ImageIcon, LayoutGrid, Clock, Heart, Palette, Users, ChevronRight, Lock, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Dashboard() {
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('projetos');

  // Simulate authentication check
  useEffect(() => {
    // In a real app, check auth state here
    // For now, we just rely on the demo flag or a mock login
    if (isDemo) {
      setIsLoggedIn(true);
    }
  }, [isDemo]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-serif mb-3">Authentication Required</h1>
            <p className="text-muted-foreground text-sm">Please log in to view and manage your luxury interior projects.</p>
          </div>
          <div className="space-y-4">
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full py-4 bg-primary text-primary-foreground rounded-full text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors"
            >
              Log In
            </button>
            <Link 
              to="/dashboard?demo=true"
              className="w-full flex items-center justify-center gap-2 py-4 bg-transparent text-primary border border-primary/20 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-primary/5 transition-colors"
            >
              <Play className="w-4 h-4" /> View Demo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'projetos', label: 'Projetos', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'clientes', label: 'Por Cliente', icon: <Users className="w-4 h-4" /> },
    { id: 'galeria', label: 'Galeria', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'inspiracoes', label: 'Inspirações', icon: <Heart className="w-4 h-4" /> },
    { id: 'moodboard', label: 'Moodboard', icon: <Palette className="w-4 h-4" /> },
  ];

  const projetos = [
    { id: 1, name: "Miami Penthouse", date: "Atualizado há 2h", image: "https://picsum.photos/seed/luxury_penthouse/800/600" },
    { id: 2, name: "Coral Gables Villa", date: "Ontem", image: "https://picsum.photos/seed/luxury_villa/800/600" },
    { id: 3, name: "Brickell Condo", date: "Há 3 dias", image: "https://picsum.photos/seed/luxury_condo/800/600" },
    { id: 4, name: "Palm Beach Estate", date: "Semana passada", image: "https://picsum.photos/seed/luxury_estate/800/600" },
  ];

  const clientes = [
    { id: 1, client: "Família Silva", project: "Residência Alphaville", image: "https://picsum.photos/seed/alphaville/800/600", count: 4 },
    { id: 2, client: "Dr. Roberto", project: "Consultório Boutique", image: "https://picsum.photos/seed/clinic/800/600", count: 2 },
    { id: 3, client: "Marina & João", project: "Cobertura Leblon", image: "https://picsum.photos/seed/leblon/800/600", count: 7 },
  ];

  const galeria = [
    "https://picsum.photos/seed/marble_bathroom/800/600",
    "https://picsum.photos/seed/gold_details/800/600",
    "https://picsum.photos/seed/luxury_living/800/600",
    "https://picsum.photos/seed/modern_kitchen/800/600",
    "https://picsum.photos/seed/walk_in_closet/800/600",
    "https://picsum.photos/seed/wine_cellar/800/600",
  ];

  const inspiracoes = [
    { id: 1, title: "Minimalismo Quente", image: "https://picsum.photos/seed/warm_minimalism/800/600" },
    { id: 2, title: "Detalhes em Latão", image: "https://picsum.photos/seed/brass_details/800/600" },
    { id: 3, title: "Mármore Calacatta", image: "https://picsum.photos/seed/calacatta/800/600" },
    { id: 4, title: "Iluminação Indireta", image: "https://picsum.photos/seed/cove_lighting/800/600" },
  ];

  const moodboard = [
    { id: 1, type: "Material", name: "Veludo Verde", image: "https://picsum.photos/seed/green_velvet/400/400" },
    { id: 2, type: "Mobiliário", name: "Poltrona Design", image: "https://picsum.photos/seed/lounge_chair/400/400" },
    { id: 3, type: "Material", name: "Nogueira Escura", image: "https://picsum.photos/seed/dark_walnut/400/400" },
    { id: 4, type: "Detalhe", name: "Luminária Pendente", image: "https://picsum.photos/seed/pendant_light/400/400" },
    { id: 5, type: "Material", name: "Mármore Travertino", image: "https://picsum.photos/seed/travertine/400/400" },
    { id: 6, type: "Mobiliário", name: "Mesa de Centro", image: "https://picsum.photos/seed/coffee_table/400/400" },
  ];

  return (
    <div className="min-h-screen bg-background text-primary py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-serif font-light">Meu Studio</h1>
              {isDemo && (
                <span className="px-2 py-1 bg-accent/10 text-accent text-[10px] uppercase tracking-widest font-bold rounded-md">Demo Mode</span>
              )}
            </div>
            <p className="text-muted-foreground uppercase tracking-widest text-xs">Gerencie seus projetos de interiores de luxo</p>
          </div>
          <Link 
            to="/editor" 
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors text-sm uppercase tracking-widest font-medium"
          >
            <Plus className="w-4 h-4" /> Novo Projeto
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total de Projetos", value: "12", icon: <LayoutGrid className="w-5 h-5" /> },
            { label: "Gerações Restantes", value: "45", icon: <ImageIcon className="w-5 h-5" /> },
            { label: "Tempo Poupado", value: "24h", icon: <Clock className="w-5 h-5" /> },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-border/50 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground uppercase tracking-widest text-[10px] mb-2">{stat.label}</p>
                <p className="text-3xl font-serif">{stat.value}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar mb-8 border-b border-border">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 text-xs uppercase tracking-widest font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-primary/80'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* PROJETOS */}
            {activeTab === 'projetos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projetos.map((project) => (
                  <Link key={project.id} to={`/project/${project.id}`} className="group block">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-muted">
                      <img 
                        src={project.image} 
                        alt={project.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white/90 text-primary px-6 py-2 rounded-full text-xs uppercase tracking-widest font-medium backdrop-blur-sm">
                          Abrir Projeto
                        </span>
                      </div>
                    </div>
                    <h3 className="font-medium text-lg mb-1">{project.name}</h3>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest">{project.date}</p>
                  </Link>
                ))}
              </div>
            )}

            {/* POR CLIENTE */}
            {activeTab === 'clientes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clientes.map((client) => (
                  <div key={client.id} className="group p-4 rounded-2xl border border-border/50 bg-white hover:border-primary/30 transition-colors cursor-pointer flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <img src={client.image} alt={client.client} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-base mb-1">{client.client}</h3>
                      <p className="text-muted-foreground text-xs mb-2">{client.project}</p>
                      <p className="text-xs uppercase tracking-widest text-primary/60 font-medium">{client.count} Ambientes</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            )}

            {/* GALERIA */}
            {activeTab === 'galeria' && (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {galeria.map((img, i) => (
                  <div key={i} className="relative rounded-2xl overflow-hidden group break-inside-avoid">
                    <img src={img} alt={`Galeria ${i}`} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <button className="text-white text-xs uppercase tracking-widest font-medium border border-white/30 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white hover:text-black transition-colors">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* INSPIRAÇÕES */}
            {activeTab === 'inspiracoes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {inspiracoes.map((item) => (
                  <div key={item.id} className="group cursor-pointer">
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                      <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    <h3 className="font-medium text-sm">{item.title}</h3>
                  </div>
                ))}
              </div>
            )}

            {/* MOODBOARD */}
            {activeTab === 'moodboard' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {moodboard.map((item) => (
                  <div key={item.id} className="group cursor-pointer">
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-2 border border-border/50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">{item.type}</p>
                    <h3 className="font-medium text-xs truncate">{item.name}</h3>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

import { Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "Experience the magic of AI interior design.",
      features: [
        "Up to 3 image generations",
        "Standard resolution export",
        "Basic prompt suggestions",
        "Community support"
      ],
      button: "Start Free",
      popular: false
    },
    {
      name: "Starter",
      price: "$19",
      period: "/month",
      desc: "Essential tools for independent designers.",
      features: [
        "50 image generations per month",
        "High-resolution exports (4K)",
        "Basic editing tools (masking)",
        "Priority processing queue",
        "Commercial usage rights"
      ],
      button: "Subscribe Starter",
      popular: true
    },
    {
      name: "Pro",
      price: "$139",
      period: "/month",
      desc: "Unlimited power for luxury design firms.",
      features: [
        "Unlimited image generations",
        "Access to all AI models (Nano Banana PRO 2, Kling, etc.)",
        "Advanced editing (context-aware replacement)",
        "Highest priority processing",
        "Dedicated account manager",
        "Early access to video generation"
      ],
      button: "Subscribe Pro",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background text-primary py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-light mb-6"
          >
            Invest in <span className="italic text-muted-foreground">Excellence</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground uppercase tracking-widest text-sm max-w-2xl mx-auto"
          >
            Flexible plans designed for architects, designers, and luxury real estate professionals.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className={`relative p-10 rounded-3xl border ${
                plan.popular 
                  ? 'bg-primary text-primary-foreground border-primary shadow-2xl scale-105 z-10' 
                  : 'bg-white border-border/50 hover:border-primary/20'
              } flex flex-col transition-all duration-500`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-serif mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-light tracking-tight">{plan.price}</span>
                {plan.period && <span className={`text-sm ${plan.popular ? 'text-white/70' : 'text-muted-foreground'}`}>{plan.period}</span>}
              </div>
              <p className={`text-sm mb-8 ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}>{plan.desc}</p>
              
              <ul className="space-y-4 mb-12 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-accent' : 'text-primary'}`} />
                    <span className={plan.popular ? 'text-white/90' : 'text-muted-foreground'}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-4 rounded-full text-sm uppercase tracking-widest font-medium transition-colors ${
                plan.popular 
                  ? 'bg-white text-primary hover:bg-white/90' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}>
                {plan.button}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

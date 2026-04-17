import { motion } from 'framer-motion';
import { Eye, Sigma, Briefcase } from 'lucide-react';

interface ConceptBridgeProps {
  visual: string;
  formal: string;
  transfer: string;
}

export default function ConceptBridge({ visual, formal, transfer }: ConceptBridgeProps) {
  const cards = [
    { icon: Eye, title: 'Visual intuition', text: visual, color: 'text-cyan-300 border-cyan-400/35 bg-cyan-500/8' },
    { icon: Sigma, title: 'Math contract', text: formal, color: 'text-purple-300 border-purple-400/35 bg-purple-500/8' },
    { icon: Briefcase, title: 'Human transfer', text: transfer, color: 'text-emerald-300 border-emerald-400/35 bg-emerald-500/8' },
  ];

  return (
    <div className="concept-bridge">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            className={`concept-bridge-card ${card.color}`}
          >
            <h4><Icon size={15} /> {card.title}</h4>
            <p>{card.text}</p>
          </motion.article>
        );
      })}
    </div>
  );
}

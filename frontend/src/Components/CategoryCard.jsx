import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CategoryCard = ({ category, isExpanded, onToggle, children }) => {
  return (
    <motion.div
      layout
      className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 ${
        isExpanded ? 'border-primary/30 shadow-xl shadow-primary/5' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20'
      }`}
    >
      <div 
        className="p-6 cursor-pointer flex items-start justify-between group"
        onClick={onToggle}
      >
        <div className="flex gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
            isExpanded ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary/20'
          }`}>
            {category.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{category.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{category.description}</p>
          </div>
        </div>
        
        <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-400'}`}>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-50 bg-gray-50/30">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CategoryCard;

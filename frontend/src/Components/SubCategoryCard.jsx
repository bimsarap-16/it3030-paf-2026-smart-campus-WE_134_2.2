import React from 'react';
import { motion } from 'framer-motion';

const SubCategoryCard = ({ subcategory, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer flex items-center gap-4 group"
    >
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        {subcategory.icon}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">{subcategory.name}</h4>
        <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider">Available Now</p>
      </div>
    </motion.div>
  );
};

export default SubCategoryCard;

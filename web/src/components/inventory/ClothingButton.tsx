import React from 'react';
import { motion } from 'framer-motion';
import { Shirt, ArrowLeft } from 'lucide-react';

interface ClothingButtonProps {
  isActive: boolean;
  onClick: () => void;
}

const ClothingButton: React.FC<ClothingButtonProps> = ({ isActive, onClick }) => {
  return (
    <motion.button
      className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 cursor-pointer ${
        isActive 
          ? 'bg-white text-black shadow-lg shadow-white/25' 
          : 'bg-black/80 text-white hover:bg-black hover:text-white border border-white/20'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isActive ? <ArrowLeft size={18} /> : <Shirt size={18} />}
    </motion.button>
  );
};

export default ClothingButton;

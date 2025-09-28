import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import InventoryControl from './InventoryControl';
import {Backpack, WeightIcon} from 'lucide-react';
import { InventoryButtonCategory } from './InventoryButtonCategory';
import { IconName } from 'lucide-react/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import ClothingButton from './ClothingButton';
import ClothingInterface from './ClothingInterface';

const PAGE_SIZE = 30;

interface InventoryMeta {
  isMainInventory?: boolean;
  isDropInventory?: {
    value: boolean,
    type: string,
    shouldRender: boolean;
  };
}

const InventoryGrid: React.FC<{ inventory: Inventory, renderControl?: boolean, meta?: InventoryMeta }> = ({ inventory, renderControl, meta = {} }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const [isClothingMode, setIsClothingMode] = useState(false);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  return (
    <motion.div 
      className='flex flex-col gap-2 overflow-y-hidden'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
          className={`relative inventory-grid-wrapper rounded-xl
           transition-all duration-300 bg-gradient-to-br from-main via-main/95 to-main
          ${meta?.isDropInventory?.value 
            ? meta.isDropInventory.shouldRender 
              ? "opacity-100 h-auto p-3 pb-5 border-4 w-[550px]" 
              : "opacity-0 h-0 scale-y-[50%] scale-x-0 p-0" 
            : meta?.isMainInventory 
              ? "p-3 pb-5 border-4 w-[550px] h-[480px]"
              : renderControl 
                ? "p-3 pb-5 border-4 w-[550px] h-[360px]"
                : "h-0 opacity-0 overflow-hidden p-0 w-[550px]"
          }`}
          style={{ pointerEvents: isBusy ? 'none' : 'auto', borderColor: "#2f303188" }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.4, 
            ease: "easeOut",
            delay: 0.1
          }}
          whileHover={{ 
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)" 
          }}
      >
        {/* Main Inventory Header - Figma Style */}
        {meta?.isMainInventory && (
          <motion.div 
            className="flex justify-between items-center rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            <motion.div 
              className="flex items-center gap-3"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <motion.div 
                className="w-8 h-8 rounded-md flex items-center justify-center"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Backpack size={25} color="#ffffffff" />
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.h2 
                  className="text-white text-2xl font-main font-bold tracking-wider uppercase"
                  key={isClothingMode ? "clothing" : "inventory"}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ 
                    opacity: 1, 
                    filter: "blur(0px)"
                  }}
                  exit={{ 
                    opacity: 0, 
                    filter: "blur(4px)"
                  }}
                  transition={{ 
                    duration: 0.2, 
                    ease: "easeInOut" 
                  }}
                >
                  {isClothingMode ? "CLOTHING" : "INVENTORY"}
                </motion.h2>
              </AnimatePresence>
            </motion.div>
            <motion.div 
              className="flex items-center gap-4"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            >
              <ClothingButton 
                isActive={isClothingMode} 
                onClick={() => setIsClothingMode(!isClothingMode)} 
              />
              <div className="inventory-control-header">
                <InventoryControl />
              </div>
            </motion.div>
          </motion.div>
        )}

        <div>
          {/* Weight Display - Figma Style */}
          { inventory.maxWeight && (
            <motion.div 
              className="relative mt-1 mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Weight Bar */}
              <div 
                className="w-full h-4 px-[3px] rounded-sm border-secondary border-1 rounded overflow-hidden flex items-center relative"
                style={{
                  boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15), 0 1px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                }}
              >
                {/* Background with subtle gradient */}
                <div className="absolute inset-0 rounded" />
                
                {/* Animated Weight Bar */}
                <motion.div 
                  className="h-2 max-w-[calc(100%-3px)] rounded-[2px] relative z-10"
                  style={{
                    background: weight / inventory.maxWeight > 0.8 
                      ? "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)"
                      : weight / inventory.maxWeight > 0.6 
                      ? "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)"
                      : "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
                    boxShadow: weight / inventory.maxWeight > 0.8 
                      ? "0 0 10px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3)"
                      : weight / inventory.maxWeight > 0.6 
                      ? "0 0 10px rgba(245, 158, 11, 0.5), 0 0 20px rgba(245, 158, 11, 0.3)"
                      : "0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)"
                  }}
                  initial={{ width: 0, scaleY: 0.8 }}
                  animate={{ 
                    width: `${Math.min((weight / inventory.maxWeight) * 100, 100)}%`,
                    scaleY: 1
                  }}
                  transition={{ 
                    duration: 0.8, 
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                >
                  {/* Shine effect overlay */}
                  <motion.div
                    className="absolute inset-0 rounded-[2px]"
                    style={{
                      background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)"
                    }}
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Subtle inner highlight */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-[1px] rounded-t-[2px]"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
                    }}
                  />
                </motion.div>
                
                {/* Pulse animation for critical weight */}
                {weight / inventory.maxWeight > 0.9 && (
                  <motion.div
                    className="absolute inset-0 rounded border-2 border-red-400"
                    animate={{
                      opacity: [0, 0.8, 0],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </div>
            </motion.div>
          )}

          {
            !meta?.isMainInventory && (
              <motion.div 
                style={{ color: "rgb(227 228 227)" }} 
                className="relative flex flex-col rounded-sm mt-2 py-1 pb-3 mx-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              >
                <motion.div 
                  className="flex justify-around"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <motion.p 
                    style={{ textTransform: "uppercase" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    { meta.isDropInventory?.type === "newdrop" ? "FLOOR" : inventory.label }
                  </motion.p>
                </motion.div>
              </motion.div>
            )
          }

          { /* <div className="inventory-grid-header-wrapper">
            <p>{inventory.label}</p>
            {inventory.maxWeight && (
              <p>
                {weight / 1000}/{inventory.maxWeight / 1000}kg
              </p>
            )}
          </div>
          <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} /> */ }
        </div>
        
        {/* Conditional rendering: Clothing Interface or Inventory Grid */}
        {meta?.isMainInventory && isClothingMode ? (
          <motion.div 
            className="p-3 flex-1 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <ClothingInterface />
          </motion.div>
        ) : (
          <motion.div 
            className={`relative ${meta?.isDropInventory?.value ? meta.isDropInventory.shouldRender ? "p-3" : "p-0" : "p-0" }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div 
              className={`inventory-grid-container`} 
              ref={containerRef}
              style={{
                height: meta?.isMainInventory 
                  ? 'calc(480px - 120px)' // Main inventory: total height - (header + weight bar + padding)
                  : 'calc(360px - 80px)',  // Second inventory: total height - (weight bar + padding)
                maxHeight: meta?.isMainInventory 
                  ? 'calc(480px - 120px)' 
                  : 'calc(360px - 80px)',
                overflowY: 'auto'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {inventory.items.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
                  <InventorySlot
                    key={`${inventory.type}-${inventory.id}-${item.slot}`}
                    item={item}
                    ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                    inventoryType={inventory.type}
                    inventoryGroups={inventory.groups}
                    inventoryId={inventory.id}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
            {/* Fade to transparent effect at bottom */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-main to-transparent pointer-events-none rounded-b-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default InventoryGrid;

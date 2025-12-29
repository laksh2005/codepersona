import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

interface TetrisBlock {
  id: number;
  x: number;
  y: number;
  type: number;
  rotation: number;
  opacity: number;
  scale: number;
}

const TETRIS_SHAPES = [
  // I
  [[1, 1, 1, 1]],
  // O
  [[1, 1], [1, 1]],
  // T
  [[0, 1, 0], [1, 1, 1]],
  // S
  [[0, 1, 1], [1, 1, 0]],
  // Z
  [[1, 1, 0], [0, 1, 1]],
  // J
  [[1, 0, 0], [1, 1, 1]],
  // L
  [[0, 0, 1], [1, 1, 1]],
];

interface TetrisBackgroundProps {
  keystrokeCount: number;
}

const TetrisBackground = ({ keystrokeCount }: TetrisBackgroundProps) => {
  const generateBlock = (id: number): TetrisBlock => ({
    id,
    x: Math.random() * 95,
    y: Math.random() * 95,
    type: Math.floor(Math.random() * TETRIS_SHAPES.length),
    rotation: Math.floor(Math.random() * 4) * 90,
    opacity: 0.08 + Math.random() * 0.12,
    scale: 0.6 + Math.random() * 0.6,
  });

  const initialBlocks = useMemo(
    () => Array.from({ length: 25 }, (_, i) => generateBlock(i)),
    []
  );

  const [blocks, setBlocks] = useState<TetrisBlock[]>(initialBlocks);

  const shuffleBlocks = useCallback(() => {
    setBlocks((prev) =>
      prev.map((block) => ({
        ...block,
        x: Math.max(2, Math.min(93, block.x + (Math.random() - 0.5) * 8)),
        y: Math.max(2, Math.min(93, block.y + (Math.random() - 0.5) * 8)),
        rotation: block.rotation + (Math.random() > 0.5 ? 90 : -90),
        opacity: 0.08 + Math.random() * 0.12,
      }))
    );
  }, []);

  // Add/remove blocks occasionally
  useEffect(() => {
    if (keystrokeCount > 0 && keystrokeCount % 5 === 0) {
      setBlocks((prev) => {
        if (prev.length < 35 && Math.random() > 0.4) {
          return [...prev, generateBlock(Date.now())];
        } else if (prev.length > 18 && Math.random() > 0.6) {
          return prev.slice(1);
        }
        return prev;
      });
    }
  }, [keystrokeCount]);

  useEffect(() => {
    if (keystrokeCount > 0) {
      shuffleBlocks();
    }
  }, [keystrokeCount, shuffleBlocks]);

  const renderShape = (shape: number[][], scale: number) => {
    const cellSize = 8 * scale;
    return (
      <div className="flex flex-col gap-[1px]">
        {shape.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-[1px]">
            {row.map((cell, cellIdx) => (
              <div
                key={cellIdx}
                style={{
                  width: cellSize,
                  height: cellSize,
                  background: cell ? "hsl(var(--primary))" : "transparent",
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {blocks.map((block) => (
        <motion.div
          key={block.id}
          className="absolute"
          style={{
            opacity: block.opacity,
          }}
          initial={false}
          animate={{
            left: `${block.x}%`,
            top: `${block.y}%`,
            rotate: block.rotation,
            scale: block.scale,
          }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 15,
          }}
        >
          {renderShape(TETRIS_SHAPES[block.type], block.scale)}
        </motion.div>
      ))}

      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background:
            keystrokeCount > 0
              ? `radial-gradient(ellipse at ${50 + ((keystrokeCount * 3) % 30) - 15}% ${50 + ((keystrokeCount * 2) % 20) - 10}%, hsl(var(--primary) / ${0.02 + Math.min(keystrokeCount * 0.001, 0.04)}) 0%, transparent 60%)`
              : "radial-gradient(ellipse at center, hsl(var(--primary) / 0.015) 0%, transparent 60%)",
        }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
};

export default TetrisBackground;

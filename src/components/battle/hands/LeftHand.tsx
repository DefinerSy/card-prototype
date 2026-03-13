import { motion } from 'framer-motion';
import type { Variants, AnimationControls } from 'framer-motion';

interface LeftHandProps {
  variants?: Variants;
  animate?: AnimationControls | string;
  className?: string;
}

export function LeftHand({ variants, animate = 'idle', className = '' }: LeftHandProps) {
  return (
    <motion.div
      className={`absolute bottom-0 left-8 md:left-16 w-32 h-40 ${className}`}
      initial="idle"
      animate={animate}
      variants={variants}
      style={{ originY: 1, originX: 0.5 }}
    >
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        {/* 涂鸦风格左手 - 施法/辅助姿势 */}
        <g filter="url(#sketchy-line)">
          {/* 手掌主体 */}
          <path d="M20 50 Q 50 40 70 50 Q 75 70 65 90 Q 30 95 20 50 Z" fill="#e0ddd5" stroke="#111" strokeWidth="3" />
          
          {/* 掌心纹理 (排线) */}
          <path d="M30 60 L 50 80 M 40 55 L 60 75 M 35 70 L 45 85" stroke="#111" strokeWidth="1" />

          {/* 大拇指 */}
          <path d="M12 55 Q 5 45 15 35 Q 25 40 25 50 Z" fill="#e0ddd5" stroke="#111" strokeWidth="3" />

          {/* 食指 */}
          <path d="M25 35 Q 20 15 30 10 Q 40 20 35 35 Z" fill="#e0ddd5" stroke="#111" strokeWidth="3" />

          {/* 中指 */}
          <path d="M38 30 Q 35 5 45 5 Q 55 15 48 30 Z" fill="#e0ddd5" stroke="#111" strokeWidth="3" />

          {/* 无名指 */}
          <path d="M51 33 Q 50 15 60 15 Q 65 25 60 35 Z" fill="#e0ddd5" stroke="#111" strokeWidth="3" />

          {/* 小指 */}
          <path d="M62 38 Q 65 25 72 25 Q 75 35 70 40 Z" fill="#e0ddd5" stroke="#111" strokeWidth="3" />

          {/* 手腕部分 */}
          <path d="M25 90 Q 45 85 65 90 L 60 110 Q 40 115 20 110 Z" fill="#e0ddd5" stroke="#111" strokeWidth="3" />
          
          {/* 阴影排线 */}
          <path d="M25 95 L 35 110 M 35 93 L 45 112 M 45 92 L 55 110" stroke="#111" strokeWidth="1.5" />
        </g>
      </svg>
    </motion.div>
  );
}

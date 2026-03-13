import { motion } from 'framer-motion';
import type { Variants, AnimationControls } from 'framer-motion';

interface RightHandProps {
  variants?: Variants;
  animate?: AnimationControls | string;
  className?: string;
}

export function RightHand({ variants, animate = 'idle', className = '' }: RightHandProps) {
  return (
    <motion.div
      className={`absolute bottom-0 right-8 md:right-16 w-32 h-40 ${className}`}
      initial="idle"
      animate={animate}
      variants={variants}
      style={{ originY: 1, originX: 0.5 }}
    >
      <svg
        viewBox="0 -50 100 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="sword-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 涂鸦风格右手 - 握剑姿势 */}
        <g filter="url(#sketchy-line)">
          {/* 手掌主体 */}
          <path d="M30 50 Q 45 45 80 50 Q 85 70 80 95 Q 40 90 30 50 Z" fill="#e0ddd5" stroke="#111" strokeWidth="3" />
          
          {/* 剑 */}
          <g transform="translate(55, 60) rotate(15) translate(-55, -60)">
            {/* 剑刃主体 */}
            <path d="M55 -70 L65 -40 L60 45 L50 45 L45 -40 Z" fill="#111" stroke="#111" strokeWidth="2" />
            <path d="M55 -65 L62 -38 L58 45 L52 45 L48 -38 Z" fill="#e0ddd5" />
            
            {/* 剑刃血槽 (红色涂鸦) */}
            <path d="M55 -50 Q 56 0 55 30" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M54 -40 Q 55 10 54 20" stroke="#991b1b" strokeWidth="2" fill="none" />
            
            {/* 护手 */}
            <path d="M25 45 Q 55 40 85 45 Q 80 55 30 55 Z" fill="#111" />
            <path d="M28 47 Q 55 43 82 47 Q 78 52 32 52 Z" fill="#e0ddd5" />
            
            {/* 剑柄 */}
            <path d="M48 53 L62 53 L60 100 L50 100 Z" fill="#111" />
            <path d="M50 55 L60 55 L58 98 L52 98 Z" fill="#e0ddd5" />
            
            {/* 剑柄绑带纹理 (杂乱排线) */}
            <path d="M48 60 L62 65 M49 68 L61 73 M48 78 L62 82 M49 88 L61 92" stroke="#111" strokeWidth="2" />
            <path d="M62 60 L48 65 M61 68 L49 73 M62 78 L48 82 M61 88 L49 92" stroke="#111" strokeWidth="1" />
          </g>

          {/* 握紧的手指 (覆盖在剑柄上) */}
          {/* 食指 */}
          <path d="M63 55 Q 75 50 77 60 Q 75 70 63 71 Z" fill="#e0ddd5" stroke="#111" strokeWidth="3" />
          
          {/* 中指 */}
          <path d="M49 55 Q 61 50 63 60 Q 61 70 49 71 Z" fill="#e0ddd5" stroke="#111" strokeWidth="3" />
          
          {/* 无名指 */}
          <path d="M35 56 Q 47 51 49 61 Q 47 71 35 71 Z" fill="#e0ddd5" stroke="#111" strokeWidth="3" />
          
          {/* 小指 */}
          <path d="M23 58 Q 33 55 35 65 Q 33 71 23 71 Z" fill="#e0ddd5" stroke="#111" strokeWidth="3" />

          {/* 大拇指 */}
          <path d="M68 45 Q 85 40 82 55 Q 75 60 68 55 Z" fill="#e0ddd5" stroke="#111" strokeWidth="3" />

          {/* 手腕部分 */}
          <path d="M35 90 Q 55 85 75 90 L 70 110 Q 50 115 30 110 Z" fill="#e0ddd5" stroke="#111" strokeWidth="3" />
          
          {/* 阴影排线 */}
          <path d="M35 95 L 45 110 M 45 93 L 55 112 M 55 92 L 65 110 M 65 90 L 70 105" stroke="#111" strokeWidth="1.5" />
        </g>
      </svg>
    </motion.div>
  );
}

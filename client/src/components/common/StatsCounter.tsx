import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatsCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

const StatsCounter: React.FC<StatsCounterProps> = ({
  value,
  suffix = '',
  duration = 2000,
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentCount = Math.floor(progress * value);

        setCount(currentCount);

        if (progress >= 1) {
          clearInterval(timer);
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <span className="text-4xl font-bold text-gray-900">
        {count.toLocaleString()}
        {suffix}
      </span>
    </motion.div>
  );
};

export default StatsCounter;

'use client';

import { motion } from 'framer-motion';

export { motion };

export default function MotionCard({
  children,
  index = 0,
  className = '',
  delay,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: delay !== undefined ? delay : index * 0.1,
        ease: 'easeOut',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

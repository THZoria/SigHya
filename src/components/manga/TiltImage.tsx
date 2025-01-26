import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltImageProps {
  src: string;
  alt: string;
  onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const TiltImage: React.FC<TiltImageProps> = ({ src, alt, onError }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const xPct = (mouseX / width - 0.5);
    const yPct = (mouseY / height - 0.5);
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="w-full h-full"
    >
      <motion.img
        src={src}
        alt={alt}
        onError={onError}
        style={{
          transformStyle: "preserve-3d",
          transform: "translateZ(20px)",
        }}
        className="w-full h-auto object-cover bg-gray-800 rounded-lg shadow-lg"
      />
    </motion.div>
  );
};

export default TiltImage;
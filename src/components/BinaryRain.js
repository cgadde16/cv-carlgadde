import React, { useEffect, useRef } from 'react';

const BinaryRain = () => {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const lastScrollRef = useRef(0);
  const parallaxOffsetRef = useRef(0);
  const smoothParallaxRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const binaryChars = ['0', '1'];

    const drops = [];
    const columnWidth = 80; 
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const newColumns = Math.floor(canvas.width / columnWidth);
      
      drops.length = 0; 
      for (let i = 0; i < newColumns; i++) {
        drops[i] = {
          y: Math.random() * -canvas.height * -0.2, 
          speed: Math.random() * 0.8 + 0.2, 
          char: binaryChars[Math.floor(Math.random() * binaryChars.length)],
          opacity: Math.random() * 0.65 + 0.45 
        };
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const scrollDelta = currentScroll - lastScrollRef.current;
      
      if (scrollDelta > 0) {
        parallaxOffsetRef.current += scrollDelta * 0.3;
      } else if (scrollDelta < 0) {
        parallaxOffsetRef.current += scrollDelta;
      }
      
      lastScrollRef.current = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);

    const draw = () => {
      const targetParallax = parallaxOffsetRef.current;
      const smoothingFactor = 0.15; 
      smoothParallaxRef.current += (targetParallax - smoothParallaxRef.current) * smoothingFactor;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '12px monospace';
      
      drops.forEach((drop, i) => {
        ctx.fillStyle = `rgba(180, 180, 180, ${drop.opacity})`;
        
        const adjustedY = drop.y - smoothParallaxRef.current;
        
        ctx.fillText(drop.char, i * columnWidth, adjustedY);
        
        drop.y += drop.speed;
        
        if (adjustedY > canvas.height + 200) {
          drop.y = Math.random() * -500 - 100 + smoothParallaxRef.current; 
          drop.char = binaryChars[Math.floor(Math.random() * binaryChars.length)];
          drop.speed = Math.random() * 0.8 + 0.2;
          drop.opacity = Math.random() * 0.15 + 0.65;
        }
        
        if (Math.random() > 0.998) {
          drop.char = binaryChars[Math.floor(Math.random() * binaryChars.length)];
        }
      });
      
      animationIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none', 
        zIndex: 1, 
        background: 'white'
      }}
    />
  );
};

export default BinaryRain;
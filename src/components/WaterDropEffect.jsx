// src/components/WaterDropEffect.jsx
import React, { useEffect, useRef } from 'react';
import './WaterDropEffect.css';

export default function WaterDropEffect({ isActive }) {
  const dropletRef = useRef(null);
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    // GPU Accelerated Web Animation API
    const droplet = dropletRef.current;
    const outer = outerRef.current;
    const inner = innerRef.current;
    const glow = glowRef.current;

    if (droplet && outer && inner && glow) {
      // 1. Droplet Falls (Smooth cubic-bezier)
      droplet.animate([
        { transform: 'translateY(-15px) scale(0.5)', opacity: 0 },
        { transform: 'translateY(8px) scale(1.2)', opacity: 1 },
        { transform: 'translateY(15px) scale(0.3)', opacity: 0 }
      ], {
        duration: 700,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fill: 'forwards'
      });

      // 2. Outer Ring Expands
      outer.animate([
        { transform: 'scale(0.5)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(2.5)', opacity: 0 }
      ], {
        duration: 800,
        easing: 'ease-out',
        fill: 'forwards'
      });

      // 3. Inner Ring Expands
      inner.animate([
        { transform: 'scale(0.5)', opacity: 0 },
        { transform: 'scale(1.8)', opacity: 0.8 },
        { transform: 'scale(2)', opacity: 0 }
      ], {
        duration: 700,
        easing: 'ease-out',
        fill: 'forwards'
      });

      // 4. Magic Glass Glow (Fade in seamlessly)
      glow.animate([
        { transform: 'scale(0.1)', opacity: 0 },
        { transform: 'scale(1.5)', opacity: 0.4 },
        { transform: 'scale(1.2)', opacity: 0.15 }
      ], {
        duration: 600,
        easing: 'ease-out',
        fill: 'forwards'
      });
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="water-drop-wrapper">
      <div className="drop-droplet" ref={dropletRef}></div>
      <div className="drop-ring-outer" ref={outerRef}></div>
      <div className="drop-ring-inner" ref={innerRef}></div>
      <div className="drop-magic-glow" ref={glowRef}></div>
    </div>
  );
}
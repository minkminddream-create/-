/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ParticleItem } from '../types/game';

interface ParticleLayerProps {
  particles: ParticleItem[];
  onRemove: (id: string) => void;
}

// ข้อกำหนดที่ 5: เอฟเฟกต์เหรียญ/ประกายใช้ไม่เกิน 20 ชิ้นพร้อมกัน และลบทิ้งทันทีเมื่อจบแอนิเมชัน
export const ParticleLayer = React.memo(function ParticleLayer({
  particles,
  onRemove,
}: ParticleLayerProps) {
  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          onAnimationEnd={() => onRemove(p.id)}
          className="absolute font-black text-sm sm:text-base drop-shadow animate-coin-float"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            color: p.color,
            willChange: 'transform, opacity',
          }}
        >
          {p.text}
        </div>
      ))}
    </div>
  );
});

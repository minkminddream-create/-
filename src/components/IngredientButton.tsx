/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Ingredient } from '../types/game';

interface IngredientButtonProps {
  ingredient: Ingredient;
  onSelect: (ingredient: Ingredient) => void;
  disabled?: boolean;
}

// ข้อกำหนดที่ 3: ใช้ React.memo ป้องกันการ re-render ทั้งหน้าจอเมื่อเวลาหรือแถบความอดทนขยับ
export const IngredientButton = React.memo(function IngredientButton({
  ingredient,
  onSelect,
  disabled = false,
}: IngredientButtonProps) {
  // ข้อกำหนดที่ 6: ใช้ Pointer Events และ touch-action: manipulation ป้องกันดีเลย์และดับเบิ้ลแท็บซูม
  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    // ป้องกันการเลือกข้อความและการลากบนมือถือ
    e.preventDefault();
    onSelect(ingredient);
  };

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      disabled={disabled}
      className={`relative flex flex-col items-center justify-center min-h-[68px] min-w-[68px] p-1.5 rounded-xl border-2 transition-transform duration-75 active:scale-95 touch-action-manipulation cursor-pointer select-none ${
        disabled
          ? 'opacity-40 border-stone-300 bg-stone-100 cursor-not-allowed'
          : `${ingredient.colorBg} ${ingredient.colorBorder} hover:brightness-105 active:brightness-95`
      }`}
      aria-label={ingredient.name}
    >
      <span className="text-2xl sm:text-3xl leading-none pointer-events-none drop-shadow-sm">
        {ingredient.emoji}
      </span>
      <span className="mt-1 text-[11px] sm:text-xs font-semibold text-stone-800 text-center leading-tight truncate max-w-full pointer-events-none">
        {ingredient.name}
      </span>
    </button>
  );
});

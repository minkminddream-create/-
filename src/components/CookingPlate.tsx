/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ALL_INGREDIENTS } from '../data/gameData';
import { Customer, IngredientId } from '../types/game';

interface CookingPlateProps {
  activeCustomer: Customer | null;
  currentIngredients: IngredientId[];
  isRuined: boolean;
  onDiscard: () => void;
}

export const CookingPlate = React.memo(function CookingPlate({
  activeCustomer,
  currentIngredients,
  isRuined,
  onDiscard,
}: CookingPlateProps) {
  if (!activeCustomer) {
    return (
      <div className="w-full bg-amber-900/10 rounded-2xl border-2 border-dashed border-amber-300 p-3 flex items-center justify-center text-stone-600 text-sm">
        <span className="mr-2 text-xl">🍳</span>
        <span>เลือกลูกค้าด้านบนเพื่อเริ่มทำอาหารจานด่วน</span>
      </div>
    );
  }

  const { recipe } = activeCustomer;
  const currentStep = currentIngredients.length;
  const nextRequiredIngId = recipe.ingredients[currentStep];
  const nextRequiredIng = nextRequiredIngId ? ALL_INGREDIENTS[nextRequiredIngId] : null;

  return (
    <div
      className={`w-full rounded-2xl p-2.5 sm:p-3 border-2 transition-transform duration-100 ${
        isRuined
          ? 'bg-rose-100 border-rose-500 animate-dish-error'
          : 'bg-white border-amber-300'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        {/* ข้อมูลจานที่กำลังทำ */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="text-3xl sm:text-4xl p-1 bg-amber-50 rounded-xl border border-amber-200 shrink-0">
            {recipe.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm sm:text-base text-stone-900 truncate">
                {recipe.name}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ฿{recipe.price}
              </span>
            </div>
            <p className="text-xs text-stone-500 truncate">
              {isRuined ? (
                <span className="text-rose-600 font-bold">⚠️ จานเสีย! กำลังล้างจานใหม่...</span>
              ) : nextRequiredIng ? (
                <span>
                  ขั้นตอนต่อไป:{' '}
                  <span className="font-bold text-amber-800">
                    แตะ {nextRequiredIng.name} {nextRequiredIng.emoji}
                  </span>
                </span>
              ) : (
                <span className="text-emerald-700 font-bold">✨ พร้อมเสิร์ฟแล้ว!</span>
              )}
            </p>
          </div>
        </div>

        {/* ปุ่มล้างจาน/เททิ้งเสริม (กดได้ตลอดเวลา ไม่ใช่เงื่อนไขบังคับ) */}
        {(currentIngredients.length > 0 || isRuined) && (
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              onDiscard();
            }}
            className="shrink-0 px-2.5 py-1.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-transform active:scale-95 touch-action-manipulation cursor-pointer"
          >
            🗑️ ล้างจาน
          </button>
        )}
      </div>

      {/* รางวัตถุดิบบนจานปัจจุบัน */}
      <div className="mt-2 pt-2 border-t border-amber-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-bold text-stone-600 shrink-0 mr-1">
          บนจาน:
        </span>
        {recipe.ingredients.map((ingId, idx) => {
          const ing = ALL_INGREDIENTS[ingId];
          const isPlaced = idx < currentIngredients.length;
          const isTarget = idx === currentIngredients.length;

          return (
            <div
              key={`plate-${idx}-${ingId}`}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs transition-transform ${
                isPlaced
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold scale-100 animate-plate-success'
                  : isTarget
                  ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold scale-105 ring-1 ring-amber-400'
                  : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60'
              }`}
            >
              <span>{ing?.emoji || '❓'}</span>
              <span className="text-[10px] sm:text-xs truncate">{ing?.name}</span>
              {isPlaced && <span className="text-emerald-600 text-xs font-black">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
});

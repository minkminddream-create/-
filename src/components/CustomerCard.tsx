/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef } from 'react';
import { ALL_INGREDIENTS } from '../data/gameData';
import { Customer } from '../types/game';

interface CustomerCardProps {
  customer: Customer | null;
  slotIndex: number;
  isSelected: boolean;
  onSelectSlot: (slotIndex: number) => void;
  currentStepIndex: number; // ลำดับวัตถุดิบที่ใส่ลงจานแล้วสำหรับลูกค้ารายนี้
}

// ข้อกำหนดที่ 3: ใช้ React.memo ไม่ให้ re-render ทั้งหน้าจอเมื่อเวลาขยับ
export const CustomerCard = React.memo(
  forwardRef<HTMLDivElement, CustomerCardProps>(function CustomerCard(
    { customer, slotIndex, isSelected, onSelectSlot, currentStepIndex },
    ref
  ) {
    if (!customer) {
      return (
        <div className="flex-1 min-w-[100px] max-w-[210px] h-[140px] sm:h-[150px] rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 flex flex-col items-center justify-center text-amber-700/60 p-2">
          <span className="text-2xl opacity-40">🪑</span>
          <span className="text-xs font-medium mt-1">โต๊ะว่าง ({slotIndex + 1})</span>
          <span className="text-[10px] opacity-75">รอลูกค้าเดินมา...</span>
        </div>
      );
    }

    const { recipe, profile } = customer;

    return (
      <div
        role="button"
        tabIndex={0}
        onPointerDown={() => onSelectSlot(slotIndex)}
        className={`flex-1 min-w-[100px] max-w-[210px] h-[140px] sm:h-[150px] rounded-2xl border-2 flex flex-col justify-between p-2 touch-action-manipulation cursor-pointer transition-transform duration-75 active:scale-[0.98] animate-customer-in ${
          isSelected
            ? 'bg-amber-100/90 border-amber-500 shadow-sm ring-2 ring-amber-400'
            : 'bg-white border-amber-200 hover:border-amber-300'
        }`}
      >
        {/* แถวบน: อวาตาร์และชื่อลูกค้า */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="text-2xl sm:text-3xl shrink-0 p-0.5 rounded-full bg-amber-50 border border-amber-200">
            {profile.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-bold text-stone-800 truncate">
              {profile.name}
            </p>
            <p className="text-[9px] text-amber-800 font-medium truncate">
              โต๊ะ {slotIndex + 1} {isSelected && '• กำลังทำ'}
            </p>
          </div>
        </div>

        {/* แถวกลาง: ใบออเดอร์และสูตรที่ต้องทำตามลำดับ */}
        <div className="bg-amber-50/80 rounded-xl p-1.5 border border-amber-200/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-stone-900 truncate">
              {recipe.name}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 shrink-0 ml-1">
              ฿{recipe.price}
            </span>
          </div>

          {/* ลำดับไอคอนวัตถุดิบที่ต้องแตะตามสูตร */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
            {recipe.ingredients.map((ingId, idx) => {
              const ing = ALL_INGREDIENTS[ingId];
              const isCompleted = isSelected && idx < currentStepIndex;
              const isCurrent = isSelected && idx === currentStepIndex;

              return (
                <div
                  key={`${customer.id}-step-${idx}`}
                  className={`relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg border text-sm transition-transform ${
                    isCompleted
                      ? 'bg-emerald-100 border-emerald-400 opacity-90'
                      : isCurrent
                      ? 'bg-amber-200 border-amber-500 scale-110 font-bold'
                      : 'bg-white border-stone-200 opacity-70'
                  }`}
                  title={`${idx + 1}. ${ing?.name || ingId}`}
                >
                  <span className="leading-none text-xs sm:text-sm">
                    {ing?.emoji || '❓'}
                  </span>
                  {/* เครื่องหมายเช็คเมื่อทำวัตถุดิบขั้นตอนนี้เสร็จแล้ว */}
                  {isCompleted && (
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px] font-black">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* แถวล่าง: แถบความอดทนของลูกค้า */}
        {/* ข้อกำหนดที่ 1 & 2: ใช้ CSS transform: scaleX ห้ามเปลี่ยน width ป้องกัน Layout Thrashing */}
        <div className="w-full">
          <div className="flex justify-between items-center text-[9px] font-semibold text-stone-500 mb-0.5 px-0.5">
            <span>ความอดทน</span>
            <span className="text-amber-800">⏳</span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden border border-stone-300/60 relative">
            <div
              ref={ref}
              className="h-full bg-emerald-500 origin-left transition-colors duration-200"
              style={{
                transform: 'scaleX(1)',
                willChange: 'transform',
              }}
            />
          </div>
        </div>
      </div>
    );
  })
);

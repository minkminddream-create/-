/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface StageSummaryProps {
  levelNumber: number;
  levelName: string;
  stageRevenue: number;
  stageTips: number;
  dishesCompleted: number;
  mistakes: number;
  maxCombo: number;
  targetRevenue: number;
  totalMoney: number;
  onOpenShop: () => void;
  onNextLevel: () => void;
}

export const StageSummary: React.FC<StageSummaryProps> = ({
  levelNumber,
  levelName,
  stageRevenue,
  stageTips,
  dishesCompleted,
  mistakes,
  maxCombo,
  targetRevenue,
  totalMoney,
  onOpenShop,
  onNextLevel,
}) => {
  const totalAttempts = dishesCompleted + mistakes;
  const accuracy = totalAttempts > 0 ? Math.round((dishesCompleted / totalAttempts) * 100) : 100;

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 my-auto animate-customer-in">
      <div className="bg-white rounded-3xl border-4 border-amber-500 p-5 sm:p-6 shadow-xl text-center">
        {/* หัวข้อฉลองผ่านด่าน */}
        <div className="inline-block p-3 rounded-full bg-emerald-100 border border-emerald-300 text-3xl mb-2">
          🎉
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
          ผ่านด่านสำเร็จ!
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">
          {levelName}
        </p>

        {/* ยอดเงินและเป้าหมาย */}
        <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200">
          <div className="text-xs text-amber-800 font-bold uppercase">
            รายได้ในด่านนี้
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-0.5">
            ฿{stageRevenue}{' '}
            <span className="text-xs text-stone-500 font-medium">
              / เป้า ฿{targetRevenue}
            </span>
          </div>
          <div className="text-xs text-amber-900 font-medium mt-1">
            (เงินสะสมติดตัวทั้งหมด: ฿{totalMoney})
          </div>
        </div>

        {/* ตารางสถิติผลงานตามโจทย์ */}
        <div className="grid grid-cols-2 gap-2.5 my-4 text-left">
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block">
              💰 ทิปรวม
            </span>
            <span className="text-base font-black text-amber-900">
              ฿{stageTips}
            </span>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block">
              🍽️ จานที่ทำสำเร็จ
            </span>
            <span className="text-base font-black text-stone-900">
              {dishesCompleted} จาน
            </span>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block">
              🎯 ความแม่นยำ
            </span>
            <span className="text-base font-black text-emerald-700">
              {accuracy}%
            </span>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block">
              🔥 คอมโบสูงสุด
            </span>
            <span className="text-base font-black text-orange-600">
              x{maxCombo}
            </span>
          </div>
        </div>

        {/* ปุ่มแอ็กชัน */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            type="button"
            onClick={onNextLevel}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-md transition-transform active:scale-95 touch-action-manipulation cursor-pointer flex items-center justify-center gap-2"
          >
            <span>ลุยด่าน {levelNumber + 1} ต่อไป!</span>
            <span>➡️</span>
          </button>

          <button
            type="button"
            onClick={onOpenShop}
            className="w-full py-2.5 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-bold text-sm transition-transform active:scale-95 touch-action-manipulation cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🛒 แวะซื้อของในร้านค้า</span>
          </button>
        </div>
      </div>
    </div>
  );
};

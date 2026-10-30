/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { getChefTitle } from '../data/gameData';

interface GameOverScreenProps {
  isVictory: boolean;
  totalEarned: number;
  levelReached: number;
  reason: 'hearts_lost' | 'time_up' | 'all_cleared';
  sessionHighScore: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  isVictory,
  totalEarned,
  levelReached,
  reason,
  sessionHighScore,
  onRestart,
}) => {
  const chefTitle = getChefTitle(totalEarned);

  const getReasonText = () => {
    if (reason === 'hearts_lost') {
      return 'ลูกค้าหงุดหงิดจนร้านเสียชื่อเสียงครบ 3 ครั้ง!';
    }
    if (reason === 'time_up') {
      return 'หมดเวลา 90 วินาที และรายได้ยังไม่ถึงเป้าหมาย!';
    }
    return 'ยินดีด้วย! คุณผ่านครบทุกด่านและกลายเป็นสุดยอดเชฟแห่งสยาม!';
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 my-auto animate-customer-in">
      <div
        className={`bg-white rounded-3xl border-4 p-5 sm:p-6 shadow-2xl text-center ${
          isVictory ? 'border-amber-400' : 'border-rose-500'
        }`}
      >
        {/* ไอคอนและหัวข้อ */}
        <div className="text-4xl sm:text-5xl mb-2">
          {isVictory ? '🏆' : '💔'}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
          {isVictory ? 'จบเกมอย่างสมบูรณ์แบบ!' : 'ร้านต้องปิดปรับปรุง!'}
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-rose-600 mt-1">
          {getReasonText()}
        </p>

        {/* ฉายาตามรายได้สะสมตามข้อกำหนดโจทย์ */}
        <div className="my-5 p-4 bg-gradient-to-b from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300">
          <span className="text-xs font-bold text-amber-800 tracking-wider uppercase block">
            ฉายาของคุณในวงการอาหารตามสั่ง
          </span>
          <div className="text-4xl my-1">{chefTitle.badge}</div>
          <div className="text-xl sm:text-2xl font-black text-amber-950">
            {chefTitle.title}
          </div>
          <p className="text-xs text-stone-600 font-medium mt-1">
            {chefTitle.desc}
          </p>
        </div>

        {/* สถิติรวม */}
        <div className="grid grid-cols-2 gap-2 text-left mb-5">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block">
              💵 รายได้รวมทั้งหมด
            </span>
            <span className="text-lg font-black text-emerald-700">
              ฿{totalEarned}
            </span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block">
              🚩 ไปถึงด่านที่
            </span>
            <span className="text-lg font-black text-stone-900">
              ด่าน {levelReached}
            </span>
          </div>
        </div>

        {totalEarned >= sessionHighScore && totalEarned > 0 && (
          <div className="mb-4 py-1.5 px-3 rounded-full bg-amber-100 text-amber-900 text-xs font-black inline-block border border-amber-300">
            🌟 สร้างสถิติใหม่ประจำวันนี้!
          </div>
        )}

        {/* ปุ่มเล่นใหม่ */}
        <button
          type="button"
          onClick={onRestart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base shadow-lg transition-transform active:scale-95 touch-action-manipulation cursor-pointer flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          <span>เล่นใหม่อีกครั้ง</span>
        </button>
      </div>
    </div>
  );
};

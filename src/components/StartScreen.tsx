/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ALL_INGREDIENTS, ALL_RECIPES } from '../data/gameData';
import { RecipeId } from '../types/game';

interface StartScreenProps {
  onStartGame: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  sessionHighScore: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  isMuted,
  onToggleSound,
  sessionHighScore,
}) => {
  const [showRecipeBook, setShowRecipeBook] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center px-4 py-6 sm:py-10">
      {/* ส่วนหัวไตเติลเกม */}
      <div className="text-center relative mb-6">
        <div className="inline-block px-4 py-1 rounded-full bg-red-600 text-amber-200 text-xs sm:text-sm font-black tracking-wider uppercase mb-2 shadow-sm">
          🔥 เกมทำอาหารตามสั่งจานด่วน
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-amber-950 tracking-tight leading-none drop-shadow-sm">
          ครัวไทย<span className="text-red-600">จานด่วน</span>
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-1.5 font-medium">
          Thai Kitchen Rush • เสิร์ฟความแซ่บแข่งกับเวลา!
        </p>

        {sessionHighScore > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
            <span>🏆 สถิติสูงสุดในรอบนี้:</span>
            <span className="text-emerald-700">฿{sessionHighScore}</span>
          </div>
        )}
      </div>

      {/* บัตรแนะนำวิธีเล่นสั้นกระชับ */}
      <div className="w-full bg-white/95 rounded-3xl border-2 border-amber-300 p-4 sm:p-5 shadow-sm mb-6">
        <h2 className="text-sm sm:text-base font-black text-stone-900 mb-3 flex items-center gap-1.5">
          <span>📖</span> วิธีเล่นง่าย ๆ สไตล์แม่ค้าตามสั่ง:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-stone-700">
          <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col">
            <span className="text-xl mb-1">1️⃣ 📋</span>
            <span className="font-bold text-amber-950">ดูลูกค้าและออเดอร์</span>
            <span className="text-[11px] text-stone-600 mt-0.5">
              แตะเลือกลูกค้าบนโต๊ะ ดูไอคอนสูตรอาหารที่สั่ง
            </span>
          </div>
          <div className="p-2.5 bg-orange-50 rounded-2xl border border-orange-200 flex flex-col">
            <span className="text-xl mb-1">2️⃣ 🥩</span>
            <span className="font-bold text-orange-950">แตะตามลำดับสูตร</span>
            <span className="text-[11px] text-stone-600 mt-0.5">
              แตะวัตถุดิบบนเคาน์เตอร์ให้ถูกต้อง ห้ามแตะผิดลำดับ
            </span>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col">
            <span className="text-xl mb-1">3️⃣ 💰</span>
            <span className="font-bold text-emerald-950">รับเงินและทิปด่วน</span>
            <span className="text-[11px] text-stone-600 mt-0.5">
              เสิร์ฟเร็วได้ทิป คอมโบต่อเนื่องคูณเงินสูงสุด x5!
            </span>
          </div>
        </div>
      </div>

      {/* ปุ่มเริ่มเล่นและปุ่มควบคุม */}
      <div className="w-full flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={onStartGame}
          className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-lg sm:text-xl shadow-md transition-transform active:scale-95 touch-action-manipulation cursor-pointer flex items-center justify-center gap-2"
        >
          <span>🍳</span>
          <span>เปิดร้านเริ่มเล่น!</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowRecipeBook(!showRecipeBook)}
            className="flex-1 sm:flex-none py-3.5 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-bold text-sm transition-transform active:scale-95 touch-action-manipulation cursor-pointer"
          >
            {showRecipeBook ? '✕ ซ่อนสูตร' : '📜 ดู 8 สูตรอาหาร'}
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            aria-label={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
            className="p-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-lg transition-transform active:scale-95 touch-action-manipulation cursor-pointer"
            title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* โมดอลเปิดดูสูตรอาหารทั้ง 8 เมนูตามโจทย์ */}
      {showRecipeBook && (
        <div className="w-full mt-6 bg-white rounded-3xl border-2 border-amber-300 p-4 animate-customer-in">
          <h3 className="font-black text-amber-950 text-sm sm:text-base mb-3 flex items-center gap-1.5">
            <span>🌶️</span> ตำรา 8 สูตรเด็ดประจำร้าน:
          </h3>
          <div className="space-y-2">
            {(Object.keys(ALL_RECIPES) as RecipeId[]).map((id, index) => {
              const r = ALL_RECIPES[id];
              return (
                <div
                  key={id}
                  className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-900 w-5">
                      {index + 1}.
                    </span>
                    <span className="text-xl">{r.icon}</span>
                    <span className="font-bold text-stone-900">{r.name}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      ฿{r.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 pl-7 sm:pl-0 flex-wrap">
                    {r.ingredients.map((ingId, idx) => {
                      const ing = ALL_INGREDIENTS[ingId];
                      return (
                        <React.Fragment key={`${id}-${ingId}-${idx}`}>
                          <span className="px-1.5 py-0.5 rounded bg-white border border-stone-200 text-[10px] font-medium text-stone-700">
                            {ing?.emoji} {ing?.name}
                          </span>
                          {idx < r.ingredients.length - 1 && (
                            <span className="text-stone-400 font-bold">→</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

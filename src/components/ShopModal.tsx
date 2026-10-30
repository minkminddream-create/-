/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Upgrades } from '../types/game';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  money: number;
  upgrades: Upgrades;
  onBuyUpgrade: (type: 'speed' | 'patience', cost: number) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  money,
  upgrades,
  onBuyUpgrade,
}) => {
  if (!isOpen) return null;

  const speedCost = [250, 500, 900][upgrades.speedStoveLevel] ?? null;
  const patienceCost = [200, 450, 800][upgrades.discountBannerLevel] ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-md bg-stone-50 rounded-3xl border-4 border-amber-500 p-5 shadow-2xl animate-customer-in">
        {/* หัวข้อร้านค้า */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🛒</span>
            <div>
              <h2 className="text-xl font-black text-amber-950">
                ร้านค้าอุปกรณ์ครัว
              </h2>
              <p className="text-xs text-stone-600 font-medium">
                อัปเกรดเพื่อเร่งรายได้และเอาใจลูกค้า
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-amber-100 rounded-full border border-amber-300">
            <span className="text-sm font-black text-amber-900">฿{money}</span>
          </div>
        </div>

        {/* รายการไอเทมช่วยทั้ง 2 ชิ้นตามข้อกำหนด */}
        <div className="py-4 space-y-3">
          {/* 1. เตาเร่งความเร็ว */}
          <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl p-2 bg-orange-100 rounded-2xl shrink-0">
                🔥
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  เตาเร่งความเร็ว (ขั้น {upgrades.speedStoveLevel}/3)
                </h3>
                <p className="text-xs text-stone-500">
                  เพิ่มพลังไฟกระทะ ได้โบนัสเงินรายได้ +15% ต่อขั้น
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {speedCost !== null ? (
                <button
                  type="button"
                  disabled={money < speedCost}
                  onClick={() => onBuyUpgrade('speed', speedCost)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 touch-action-manipulation cursor-pointer ${
                    money >= speedCost
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  ซื้อ ฿{speedCost}
                </button>
              ) : (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">
                  เต็มแล้ว
                </span>
              )}
            </div>
          </div>

          {/* 2. ป้ายลดราคา/พัดลมคลายร้อน */}
          <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl p-2 bg-cyan-100 rounded-2xl shrink-0">
                🏷️
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  ป้ายลดราคา & สบายใจ (ขั้น {upgrades.discountBannerLevel}/3)
                </h3>
                <p className="text-xs text-stone-500">
                  ลูกค้าใจเย็นขึ้น รอได้นานขึ้น +20% ต่อขั้น
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {patienceCost !== null ? (
                <button
                  type="button"
                  disabled={money < patienceCost}
                  onClick={() => onBuyUpgrade('patience', patienceCost)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 touch-action-manipulation cursor-pointer ${
                    money >= patienceCost
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  ซื้อ ฿{patienceCost}
                </button>
              ) : (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">
                  เต็มแล้ว
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ปุ่มปิด */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-sm transition-transform active:scale-95 touch-action-manipulation cursor-pointer"
          >
            เรียบร้อย
          </button>
        </div>
      </div>
    </div>
  );
};

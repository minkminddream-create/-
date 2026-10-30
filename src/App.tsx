/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CookingPlate } from './components/CookingPlate';
import { CustomerCard } from './components/CustomerCard';
import { GameOverScreen } from './components/GameOverScreen';
import { IngredientButton } from './components/IngredientButton';
import { ParticleLayer } from './components/ParticleLayer';
import { ShopModal } from './components/ShopModal';
import { StageSummary } from './components/StageSummary';
import { StartScreen } from './components/StartScreen';
import {
  ALL_INGREDIENTS,
  ALL_RECIPES,
  CUSTOMER_PROFILES,
  LEVEL_CONFIGS,
} from './data/gameData';
import {
  Customer,
  GameScreen,
  Ingredient,
  IngredientId,
  LevelConfig,
  ParticleItem,
  RecipeId,
  Upgrades,
} from './types/game';
import { sound } from './utils/sound';

export default function App() {
  // สถานะหน้าจอเกม
  const [screen, setScreen] = useState<GameScreen>('title');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);

  // สถิติและข้อมูลการเล่น
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [money, setMoney] = useState<number>(0); // เงินสะสมที่สามารถนำไปซื้อของได้
  const [stageRevenue, setStageRevenue] = useState<number>(0); // รายได้เฉพาะด่านนี้
  const [stageTips, setStageTips] = useState<number>(0);
  const [dishesCompleted, setDishesCompleted] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [reputation, setReputation] = useState<number>(3); // หัวใจ 3 ดวง
  const [combo, setCombo] = useState<number>(1); // คอมโบ x1 - x5
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [timeRemainingSec, setTimeRemainingSec] = useState<number>(90); // แสดงเป็นจำนวนเต็มวินาที

  // ข้อกำหนดที่ 8: ห้ามใช้ localStorage/sessionStorage เก็บคะแนนสูงสุดไว้ในหน่วยความจำของเซสชันเท่านั้น
  const [sessionHighScore, setSessionHighScore] = useState<number>(0);

  // การอัปเกรดไอเทมในร้าน
  const [upgrades, setUpgrades] = useState<Upgrades>({
    speedStoveLevel: 0,
    discountBannerLevel: 0,
  });

  // สถานะลูกค้าทั้ง 3 โต๊ะ (สูงสุด 3 คนบนจอ ตามข้อกำหนดที่ 1)
  const [customers, setCustomers] = useState<(Customer | null)[]>([null, null, null]);
  const [selectedSlot, setSelectedSlot] = useState<number>(0);

  // สถานะจานที่กำลังปรุงบนเคาน์เตอร์
  const [currentIngredients, setCurrentIngredients] = useState<IngredientId[]>([]);
  const [isRuined, setIsRuined] = useState<boolean>(false);

  // ข้อกำหนดที่ 5: เอฟเฟกต์เหรียญ/ประกายไม่เกิน 20 ชิ้นพร้อมกัน
  const [particles, setParticles] = useState<ParticleItem[]>([]);

  // Ref สำหรับควบคุม Loop ความถี่สูงโดยไม่ต้อง re-render React บ่อยเกินไป (ตามข้อกำหนดที่ 2)
  const customersRef = useRef<(Customer | null)[]>([null, null, null]);
  const slot0Ref = useRef<HTMLDivElement>(null);
  const slot1Ref = useRef<HTMLDivElement>(null);
  const slot2Ref = useRef<HTMLDivElement>(null);
  const patienceRefs = [slot0Ref, slot1Ref, slot2Ref];

  const lastFrameTimeRef = useRef<number>(0);
  const nextSpawnTimeRef = useRef<number>(0);
  const levelEndTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const ruinedTimeoutRef = useRef<number | null>(null);

  // ข้อกำหนดที่ 5: ฟังก์ชันล้างตัวจับเวลารีเซ็ตจานเสีย ป้องกันการรีเซ็ตซ้อนหรือค้าง
  const clearRuinedTimeout = useCallback(() => {
    if (ruinedTimeoutRef.current !== null) {
      window.clearTimeout(ruinedTimeoutRef.current);
      ruinedTimeoutRef.current = null;
    }
  }, []);

  // ดึงคอนฟิกของด่านปัจจุบัน
  const currentLevelConfig: LevelConfig = useMemo(() => {
    return LEVEL_CONFIGS[Math.min(currentLevelIndex, LEVEL_CONFIGS.length - 1)];
  }, [currentLevelIndex]);

  // ซิงก์ customersRef ให้ตรงกับ state เสมอ
  useEffect(() => {
    customersRef.current = customers;
  }, [customers]);

  // อัปเดตสถิติคะแนนสูงสุดในหน่วยความจำเซสชัน
  useEffect(() => {
    if (money > sessionHighScore) {
      setSessionHighScore(money);
    }
  }, [money, sessionHighScore]);

  // ข้อกำหนดที่ 7: หยุดเกมอัตโนมัติเมื่อสลับแท็บ (visibilitychange) และล้าง timeout
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && screen === 'playing') {
        clearRuinedTimeout();
        setScreen('paused');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [screen, clearRuinedTimeout]);

  // เคลียร์ timeout เมื่อหน้าจอเปลี่ยน หรือ unmount
  useEffect(() => {
    if (screen !== 'playing') {
      clearRuinedTimeout();
    }
    return () => {
      clearRuinedTimeout();
    };
  }, [screen, clearRuinedTimeout]);

  // เพิ่มเอฟเฟกต์ลอยเหรียญ/ทิป (ควบคุมไม่ให้เกิน 20 ชิ้นตามข้อกำหนดที่ 5)
  const spawnParticle = useCallback((text: string, x: number, y: number, color = '#15803d') => {
    const id = `${Date.now()}-${Math.random()}`;
    setParticles((prev) => {
      const next = [...prev, { id, text, x, y, color }];
      return next.slice(-20);
    });
  }, []);

  const removeParticle = useCallback((id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // สลับเสียงเปิด/ปิด
  const toggleSound = useCallback(() => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    if (!sound.isMuted) {
      sound.playTap();
    }
  }, []);

  // ฟังก์ชันสุ่มเลือกลูกค้าคนใหม่เข้าโต๊ะ
  const spawnCustomerForSlot = useCallback(
    (slotIdx: number, basePatienceSec: number, recipePool: RecipeId[]): Customer => {
      const randomProfile =
        CUSTOMER_PROFILES[Math.floor(Math.random() * CUSTOMER_PROFILES.length)];
      const randomRecipeId =
        recipePool[Math.floor(Math.random() * recipePool.length)];
      const recipe = ALL_RECIPES[randomRecipeId];

      // คำนวณความอดทนตามเลเวลและโบนัสจาก "ป้ายลดราคา/พัดลมคลายร้อน" (+20% ต่อขั้น)
      const patienceMultiplier = 1 + upgrades.discountBannerLevel * 0.2;
      const totalPatienceMs = basePatienceSec * 1000 * patienceMultiplier;

      return {
        id: `cust-${Date.now()}-${Math.random()}`,
        slot: slotIdx,
        profile: randomProfile,
        recipe,
        maxPatienceMs: totalPatienceMs,
        patienceRemainingMs: totalPatienceMs,
        arrivedAt: performance.now(),
      };
    },
    [upgrades.discountBannerLevel]
  );

  // เริ่มต้นด่านใหม่
  const startLevel = useCallback(
    (levelIdx: number) => {
      clearRuinedTimeout();
      const cfg = LEVEL_CONFIGS[Math.min(levelIdx, LEVEL_CONFIGS.length - 1)];
      setCurrentLevelIndex(levelIdx);
      setStageRevenue(0);
      setStageTips(0);
      setDishesCompleted(0);
      setMistakes(0);
      setReputation(3);
      setCombo(1);
      setMaxCombo(1);
      setTimeRemainingSec(cfg.timeLimitSec);
      setCurrentIngredients([]);
      setIsRuined(false);
      setSelectedSlot(0);

      // สร้างลูกค้าเริ่มต้น 2 คนในโต๊ะ 0 และ 1
      const initialCustomers: (Customer | null)[] = [
        spawnCustomerForSlot(0, cfg.basePatienceSec, cfg.recipeIds),
        spawnCustomerForSlot(1, cfg.basePatienceSec + 3, cfg.recipeIds),
        null,
      ];
      setCustomers(initialCustomers);
      customersRef.current = initialCustomers;

      const now = performance.now();
      levelEndTimeRef.current = now + cfg.timeLimitSec * 1000;
      nextSpawnTimeRef.current = now + cfg.customerSpawnIntervalMs;
      lastFrameTimeRef.current = now;
      isPlayingRef.current = true;
      setScreen('playing');
    },
    [spawnCustomerForSlot, clearRuinedTimeout]
  );

  // ==========================================
  // Game Loop: จับเวลาและอัปเดตแถบความอดทน 60fps
  // ==========================================
  useEffect(() => {
    if (screen !== 'playing') {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    let animId: number;
    let lastSecondTick = -1;

    const gameTick = (time: number) => {
      if (!isPlayingRef.current) return;

      const dt = lastFrameTimeRef.current > 0 ? time - lastFrameTimeRef.current : 16;
      lastFrameTimeRef.current = time;

      // 1. ตรวจสอบเวลานับถอยหลังของด่าน (90 วินาที)
      const msLeft = Math.max(0, levelEndTimeRef.current - time);
      const secLeft = Math.ceil(msLeft / 1000);

      // อัปเดต React state เฉพาะเมื่อเปลี่ยนวินาที (ข้อกำหนดที่ 2)
      if (secLeft !== lastSecondTick) {
        lastSecondTick = secLeft;
        setTimeRemainingSec(secLeft);
      }

      // หมดเวลาด่าน
      if (msLeft <= 0) {
        isPlayingRef.current = false;
        clearRuinedTimeout();
        // ตรวจสอบว่าถึงเป้าหมายรายได้หรือไม่
        setStageRevenue((latestRev) => {
          if (latestRev >= currentLevelConfig.targetRevenue) {
            sound.playLevelClear();
            setScreen('summary');
          } else {
            sound.playGameOver();
            setScreen('gameover');
          }
          return latestRev;
        });
        return;
      }

      // 2. ตรวจสอบและอัปเดตความอดทนของลูกค้าทั้ง 3 ช่อง
      let needsStateUpdate = false;
      const currentList = [...customersRef.current];

      for (let i = 0; i < 3; i++) {
        const cust = currentList[i];
        const barElem = patienceRefs[i]?.current;

        if (cust) {
          cust.patienceRemainingMs -= dt;
          const ratio = Math.max(0, cust.patienceRemainingMs / cust.maxPatienceMs);

          // ข้อกำหนดที่ 1 & 2: ใช้ CSS transform: scaleX ตรงสู่ DOM เพื่อความลื่นไหลระดับ 60fps
          if (barElem) {
            barElem.style.transform = `scaleX(${ratio})`;
            if (ratio < 0.25) {
              barElem.style.backgroundColor = '#ef4444'; // สีแดงเตือนไฟลนก้น
            } else if (ratio < 0.5) {
              barElem.style.backgroundColor = '#f59e0b'; // สีส้ม
            } else {
              barElem.style.backgroundColor = '#10b981'; // สีเขียวสดใส
            }
          }

          // ลูกค้าหมดความอดทน เดินออกร้าน!
          if (cust.patienceRemainingMs <= 0) {
            sound.playAngry();
            currentList[i] = null;
            needsStateUpdate = true;

            // เสียชื่อเสียง (หัวใจ -1)
            setReputation((prevRep) => {
              const nextRep = prevRep - 1;
              if (nextRep <= 0) {
                // เสียชื่อเสียงครบ 3 ครั้งในด่านเดียว จบเกมทันที
                isPlayingRef.current = false;
                clearRuinedTimeout();
                sound.playGameOver();
                setScreen('gameover');
              }
              return Math.max(0, nextRep);
            });

            // ตัดคอมโบกลับเป็น 1
            setCombo(1);

            // หากกำลังทำจานของลูกค้ารายนี้อยู่ ให้รีเซ็ตจานและล้าง timeout
            setSelectedSlot((currentSelected) => {
              if (currentSelected === i) {
                clearRuinedTimeout();
                setCurrentIngredients([]);
                setIsRuined(false);
              }
              return currentSelected;
            });
          }
        } else if (barElem) {
          barElem.style.transform = 'scaleX(0)';
        }
      }

      // 3. ตรวจสอบการเดินเข้ามาของลูกค้าใหม่ตามระยะเวลา interval
      if (time >= nextSpawnTimeRef.current) {
        nextSpawnTimeRef.current = time + currentLevelConfig.customerSpawnIntervalMs;
        // หาโต๊ะว่างช่องแรก
        const emptySlotIdx = currentList.findIndex((c) => c === null);
        if (emptySlotIdx !== -1) {
          currentList[emptySlotIdx] = spawnCustomerForSlot(
            emptySlotIdx,
            currentLevelConfig.basePatienceSec,
            currentLevelConfig.recipeIds
          );
          needsStateUpdate = true;
        }
      }

      if (needsStateUpdate) {
        setCustomers(currentList);
        customersRef.current = currentList;
      }

      animId = requestAnimationFrame(gameTick);
    };

    animId = requestAnimationFrame(gameTick);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [screen, currentLevelConfig, spawnCustomerForSlot, clearRuinedTimeout]);

  // ลูกค้าที่กำลังถูกเลือกทำอาหารอยู่
  const activeCustomer = customers[selectedSlot] ?? null;

  // วัตถุดิบทั้งหมดที่มีให้กดบนเคาน์เตอร์สำหรับด่านนี้ (การันตีไม่เกิน 12 ปุ่ม ตามข้อกำหนดที่ 1)
  const activeLevelIngredients: Ingredient[] = useMemo(() => {
    const ingIdSet = new Set<IngredientId>();
    currentLevelConfig.recipeIds.forEach((rid) => {
      const rec = ALL_RECIPES[rid];
      if (rec) {
        rec.ingredients.forEach((id) => ingIdSet.add(id));
      }
    });

    // แปลงเป็น Array วัตถุดิบ
    const list: Ingredient[] = [];
    ingIdSet.forEach((id) => {
      if (ALL_INGREDIENTS[id]) {
        list.push(ALL_INGREDIENTS[id]);
      }
    });

    // จำกัดไม่เกิน 12 ปุ่มบนหน้าจอ
    return list.slice(0, 12);
  }, [currentLevelConfig]);

  // ==========================================
  // ตรวจสอบลำดับสูตรและการแตะวัตถุดิบ
  // ==========================================
  const handleSelectIngredient = useCallback(
    (ingredient: Ingredient) => {
      if (!activeCustomer || screen !== 'playing') return;

      const recipe = activeCustomer.recipe;

      // ข้อ 2: ระหว่างแสดงสถานะจานเสีย ถ้าผู้เล่นกดวัตถุดิบตัวแรกของสูตร ให้รีเซ็ตทันทีแล้วนับเป็นขั้นแรกของจานใหม่
      if (isRuined) {
        if (ingredient.id === recipe.ingredients[0]) {
          clearRuinedTimeout();
          setIsRuined(false);
          sound.playTap();
          sound.playSizzle();
          setCurrentIngredients([ingredient.id]);
          return;
        } else {
          // หากกดวัตถุดิบอื่นที่ไม่ใช่ตัวแรก ให้ส่งเสียงเตือนเบา ๆ และปล่อยให้ตัวนับ 0.8s ทำงานต่อ
          sound.playError();
          return;
        }
      }

      const currentStep = currentIngredients.length;
      const expectedIngId = recipe.ingredients[currentStep];

      // 【ตรวจลำดับสูตร】: เทียบวัตถุดิบที่แตะกับลำดับที่ถูกต้องตามสูตร
      if (ingredient.id === expectedIngId) {
        // แตะถูกลำดับ
        sound.playTap();
        sound.playSizzle();

        const nextIngredients = [...currentIngredients, ingredient.id];
        setCurrentIngredients(nextIngredients);

        // ตรวจสอบว่าใส่วัตถุดิบครบทุกขั้นตอนของเมนูแล้วหรือยัง
        if (nextIngredients.length === recipe.ingredients.length) {
          // จานเสร็จสมบูรณ์!
          clearRuinedTimeout();
          sound.playDishDone();

          // คำนวณรายได้และทิป
          const basePrice = recipe.price;
          // โบนัสจาก "เตาเร่งความเร็ว" (+15% รายได้ต่อขั้น)
          const stoveMultiplier = 1 + upgrades.speedStoveLevel * 0.15;
          const adjustedPrice = Math.round(basePrice * stoveMultiplier);

          // คำนวณทิปตามความอดทนที่เหลือ (ยิ่งเสิร์ฟไวยิ่งได้ทิปเยอะ)
          const patienceRatio = Math.max(
            0,
            activeCustomer.patienceRemainingMs / activeCustomer.maxPatienceMs
          );
          const tip = patienceRatio > 0.4 ? Math.round(basePrice * 0.3 * patienceRatio) : 0;

          // รายได้รวมของจานนี้คูณด้วยคอมโบ
          const currentCombo = combo;
          const dishEarnings = adjustedPrice * currentCombo + tip;

          // เล่นเสียงเหรียญ
          sound.playCoin();

          // แสดงเอฟเฟกต์เหรียญลอย (ตำแหน่งกึ่งกลางหน้าจอ)
          const screenW = window.innerWidth;
          spawnParticle(
            `+฿${dishEarnings} ${currentCombo > 1 ? `(x${currentCombo})` : ''}`,
            screenW / 2 - 30,
            240,
            '#16a34a'
          );

          if (tip > 0) {
            spawnParticle(`ทิป ฿${tip}!`, screenW / 2 + 10, 210, '#d97706');
          }

          // อัปเดตสถิติรายได้
          setMoney((m) => m + dishEarnings);
          setStageRevenue((sr) => sr + dishEarnings);
          setStageTips((st) => st + tip);
          setDishesCompleted((dc) => dc + 1);

          // เพิ่มคอมโบ (สูงสุด x5)
          setCombo((c) => {
            const nextCombo = Math.min(5, c + 1);
            setMaxCombo((mc) => Math.max(mc, nextCombo));
            return nextCombo;
          });

          // เคลียร์ลูกค้าที่ได้รับอาหารแล้วออกจากโต๊ะ
          const updated = [...customersRef.current];
          updated[selectedSlot] = null;
          setCustomers(updated);
          customersRef.current = updated;

          // รีเซ็ตจานปรุง
          setCurrentIngredients([]);
          setIsRuined(false);

          // ย้ายไปเลือกลูกค้าโต๊ะถัดไปที่มีออเดอร์รออยู่โดยอัตโนมัติ
          const nextSlot = updated.findIndex((c) => c !== null);
          if (nextSlot !== -1) {
            setSelectedSlot(nextSlot);
          }
        }
      } else {
        // 【แตะผิดลำดับ】: ข้อ 1 แสดงสถานะ "จานเสีย" ประมาณ 0.8 วินาที แล้วรีเซ็ตจานเป็นว่างเองอัตโนมัติ
        sound.playError();
        setIsRuined(true);
        setCombo(1);
        setMistakes((m) => m + 1);

        const screenW = window.innerWidth;
        spawnParticle('❌ จานเสีย!', screenW / 2 - 20, 260, '#e11d48');

        // ข้อ 1 & 5: ตั้งเวลารีเซ็ตจานอัตโนมัติ 0.8 วินาที (800ms)
        clearRuinedTimeout();
        ruinedTimeoutRef.current = window.setTimeout(() => {
          setIsRuined(false);
          setCurrentIngredients([]);
          ruinedTimeoutRef.current = null;
        }, 800);
      }
    },
    [
      activeCustomer,
      isRuined,
      screen,
      currentIngredients,
      upgrades.speedStoveLevel,
      combo,
      spawnParticle,
      selectedSlot,
      clearRuinedTimeout,
    ]
  );

  // กดเททิ้ง/ล้างจานที่เสียหรืออยากเริ่มทำใหม่
  const handleDiscardPlate = useCallback(() => {
    clearRuinedTimeout();
    sound.playTap();
    setCurrentIngredients([]);
    setIsRuined(false);
  }, [clearRuinedTimeout]);

  // ซื้อของอัปเกรดในร้านค้า
  const handleBuyUpgrade = useCallback(
    (type: 'speed' | 'patience', cost: number) => {
      if (money < cost) return;
      sound.playCoin();
      setMoney((m) => m - cost);
      setUpgrades((prev) => {
        if (type === 'speed') {
          return { ...prev, speedStoveLevel: prev.speedStoveLevel + 1 };
        } else {
          return { ...prev, discountBannerLevel: prev.discountBannerLevel + 1 };
        }
      });
    },
    [money]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-stone-100 text-stone-900 flex flex-col justify-between selection:bg-amber-300">
      {/* เลเยอร์อนุภาคเหรียญลอย (จำกัดไม่เกิน 20 ชิ้น) */}
      <ParticleLayer particles={particles} onRemove={removeParticle} />

      {/* 1. หน้าเริ่มเกม */}
      {screen === 'title' && (
        <StartScreen
          onStartGame={() => startLevel(0)}
          isMuted={isMuted}
          onToggleSound={toggleSound}
          sessionHighScore={sessionHighScore}
        />
      )}

      {/* 2. หน้าเล่นเกมหลัก */}
      {(screen === 'playing' || screen === 'paused') && (
        <div className="w-full max-w-2xl mx-auto flex flex-col h-screen max-h-screen p-2 sm:p-3 overflow-hidden select-none">
          {/* แถบส่วนหัว: เงิน เวลา เป้าหมาย คอมโบ หัวใจ และปุ่มหยุด */}
          <header className="w-full bg-white/95 rounded-2xl border-2 border-amber-300 p-2 sm:p-2.5 shadow-sm shrink-0 mb-2">
            <div className="flex items-center justify-between gap-1.5 flex-wrap">
              {/* รายได้และเป้าหมาย */}
              <div className="flex items-center gap-1.5">
                <div className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-300 flex items-center gap-1">
                  <span className="text-sm">💵</span>
                  <span className="font-black text-sm sm:text-base text-emerald-700">
                    ฿{stageRevenue}
                  </span>
                  <span className="text-[10px] text-stone-500 font-semibold">
                    / ฿{currentLevelConfig.targetRevenue}
                  </span>
                </div>

                {/* คอมโบ */}
                <div
                  className={`px-2 py-1 rounded-xl border flex items-center gap-1 text-xs font-black transition-transform ${
                    combo > 1
                      ? 'bg-orange-500 text-white border-orange-600 scale-105'
                      : 'bg-stone-100 text-stone-500 border-stone-200'
                  }`}
                >
                  <span>🔥</span>
                  <span>x{combo}</span>
                </div>
              </div>

              {/* เวลานับถอยหลัง */}
              <div
                className={`px-3 py-1 rounded-xl border-2 font-black text-sm sm:text-base flex items-center gap-1.5 ${
                  timeRemainingSec <= 15
                    ? 'bg-rose-100 border-rose-500 text-rose-700 animate-pulse'
                    : 'bg-amber-100 border-amber-400 text-amber-950'
                }`}
              >
                <span>⏱️</span>
                <span>{timeRemainingSec}s</span>
              </div>

              {/* ชื่อเสียง (หัวใจ 3 ดวง) และปุ่มพัก/เสียง */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 px-2 py-1 rounded-xl bg-rose-50 border border-rose-200">
                  {[0, 1, 2].map((idx) => (
                    <span
                      key={`heart-${idx}`}
                      className={`text-sm sm:text-base transition-opacity ${
                        idx < reputation ? 'opacity-100' : 'opacity-25 grayscale'
                      }`}
                    >
                      ❤️
                    </span>
                  ))}
                </div>

                {/* ปุ่มหยุดเกม */}
                <button
                  type="button"
                  onClick={() => setScreen(screen === 'playing' ? 'paused' : 'playing')}
                  className="p-1.5 rounded-xl border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm active:scale-95 touch-action-manipulation cursor-pointer"
                  title="หยุดชั่วคราว"
                >
                  {screen === 'playing' ? '⏸️' : '▶️'}
                </button>
              </div>
            </div>
          </header>

          {/* โซนบน: ลูกค้า 3 โต๊ะ (สูงสุด 3 คนบนจอ) */}
          <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2 shrink-0 mb-2">
            {[0, 1, 2].map((slotIdx) => (
              <CustomerCard
                key={`slot-${slotIdx}`}
                ref={patienceRefs[slotIdx]}
                customer={customers[slotIdx]}
                slotIndex={slotIdx}
                isSelected={selectedSlot === slotIdx}
                onSelectSlot={(slot) => {
                  if (selectedSlot !== slot) {
                    clearRuinedTimeout();
                    setIsRuined(false);
                    setCurrentIngredients([]);
                  }
                  setSelectedSlot(slot);
                  sound.playTap();
                }}
                currentStepIndex={selectedSlot === slotIdx ? currentIngredients.length : 0}
              />
            ))}
          </div>

          {/* โซนกลาง: จานปรุงอาหารที่กำลังทำอยู่ */}
          <div className="w-full shrink-0 mb-2">
            <CookingPlate
              activeCustomer={activeCustomer}
              currentIngredients={currentIngredients}
              isRuined={isRuined}
              onDiscard={handleDiscardPlate}
            />
          </div>

          {/* โซนล่าง: เคาน์เตอร์วัตถุดิบ (ไม่เกิน 12 ปุ่ม แต่ละปุ่มขนาด >= 64px) */}
          <div className="w-full flex-1 bg-amber-950/90 rounded-2xl p-2 sm:p-2.5 border-4 border-amber-700 flex flex-col justify-center min-h-[160px] overflow-hidden">
            <div className="flex items-center justify-between px-1 mb-1 text-amber-200/80 text-[11px] font-bold">
              <span>🥢 แตะวัตถุดิบตามสูตรอาหาร</span>
              <span className="text-[10px] text-amber-300/80">
                {currentLevelConfig.name}
              </span>
            </div>

            {/* กริดปุ่มวัตถุดิบ (ข้อกำหนดที่ 1, 3, 4, 6) */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2 w-full h-full items-center">
              {activeLevelIngredients.map((ingredient) => (
                <IngredientButton
                  key={ingredient.id}
                  ingredient={ingredient}
                  onSelect={handleSelectIngredient}
                  disabled={!activeCustomer}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* โอเวอร์เลย์เมื่อหยุดเกมชั่วคราว */}
      {screen === 'paused' && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-amber-500 p-6 max-w-xs w-full text-center shadow-2xl">
            <h3 className="text-2xl font-black text-amber-950 mb-2">
              พักเกมชั่วคราว
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              เวลาหยุดนิ่งแล้ว แม่ค้าพักดื่มน้ำแป๊บหนึ่งได้นะ
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setScreen('playing')}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm active:scale-95 touch-action-manipulation cursor-pointer"
              >
                ▶️ เล่นต่อทันที
              </button>
              <button
                type="button"
                onClick={toggleSound}
                className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs active:scale-95 touch-action-manipulation cursor-pointer"
              >
                {isMuted ? '🔇 เปิดเสียง' : '🔊 ปิดเสียง'}
              </button>
              <button
                type="button"
                onClick={() => setScreen('title')}
                className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-bold text-xs active:scale-95 touch-action-manipulation cursor-pointer"
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. หน้าสรุปผลด่าน */}
      {screen === 'summary' && (
        <StageSummary
          levelNumber={currentLevelIndex + 1}
          levelName={currentLevelConfig.name}
          stageRevenue={stageRevenue}
          stageTips={stageTips}
          dishesCompleted={dishesCompleted}
          mistakes={mistakes}
          maxCombo={maxCombo}
          targetRevenue={currentLevelConfig.targetRevenue}
          totalMoney={money}
          onOpenShop={() => setIsShopOpen(true)}
          onNextLevel={() => {
            if (currentLevelIndex + 1 < LEVEL_CONFIGS.length) {
              startLevel(currentLevelIndex + 1);
            } else {
              setScreen('victory');
            }
          }}
        />
      )}

      {/* 4. หน้าจบเกม หรือ ชนะเกม */}
      {(screen === 'gameover' || screen === 'victory') && (
        <GameOverScreen
          isVictory={screen === 'victory'}
          totalEarned={money}
          levelReached={currentLevelIndex + 1}
          reason={
            screen === 'victory'
              ? 'all_cleared'
              : reputation <= 0
              ? 'hearts_lost'
              : 'time_up'
          }
          sessionHighScore={sessionHighScore}
          onRestart={() => startLevel(0)}
        />
      )}

      {/* โมดอลร้านค้าไอเทมช่วย */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        money={money}
        upgrades={upgrades}
        onBuyUpgrade={handleBuyUpgrade}
      />
    </div>
  );
}

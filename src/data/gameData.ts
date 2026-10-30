/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CustomerProfile, Ingredient, IngredientId, LevelConfig, Recipe, RecipeId } from '../types/game';

// คลังวัตถุดิบทั้งหมดในเกม (พร้อมไอคอนและสีสันสไตล์สตรีทฟู้ดไทย)
export const ALL_INGREDIENTS: Record<IngredientId, Ingredient> = {
  rice: {
    id: 'rice',
    name: 'ข้าวสวย',
    emoji: '🍚',
    colorBg: 'bg-amber-50',
    colorBorder: 'border-amber-300',
  },
  egg_omelet: {
    id: 'egg_omelet',
    name: 'ไข่เจียว',
    emoji: '🍳',
    colorBg: 'bg-yellow-100',
    colorBorder: 'border-yellow-400',
  },
  pork_basil: {
    id: 'pork_basil',
    name: 'กะเพราหมู',
    emoji: '🥩',
    colorBg: 'bg-red-50',
    colorBorder: 'border-red-400',
  },
  egg_fried: {
    id: 'egg_fried',
    name: 'ไข่ดาว',
    emoji: '🍳',
    colorBg: 'bg-orange-50',
    colorBorder: 'border-amber-400',
  },
  noodles: {
    id: 'noodles',
    name: 'เส้นผัดไทย',
    emoji: '🍜',
    colorBg: 'bg-orange-100',
    colorBorder: 'border-orange-400',
  },
  shrimp: {
    id: 'shrimp',
    name: 'กุ้งสด',
    emoji: '🦐',
    colorBg: 'bg-rose-100',
    colorBorder: 'border-rose-400',
  },
  bean_sprouts: {
    id: 'bean_sprouts',
    name: 'ถั่วงอก',
    emoji: '🌱',
    colorBg: 'bg-emerald-50',
    colorBorder: 'border-emerald-300',
  },
  peanuts: {
    id: 'peanuts',
    name: 'ถั่วลิสง',
    emoji: '🥜',
    colorBg: 'bg-amber-100',
    colorBorder: 'border-amber-500',
  },
  soup: {
    id: 'soup',
    name: 'น้ำซุปต้มยำ',
    emoji: '🍲',
    colorBg: 'bg-red-100',
    colorBorder: 'border-red-500',
  },
  mushroom: {
    id: 'mushroom',
    name: 'เห็ดฟาง',
    emoji: '🍄',
    colorBg: 'bg-stone-100',
    colorBorder: 'border-stone-400',
  },
  lime: {
    id: 'lime',
    name: 'มะนาว',
    emoji: '🍋',
    colorBg: 'bg-lime-100',
    colorBorder: 'border-lime-400',
  },
  papaya: {
    id: 'papaya',
    name: 'มะละกอสับ',
    emoji: '🥗',
    colorBg: 'bg-green-100',
    colorBorder: 'border-green-400',
  },
  tomato: {
    id: 'tomato',
    name: 'มะเขือเทศ',
    emoji: '🍅',
    colorBg: 'bg-red-50',
    colorBorder: 'border-red-400',
  },
  long_beans: {
    id: 'long_beans',
    name: 'ถั่วฝักยาว',
    emoji: '🫘',
    colorBg: 'bg-emerald-100',
    colorBorder: 'border-emerald-500',
  },
  fish_sauce: {
    id: 'fish_sauce',
    name: 'น้ำปลาร้า/น้ำปลา',
    emoji: '🧂',
    colorBg: 'bg-yellow-50',
    colorBorder: 'border-yellow-600',
  },
  oily_rice: {
    id: 'oily_rice',
    name: 'ข้าวมัน',
    emoji: '🍚',
    colorBg: 'bg-amber-50',
    colorBorder: 'border-yellow-400',
  },
  chicken_boiled: {
    id: 'chicken_boiled',
    name: 'ไก่ต้ม',
    emoji: '🍗',
    colorBg: 'bg-orange-50',
    colorBorder: 'border-orange-300',
  },
  cucumber: {
    id: 'cucumber',
    name: 'แตงกวา',
    emoji: '🥒',
    colorBg: 'bg-emerald-50',
    colorBorder: 'border-emerald-400',
  },
  soy_sauce: {
    id: 'soy_sauce',
    name: 'น้ำจิ้มข้าวมันไก่',
    emoji: '🥣',
    colorBg: 'bg-amber-100',
    colorBorder: 'border-amber-600',
  },
  sticky_rice: {
    id: 'sticky_rice',
    name: 'ข้าวเหนียว',
    emoji: '🍙',
    colorBg: 'bg-neutral-100',
    colorBorder: 'border-neutral-300',
  },
  chicken_grilled: {
    id: 'chicken_grilled',
    name: 'ไก่ย่าง',
    emoji: '🍖',
    colorBg: 'bg-amber-100',
    colorBorder: 'border-amber-600',
  },
  spicy_sauce: {
    id: 'spicy_sauce',
    name: 'น้ำจิ้มแจ่ว',
    emoji: '🌶️',
    colorBg: 'bg-red-100',
    colorBorder: 'border-red-500',
  },
  mango: {
    id: 'mango',
    name: 'มะม่วงสุก',
    emoji: '🥭',
    colorBg: 'bg-yellow-200',
    colorBorder: 'border-yellow-500',
  },
  coconut_milk: {
    id: 'coconut_milk',
    name: 'น้ำกะทิ',
    emoji: '🥥',
    colorBg: 'bg-neutral-50',
    colorBorder: 'border-neutral-400',
  },
};

// 8 เมนูตามโจทย์กำหนด เรียงลำดับขั้นตอนตามสูตรเป๊ะ
export const ALL_RECIPES: Record<RecipeId, Recipe> = {
  omelet_rice: {
    id: 'omelet_rice',
    name: 'ข้าวไข่เจียว',
    nameEn: 'Omelet on Rice',
    icon: '🍳',
    price: 40,
    unlockedAtLevel: 1,
    ingredients: ['rice', 'egg_omelet'],
    description: 'ข้าวสวยร้อน ๆ โปะด้วยไข่เจียวหอมกรอบ ฟูนุ่มชวนหิว',
  },
  krapao_pork: {
    id: 'krapao_pork',
    name: 'ผัดกะเพราหมูไข่ดาว',
    nameEn: 'Pad Kra Pao with Fried Egg',
    icon: '🍛',
    price: 60,
    unlockedAtLevel: 1,
    ingredients: ['rice', 'pork_basil', 'egg_fried'],
    description: 'เมนูยอดฮิตแห่งชาติ ข้าวสวย กะเพราหมูรสจัดจ้าน โปะไข่ดาวกรอบ',
  },
  pad_thai: {
    id: 'pad_thai',
    name: 'ผัดไทยกุ้งสด',
    nameEn: 'Pad Thai',
    icon: '🥢',
    price: 80,
    unlockedAtLevel: 1,
    ingredients: ['noodles', 'shrimp', 'bean_sprouts', 'peanuts'],
    description: 'เส้นเหนียวนุ่ม ผัดคลุกเคล้ากุ้งสด ถั่วงอกกรอบ โรยถั่วลิสงบดหอมมัน',
  },
  tom_yum: {
    id: 'tom_yum',
    name: 'ต้มยำกุ้ง',
    nameEn: 'Tom Yum Goong',
    icon: '🍲',
    price: 90,
    unlockedAtLevel: 2,
    ingredients: ['soup', 'shrimp', 'mushroom', 'lime'],
    description: 'น้ำซุปต้มยำเข้มข้น กุ้งเด้ง เห็ดฟาง บีบมะนาวสดจี๊ดจ๊าดถึงใจ',
  },
  som_tum: {
    id: 'som_tum',
    name: 'ส้มตำไทย/ปลาร้า',
    nameEn: 'Som Tum',
    icon: '🥗',
    price: 60,
    unlockedAtLevel: 3,
    ingredients: ['papaya', 'tomato', 'long_beans', 'fish_sauce'],
    description: 'มะละกอกรอบ ตำเคล้ามะเขือเทศ ถั่วฝักยาว ปรุงน้ำแซ่บนัว',
  },
  khao_man_gai: {
    id: 'khao_man_gai',
    name: 'ข้าวมันไก่',
    nameEn: 'Hainanese Chicken Rice',
    icon: '🍗',
    price: 60,
    unlockedAtLevel: 4,
    ingredients: ['oily_rice', 'chicken_boiled', 'cucumber', 'soy_sauce'],
    description: 'ข้าวมันหอมนุ่ม ไก่ต้มชิ้นฉ่ำ แตงกวากรอบ ราดน้ำจิ้มเต้าเจี้ยวสูตรเด็ด',
  },
  gai_yang: {
    id: 'gai_yang',
    name: 'ไก่ย่างข้าวเหนียว',
    nameEn: 'Grilled Chicken & Sticky Rice',
    icon: '🍖',
    price: 70,
    unlockedAtLevel: 5,
    ingredients: ['sticky_rice', 'chicken_grilled', 'spicy_sauce'],
    description: 'ข้าวเหนียวนุ่ม ไก่ย่างเตาถ่านหอมกรุ่น จิ้มน้ำจิ้มแจ่วรสเด็ด',
  },
  mango_sticky_rice: {
    id: 'mango_sticky_rice',
    name: 'ข้าวเหนียวมะม่วง',
    nameEn: 'Mango Sticky Rice',
    icon: '🥭',
    price: 80,
    unlockedAtLevel: 6,
    ingredients: ['sticky_rice', 'mango', 'coconut_milk'],
    description: 'ของหวานขึ้นชื่อ ข้าวเหนียวมูนหวานมัน มะม่วงสุกฉ่ำ ราดน้ำกะทิเข้มข้น',
  },
};

// บุคลิกลูกค้าร้านตามสั่งสีสันไทยๆ
export const CUSTOMER_PROFILES: CustomerProfile[] = [
  {
    name: 'ป้าสมใจ ขาประจำ',
    avatar: '👵',
    flavorText: 'ป้าขอด่วน ๆ เลยนะลูก เดี๋ยวดูลูกหลานไม่ทัน!',
  },
  {
    name: 'พนักงานออฟฟิศพักเที่ยง',
    avatar: '👨‍💼',
    flavorText: 'พักเที่ยงชั่วโมงเดียว หิวมือสั่นแล้วครับ!',
  },
  {
    name: 'น้องมัธยมสายหิว',
    avatar: '👧',
    flavorText: 'หนูหิวมากเลยพี่ เอาพิเศษเลยได้มั้ยคะ!',
  },
  {
    name: 'ลุงวินท้ายซอย',
    avatar: '🛵',
    flavorText: 'รีบกินรีบวิ่งรอบต่อ ขอไว ๆ หน่อยนะแม่ค้า!',
  },
  {
    name: 'ฝรั่งสายกินสตรีทฟู้ด',
    avatar: '👱‍♂️',
    flavorText: 'Very delicious! I want authentic Thai food please!',
  },
  {
    name: 'พี่ไรเดอร์กล้ามโต',
    avatar: '🚴‍♂️',
    flavorText: 'ลูกค้าออเดอร์มารอแล้วครับ เชฟไฟลุกเลย!',
  },
  {
    name: 'สาวคาเฟ่สายรีวิว',
    avatar: '👩‍🦰',
    flavorText: 'ร้านนี้กำลังดังในเน็ต ขอลองชิมหน่อยนะคะ!',
  },
];

// ตั้งค่าแต่ละด่าน: วัตถุดิบรวมในแต่ละด่านจะไม่เกิน 12 ชนิดแน่นอน (ตรงตามข้อกำหนดที่ 1)
export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    levelNumber: 1,
    name: 'ด่าน 1: มือใหม่หัดผัดตามสั่ง',
    targetRevenue: 300,
    timeLimitSec: 90,
    recipeIds: ['omelet_rice', 'krapao_pork', 'pad_thai'],
    customerSpawnIntervalMs: 4000,
    basePatienceSec: 32,
  },
  {
    levelNumber: 2,
    name: 'ด่าน 2: กลิ่นหอมต้มยำกุ้ง',
    targetRevenue: 550,
    timeLimitSec: 90,
    recipeIds: ['omelet_rice', 'krapao_pork', 'pad_thai', 'tom_yum'],
    customerSpawnIntervalMs: 3600,
    basePatienceSec: 29,
  },
  {
    levelNumber: 3,
    name: 'ด่าน 3: แซ่บสะเดิดส้มตำนัว',
    targetRevenue: 850,
    timeLimitSec: 90,
    recipeIds: ['krapao_pork', 'tom_yum', 'som_tum'],
    customerSpawnIntervalMs: 3300,
    basePatienceSec: 26,
  },
  {
    levelNumber: 4,
    name: 'ด่าน 4: ข้าวมันไก่ในตำนาน',
    targetRevenue: 1200,
    timeLimitSec: 90,
    recipeIds: ['omelet_rice', 'som_tum', 'khao_man_gai'],
    customerSpawnIntervalMs: 3000,
    basePatienceSec: 24,
  },
  {
    levelNumber: 5,
    name: 'ด่าน 5: ไก่ย่างส้มตำยกครก',
    targetRevenue: 1600,
    timeLimitSec: 90,
    recipeIds: ['som_tum', 'gai_yang', 'tom_yum'],
    customerSpawnIntervalMs: 2700,
    basePatienceSec: 22,
  },
  {
    levelNumber: 6,
    name: 'ด่าน 6: หวานฉ่ำข้าวเหนียวมะม่วง',
    targetRevenue: 2100,
    timeLimitSec: 90,
    recipeIds: ['pad_thai', 'gai_yang', 'mango_sticky_rice'],
    customerSpawnIntervalMs: 2500,
    basePatienceSec: 20,
  },
  {
    levelNumber: 7,
    name: 'ด่าน 7+: มหาศึกกระทะสะท้านฟ้า',
    targetRevenue: 2700,
    timeLimitSec: 90,
    recipeIds: ['krapao_pork', 'pad_thai', 'tom_yum', 'mango_sticky_rice'],
    customerSpawnIntervalMs: 2300,
    basePatienceSec: 18,
  },
];

// คำนวณฉายาแม่ครัว/พ่อครัวตามรายได้รวมทั้งเซสชัน
export function getChefTitle(totalEarned: number): { title: string; badge: string; desc: string } {
  if (totalEarned >= 7000) {
    return {
      title: 'เชฟกระทะเหล็กสะท้านโลกา',
      badge: '👑',
      desc: 'ระดับปรมาจารย์แห่งสตรีทฟู้ดไทย ทำเร็วอร่อยเหาะคิวยาวทะลุซอย!',
    };
  }
  if (totalEarned >= 4500) {
    return {
      title: 'ยอดเชฟตามสั่งมือฉมัง',
      badge: '🔥',
      desc: 'สะบัดกระทะไฟลุก แตะวัตถุดิบไม่เคยพลาด ลูกค้าประทับใจให้ทิปกระจาย',
    };
  }
  if (totalEarned >= 2500) {
    return {
      title: 'พ่อครัวฝีมือเด็ด',
      badge: '🍳',
      desc: 'รสชาติเป๊ะ สูตรแม่นยำ เป็นที่พึ่งของชาวออฟฟิศยามเที่ยง',
    };
  }
  if (totalEarned >= 1000) {
    return {
      title: 'ลูกมือเตรียมของคล่องแคล่ว',
      badge: '🥢',
      desc: 'เริ่มจับทางได้ สับหมูเด็ดกะเพราอย่างเร็ว พัฒนาขึ้นเรื่อย ๆ',
    };
  }
  return {
    title: 'เด็กฝึกงานล้างจาน',
    badge: '🧼',
    desc: 'เพิ่งก้าวเข้าสู่ครัวตามสั่ง ฝึกซ้อมอีกนิดรับรองรุ่งแน่นอน!',
  };
}

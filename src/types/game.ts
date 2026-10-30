/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type IngredientId =
  | 'rice'
  | 'egg_omelet'
  | 'pork_basil'
  | 'egg_fried'
  | 'noodles'
  | 'shrimp'
  | 'bean_sprouts'
  | 'peanuts'
  | 'soup'
  | 'mushroom'
  | 'lime'
  | 'papaya'
  | 'tomato'
  | 'long_beans'
  | 'fish_sauce'
  | 'oily_rice'
  | 'chicken_boiled'
  | 'cucumber'
  | 'soy_sauce'
  | 'sticky_rice'
  | 'chicken_grilled'
  | 'spicy_sauce'
  | 'mango'
  | 'coconut_milk';

export interface Ingredient {
  id: IngredientId;
  name: string;
  emoji: string;
  colorBg: string;
  colorBorder: string;
}

export type RecipeId =
  | 'omelet_rice'
  | 'krapao_pork'
  | 'pad_thai'
  | 'tom_yum'
  | 'som_tum'
  | 'khao_man_gai'
  | 'gai_yang'
  | 'mango_sticky_rice';

export interface Recipe {
  id: RecipeId;
  name: string;
  nameEn: string;
  icon: string;
  price: number;
  unlockedAtLevel: number;
  ingredients: IngredientId[];
  description: string;
}

export interface CustomerProfile {
  name: string;
  avatar: string;
  flavorText: string;
}

export interface Customer {
  id: string; // unique instance id
  slot: number; // 0, 1, or 2 (max 3 on screen)
  profile: CustomerProfile;
  recipe: Recipe;
  maxPatienceMs: number;
  patienceRemainingMs: number; // decreases in real-time
  arrivedAt: number;
}

export interface LevelConfig {
  levelNumber: number;
  name: string;
  targetRevenue: number;
  timeLimitSec: number;
  recipeIds: RecipeId[];
  customerSpawnIntervalMs: number;
  basePatienceSec: number;
}

export interface Upgrades {
  speedStoveLevel: number; // 0, 1, 2, 3: speeds up cooking and gives +15% revenue bonus
  discountBannerLevel: number; // 0, 1, 2, 3: customers wait +20% longer per level
}

export interface ParticleItem {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export type GameScreen =
  | 'title'
  | 'playing'
  | 'paused'
  | 'summary'
  | 'gameover'
  | 'victory';

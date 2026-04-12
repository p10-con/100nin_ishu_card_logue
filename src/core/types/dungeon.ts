import type { Theme } from './poem';

export interface DungeonDef {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4;  // 1=易, 4=鬼
  difficultyLabel: string;
  themeBonus?: Theme;           // このダンジョンのテーマ属性（ボーナス対象）
  mapDepth: number;             // マップの深さ
  enemyScaling: number;         // 敵ステータス倍率 (1.0=普通)
  icon: string;
  unlocked: boolean;
}

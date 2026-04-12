export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Theme = Season | 'love' | 'travel' | 'lament' | 'nature' | 'misc';

export type RhetoricalDevice =
  | 'makurakotoba'  // 枕詞
  | 'kakekotoba'   // 掛け言葉
  | 'engo'         // 縁語
  | 'honkadori'    // 本歌取り
  | 'jokotoba'     // 序詞
  | 'taigendome';  // 体言止め

export type PoetRank = 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common';
export type PoetGender = 'male' | 'female';

export interface Poet {
  id: string;
  name: string;
  nameReading: string;
  title: string;
  rank: PoetRank;
  gender: PoetGender;
  era: number;
  isRokkkasen: boolean;      // 六歌仙
  isSanjurokkkasen: boolean; // 三十六歌仙
  hasExile: boolean;         // 流罪経験
  hasTonsure: boolean;       // 出家経験
}

export interface PoemRaw {
  number: number;
  upper: string;
  lower: string;
  upperReading: string;
  lowerReading: string;
  modernTranslation: string;
  poetId: string;
  themes: Theme[];
  rhetoricalDevices: RhetoricalDevice[];
  imagery: string[];
  overrides?: {
    emotionIntensity?: number;
    pathos?: number;
    attack?: number;
    defense?: number;
    elegance?: number;
  };
}

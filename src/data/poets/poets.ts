import type { Poet } from '../../core/types/poem';

export const POETS: Record<string, Poet> = {
  tenji: {
    id: 'tenji', name: '天智天皇', nameReading: 'てんじてんのう',
    title: '天皇', rank: 'legendary', gender: 'male', era: 660,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  jito: {
    id: 'jito', name: '持統天皇', nameReading: 'じとうてんのう',
    title: '天皇', rank: 'legendary', gender: 'female', era: 690,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  kakinomoto: {
    id: 'kakinomoto', name: '柿本人麻呂', nameReading: 'かきのもとのひとまろ',
    title: '歌聖', rank: 'epic', gender: 'male', era: 700,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  yamabe: {
    id: 'yamabe', name: '山部赤人', nameReading: 'やまべのあかひと',
    title: '歌仙', rank: 'epic', gender: 'male', era: 730,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  sarumaru: {
    id: 'sarumaru', name: '猿丸大夫', nameReading: 'さるまるだゆう',
    title: '大夫', rank: 'rare', gender: 'male', era: 800,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  chunagon_yakamochi: {
    id: 'chunagon_yakamochi', name: '中納言家持', nameReading: 'ちゅうなごんやかもち',
    title: '中納言', rank: 'rare', gender: 'male', era: 760,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  abe_nakamaro: {
    id: 'abe_nakamaro', name: '阿倍仲麻呂', nameReading: 'あべのなかまろ',
    title: '大納言', rank: 'rare', gender: 'male', era: 750,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  kisen: {
    id: 'kisen', name: '喜撰法師', nameReading: 'きせんほうし',
    title: '法師', rank: 'uncommon', gender: 'male', era: 820,
    isRokkkasen: true, isSanjurokkkasen: true, hasExile: false, hasTonsure: true,
  },
  ono_komachi: {
    id: 'ono_komachi', name: '小野小町', nameReading: 'おののこまち',
    title: '歌仙', rank: 'uncommon', gender: 'female', era: 850,
    isRokkkasen: true, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  semimaru: {
    id: 'semimaru', name: '蝉丸', nameReading: 'せみまる',
    title: '', rank: 'uncommon', gender: 'male', era: 900,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: true,
  },
  sanjo_udaijin: {
    id: 'sanjo_udaijin', name: '参議篁', nameReading: 'さんぎたかむら',
    title: '参議', rank: 'rare', gender: 'male', era: 840,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: true, hasTonsure: false,
  },
  yozei: {
    id: 'yozei', name: '陽成院', nameReading: 'ようぜいいん',
    title: '天皇', rank: 'legendary', gender: 'male', era: 880,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  kawara_sadaijin: {
    id: 'kawara_sadaijin', name: '河原左大臣', nameReading: 'かわらのさだいじん',
    title: '左大臣', rank: 'epic', gender: 'male', era: 890,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  ko_ko: {
    id: 'ko_ko', name: '光孝天皇', nameReading: 'こうこうてんのう',
    title: '天皇', rank: 'legendary', gender: 'male', era: 885,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  sojo_henjo: {
    id: 'sojo_henjo', name: '僧正遍昭', nameReading: 'そうじょうへんじょう',
    title: '僧正', rank: 'rare', gender: 'male', era: 840,
    isRokkkasen: true, isSanjurokkkasen: true, hasExile: false, hasTonsure: true,
  },
  ariwara_narihira: {
    id: 'ariwara_narihira', name: '在原業平朝臣', nameReading: 'ありわらのなりひらあそん',
    title: '朝臣', rank: 'epic', gender: 'male', era: 870,
    isRokkkasen: true, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  fujiwara_toshiyuki: {
    id: 'fujiwara_toshiyuki', name: '藤原敏行朝臣', nameReading: 'ふじわらのとしゆきあそん',
    title: '朝臣', rank: 'rare', gender: 'male', era: 900,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  ise: {
    id: 'ise', name: '伊勢', nameReading: 'いせ',
    title: '歌仙', rank: 'uncommon', gender: 'female', era: 900,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  minamoto_muneyuki: {
    id: 'minamoto_muneyuki', name: '源宗于朝臣', nameReading: 'みなもとのむねゆきあそん',
    title: '朝臣', rank: 'rare', gender: 'male', era: 910,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  sosei: {
    id: 'sosei', name: '素性法師', nameReading: 'そせいほうし',
    title: '法師', rank: 'uncommon', gender: 'male', era: 880,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: true,
  },
  fun_ya_yasuhide: {
    id: 'fun_ya_yasuhide', name: '文屋康秀', nameReading: 'ふんやのやすひで',
    title: '', rank: 'uncommon', gender: 'male', era: 870,
    isRokkkasen: true, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  bun_ya_asayasu: {
    id: 'bun_ya_asayasu', name: '文屋朝康', nameReading: 'ふんやのあさやす',
    title: '', rank: 'uncommon', gender: 'male', era: 900,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  fujiwara_okikaze: {
    id: 'fujiwara_okikaze', name: '藤原興風', nameReading: 'ふじわらのおきかぜ',
    title: '', rank: 'uncommon', gender: 'male', era: 900,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  ki_tsurayuki: {
    id: 'ki_tsurayuki', name: '紀貫之', nameReading: 'きのつらゆき',
    title: '貫之', rank: 'epic', gender: 'male', era: 930,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  ki_tomonori: {
    id: 'ki_tomonori', name: '紀友則', nameReading: 'きのとものり',
    title: '', rank: 'rare', gender: 'male', era: 900,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  mibu_tadamine: {
    id: 'mibu_tadamine', name: '壬生忠岑', nameReading: 'みぶのただみね',
    title: '', rank: 'uncommon', gender: 'male', era: 920,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  oshikochi_mitsune: {
    id: 'oshikochi_mitsune', name: '凡河内躬恒', nameReading: 'おおしこうちのみつね',
    title: '', rank: 'uncommon', gender: 'male', era: 920,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  minamoto_shitago: {
    id: 'minamoto_shitago', name: '源しげゆき', nameReading: 'みなもとのしげゆき',
    title: '', rank: 'uncommon', gender: 'male', era: 960,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  mibu_tadami: {
    id: 'mibu_tadami', name: '壬生忠見', nameReading: 'みぶのただみ',
    title: '', rank: 'uncommon', gender: 'male', era: 960,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  sakanoue_korenori: {
    id: 'sakanoue_korenori', name: '坂上是則', nameReading: 'さかのうえのこれのり',
    title: '', rank: 'uncommon', gender: 'male', era: 920,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  spring_dawn_unknown: {
    id: 'spring_dawn_unknown', name: '春道列樹', nameReading: 'はるみちのつらき',
    title: '', rank: 'common', gender: 'male', era: 900,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  harumichi_tsuraki: {
    id: 'harumichi_tsuraki', name: '春道列樹', nameReading: 'はるみちのつらき',
    title: '', rank: 'common', gender: 'male', era: 900,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  kiyohara_fukayabu: {
    id: 'kiyohara_fukayabu', name: '清原深養父', nameReading: 'きよはらのふかやぶ',
    title: '', rank: 'uncommon', gender: 'male', era: 930,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  fujiwara_atsutada: {
    id: 'fujiwara_atsutada', name: '藤原敦忠', nameReading: 'ふじわらのあつただ',
    title: '中納言', rank: 'rare', gender: 'male', era: 940,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  minamoto_kintada: {
    id: 'minamoto_kintada', name: '源公忠', nameReading: 'みなもとのきんただ',
    title: '', rank: 'rare', gender: 'male', era: 940,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  fujiwara_asatada: {
    id: 'fujiwara_asatada', name: '藤原朝忠', nameReading: 'ふじわらのあさただ',
    title: '中納言', rank: 'rare', gender: 'male', era: 950,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  chunagon_kanesuke: {
    id: 'chunagon_kanesuke', name: '中納言兼輔', nameReading: 'ちゅうなごんかねすけ',
    title: '中納言', rank: 'rare', gender: 'male', era: 930,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  taira_kanemori: {
    id: 'taira_kanemori', name: '平兼盛', nameReading: 'たいらのかねもり',
    title: '', rank: 'uncommon', gender: 'male', era: 990,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  fujiwara_nakafumi: {
    id: 'fujiwara_nakafumi', name: '藤原仲文', nameReading: 'ふじわらのなかふみ',
    title: '', rank: 'uncommon', gender: 'male', era: 980,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  motoyoshi: {
    id: 'motoyoshi', name: '元良親王', nameReading: 'もとよししんのう',
    title: '親王', rank: 'epic', gender: 'male', era: 940,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
  sone_yoshitada: {
    id: 'sone_yoshitada', name: '曽禰好忠', nameReading: 'そねのよしただ',
    title: '', rank: 'uncommon', gender: 'male', era: 980,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  fujiwara_sanekata: {
    id: 'fujiwara_sanekata', name: '藤原実方朝臣', nameReading: 'ふじわらのさねかたあそん',
    title: '朝臣', rank: 'rare', gender: 'male', era: 995,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: true, hasTonsure: false,
  },
  minamoto_yorimasa: {
    id: 'minamoto_yorimasa', name: '源頼政', nameReading: 'みなもとのよりまさ',
    title: '', rank: 'rare', gender: 'male', era: 1170,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  gido_sanshi: {
    id: 'gido_sanshi', name: '義道三司', nameReading: 'ぎどうさんし',
    title: '', rank: 'uncommon', gender: 'male', era: 980,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  kinto: {
    id: 'kinto', name: '藤原公任', nameReading: 'ふじわらのきんとう',
    title: '大納言', rank: 'epic', gender: 'male', era: 1000,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  izumi_shikibu: {
    id: 'izumi_shikibu', name: '和泉式部', nameReading: 'いずみしきぶ',
    title: '式部', rank: 'epic', gender: 'female', era: 1000,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  murasaki_shikibu: {
    id: 'murasaki_shikibu', name: '紫式部', nameReading: 'むらさきしきぶ',
    title: '式部', rank: 'epic', gender: 'female', era: 1000,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  akazome_emon: {
    id: 'akazome_emon', name: '赤染衛門', nameReading: 'あかぞめえもん',
    title: '衛門', rank: 'rare', gender: 'female', era: 1000,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  ise_no_osuke: {
    id: 'ise_no_osuke', name: '伊勢大輔', nameReading: 'いせのおおすけ',
    title: '大輔', rank: 'rare', gender: 'female', era: 1000,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  koshikibu: {
    id: 'koshikibu', name: '小式部内侍', nameReading: 'こしきぶのないし',
    title: '内侍', rank: 'rare', gender: 'female', era: 1000,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  idewi_ise: {
    id: 'idewi_ise', name: '相模', nameReading: 'さがみ',
    title: '', rank: 'uncommon', gender: 'female', era: 1050,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  sagami: {
    id: 'sagami', name: '相模', nameReading: 'さがみ',
    title: '', rank: 'uncommon', gender: 'female', era: 1050,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  daini_no_sanmi: {
    id: 'daini_no_sanmi', name: '大弐三位', nameReading: 'だいにのさんみ',
    title: '三位', rank: 'rare', gender: 'female', era: 1030,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  fujiwara_michinaga: {
    id: 'fujiwara_michinaga', name: '藤原道長', nameReading: 'ふじわらのみちなが',
    title: '関白', rank: 'epic', gender: 'male', era: 1010,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: true,
  },
  gon_chunagon_sadayori: {
    id: 'gon_chunagon_sadayori', name: '権中納言定頼', nameReading: 'ごんちゅうなごんさだより',
    title: '中納言', rank: 'rare', gender: 'male', era: 1045,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  fujiwara_mototoshi: {
    id: 'fujiwara_mototoshi', name: '藤原基俊', nameReading: 'ふじわらのもととし',
    title: '', rank: 'uncommon', gender: 'male', era: 1130,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  minamoto_toshiyori: {
    id: 'minamoto_toshiyori', name: '源俊頼朝臣', nameReading: 'みなもとのとしよりあそん',
    title: '朝臣', rank: 'rare', gender: 'male', era: 1120,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  monk_ryozen: {
    id: 'monk_ryozen', name: '良暹法師', nameReading: 'りょうぜんほうし',
    title: '法師', rank: 'uncommon', gender: 'male', era: 1060,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: true,
  },
  oe_masafusa: {
    id: 'oe_masafusa', name: '大江匡房', nameReading: 'おおえのまさふさ',
    title: '', rank: 'rare', gender: 'male', era: 1090,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  minamoto_kanemasa: {
    id: 'minamoto_kanemasa', name: '源経信', nameReading: 'みなもとのつねのぶ',
    title: '大納言', rank: 'epic', gender: 'male', era: 1070,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  fujiwara_sanekane: {
    id: 'fujiwara_sanekane', name: '藤原実兼', nameReading: 'ふじわらのさねかね',
    title: '', rank: 'rare', gender: 'male', era: 1090,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  gon_dainagon_tsunenobu: {
    id: 'gon_dainagon_tsunenobu', name: '権大納言経信', nameReading: 'ごんのだいなごんつねのぶ',
    title: '大納言', rank: 'epic', gender: 'male', era: 1096,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  suo_no_naishi: {
    id: 'suo_no_naishi', name: '周防内侍', nameReading: 'すおうのないし',
    title: '内侍', rank: 'rare', gender: 'female', era: 1090,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  gotoba: {
    id: 'gotoba', name: '後鳥羽院', nameReading: 'ごとばいん',
    title: '上皇', rank: 'legendary', gender: 'male', era: 1200,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: true, hasTonsure: false,
  },
  juntoku: {
    id: 'juntoku', name: '順徳院', nameReading: 'じゅんとくいん',
    title: '天皇', rank: 'legendary', gender: 'male', era: 1220,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: true, hasTonsure: false,
  },
  monk_noin: {
    id: 'monk_noin', name: '能因法師', nameReading: 'のういんほうし',
    title: '法師', rank: 'uncommon', gender: 'male', era: 1020,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: true,
  },
  fujiwara_norikane: {
    id: 'fujiwara_norikane', name: '藤原範兼', nameReading: 'ふじわらののりかね',
    title: '', rank: 'uncommon', gender: 'male', era: 1130,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  minamoto_yoriyuki: {
    id: 'minamoto_yoriyuki', name: '源頼政', nameReading: 'みなもとのよりまさ',
    title: '', rank: 'rare', gender: 'male', era: 1170,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  fujiwara_kiyosuke: {
    id: 'fujiwara_kiyosuke', name: '藤原清輔朝臣', nameReading: 'ふじわらのきよすけあそん',
    title: '朝臣', rank: 'rare', gender: 'male', era: 1180,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  saigyo: {
    id: 'saigyo', name: '西行法師', nameReading: 'さいぎょうほうし',
    title: '法師', rank: 'epic', gender: 'male', era: 1180,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: true,
  },
  jakuren: {
    id: 'jakuren', name: '寂蓮法師', nameReading: 'じゃくれんほうし',
    title: '法師', rank: 'rare', gender: 'male', era: 1200,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: true,
  },
  priest_jien: {
    id: 'priest_jien', name: '慈円', nameReading: 'じえん',
    title: '僧都', rank: 'rare', gender: 'male', era: 1210,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: true,
  },
  fujiwara_yoshitsune: {
    id: 'fujiwara_yoshitsune', name: '藤原良経', nameReading: 'ふじわらのよしつね',
    title: '内大臣', rank: 'epic', gender: 'male', era: 1200,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  shunzei_daughter: {
    id: 'shunzei_daughter', name: '式子内親王', nameReading: 'しょくしないしんのう',
    title: '内親王', rank: 'epic', gender: 'female', era: 1200,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: true,
  },
  fujiwara_teika: {
    id: 'fujiwara_teika', name: '藤原定家', nameReading: 'ふじわらのさだいえ',
    title: '朝臣', rank: 'epic', gender: 'male', era: 1230,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  inpumon_in_no_ue: {
    id: 'inpumon_in_no_ue', name: '殷富門院大輔', nameReading: 'いんぷもんいんのたいふ',
    title: '大輔', rank: 'rare', gender: 'female', era: 1190,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  minamoto_sanetomo: {
    id: 'minamoto_sanetomo', name: '鎌倉右大臣', nameReading: 'かまくらのうだいじん',
    title: '右大臣', rank: 'epic', gender: 'male', era: 1218,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  chunagon_masatsune: {
    id: 'chunagon_masatsune', name: '中納言雅経', nameReading: 'ちゅうなごんまさつね',
    title: '中納言', rank: 'rare', gender: 'male', era: 1220,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  monk_saigyou: {
    id: 'monk_saigyou', name: '西行法師', nameReading: 'さいぎょうほうし',
    title: '法師', rank: 'epic', gender: 'male', era: 1180,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: true,
  },
  fujiwara_ietaka: {
    id: 'fujiwara_ietaka', name: '藤原家隆', nameReading: 'ふじわらのいえたか',
    title: '壬生二位', rank: 'rare', gender: 'male', era: 1230,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  shokushi_naishinnoh: {
    id: 'shokushi_naishinnoh', name: '式子内親王', nameReading: 'しょくしないしんのう',
    title: '内親王', rank: 'epic', gender: 'female', era: 1200,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: true,
  },
  fujiwara_tadahira: {
    id: 'fujiwara_tadahira', name: '藤原忠平', nameReading: 'ふじわらのただひら',
    title: '左大臣', rank: 'epic', gender: 'male', era: 940,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  fujiwara_yoshitaka: {
    id: 'fujiwara_yoshitaka', name: '藤原義孝', nameReading: 'ふじわらのよしたか',
    title: '', rank: 'rare', gender: 'male', era: 975,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  fujiwara_mitsutaka: {
    id: 'fujiwara_mitsutaka', name: '道信朝臣', nameReading: 'みちのぶあそん',
    title: '朝臣', rank: 'uncommon', gender: 'male', era: 990,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  udaisho_michitsuna_no_haha: {
    id: 'udaisho_michitsuna_no_haha', name: '右大将道綱母', nameReading: 'うだいしょうみちつなのはは',
    title: '右大将道綱母', rank: 'rare', gender: 'female', era: 975,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  gido_sanshi_no_haha: {
    id: 'gido_sanshi_no_haha', name: '儀同三司母', nameReading: 'ぎどうさんしのはは',
    title: '儀同三司母', rank: 'rare', gender: 'female', era: 980,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  sei_shonagon: {
    id: 'sei_shonagon', name: '清少納言', nameReading: 'せいしょうなごん',
    title: '少納言', rank: 'epic', gender: 'female', era: 1000,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  sakyo_no_daifu_michimasa: {
    id: 'sakyo_no_daifu_michimasa', name: '左京大夫道雅', nameReading: 'さきょうのだいぶみちまさ',
    title: '大夫', rank: 'rare', gender: 'male', era: 1040,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  monk_gyoson: {
    id: 'monk_gyoson', name: '行尊大僧正', nameReading: 'ぎょうそんだいそうじょう',
    title: '大僧正', rank: 'rare', gender: 'male', era: 1130,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: true,
  },
  sanjo_in: {
    id: 'sanjo_in', name: '三条院', nameReading: 'さんじょういん',
    title: '天皇', rank: 'legendary', gender: 'male', era: 1010,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: true,
  },
  noin_hoshi: {
    id: 'noin_hoshi', name: '能因法師', nameReading: 'のういんほうし',
    title: '法師', rank: 'uncommon', gender: 'male', era: 1020,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: true,
  },
  minamoto_tsunenobu: {
    id: 'minamoto_tsunenobu', name: '源経信', nameReading: 'みなもとのつねのぶ',
    title: '大納言', rank: 'epic', gender: 'male', era: 1096,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  gon_chunagon_masafusa: {
    id: 'gon_chunagon_masafusa', name: '権中納言匡房', nameReading: 'ごんちゅうなごんまさふさ',
    title: '中納言', rank: 'rare', gender: 'male', era: 1090,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  gon_dainagon_masafusa: {
    id: 'gon_dainagon_masafusa', name: '大江匡房', nameReading: 'おおえのまさふさ',
    title: '大納言', rank: 'epic', gender: 'male', era: 1090,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  fujiwara_akisuke: {
    id: 'fujiwara_akisuke', name: '藤原顕輔', nameReading: 'ふじわらのあきすけ',
    title: '', rank: 'rare', gender: 'male', era: 1155,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  fujiwara_saneyori: {
    id: 'fujiwara_saneyori', name: '左京大夫顕輔', nameReading: 'さきょうのだいぶあきすけ',
    title: '大夫', rank: 'rare', gender: 'male', era: 1150,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  fujiwara_michitoshi: {
    id: 'fujiwara_michitoshi', name: '道因法師', nameReading: 'どういんほうし',
    title: '法師', rank: 'uncommon', gender: 'male', era: 1150,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: true,
  },
  dai_nii_no_sanmi: {
    id: 'dai_nii_no_sanmi', name: '大弐三位', nameReading: 'だいにのさんみ',
    title: '三位', rank: 'rare', gender: 'female', era: 1030,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  nijoin_no_sanuki: {
    id: 'nijoin_no_sanuki', name: '二条院讃岐', nameReading: 'にじょういんのさぬき',
    title: '讃岐', rank: 'uncommon', gender: 'female', era: 1190,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  fujiwara_masatsune: {
    id: 'fujiwara_masatsune', name: '藤原雅経', nameReading: 'ふじわらのまさつね',
    title: '', rank: 'rare', gender: 'male', era: 1220,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  ujishikibu: {
    id: 'ujishikibu', name: '右大将道綱母', nameReading: 'みぎのおとどみちつなのはは',
    title: '', rank: 'rare', gender: 'female', era: 980,
    isRokkkasen: false, isSanjurokkkasen: false, hasExile: false, hasTonsure: false,
  },
  chunagon_asatada: {
    id: 'chunagon_asatada', name: '中納言朝忠', nameReading: 'ちゅうなごんあさただ',
    title: '中納言', rank: 'rare', gender: 'male', era: 950,
    isRokkkasen: false, isSanjurokkkasen: true, hasExile: false, hasTonsure: false,
  },
};

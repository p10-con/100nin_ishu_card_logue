import { store } from '../../store/GameStore';

const HOWTO_HTML = `
<div class="howto-overlay" id="howto-overlay">
  <div class="howto-modal">
    <button class="howto-close" id="howto-close">✕</button>
    <h2>遊び方</h2>

    <section class="howto-section">
      <h3>🎴 デッキ構築</h3>
      <p>ゲーム開始時に3枚提示され、1枚を選ぶ。これを3回繰り返して3枚のデッキからスタート。<br>
      ステージをクリアするたびに1枚追加。最大<strong>10枚</strong>まで。<br>
      10枚満杯のときは新しい句を選ぶ際に1句と交換する。</p>
    </section>

    <section class="howto-section">
      <h3>📊 カードのステータス</h3>
      <div class="howto-stats">
        <div class="howto-stat"><span class="howto-stat-name">攻</span>句の激しさ・感情の強度。敵にダメージを与える。</div>
        <div class="howto-stat"><span class="howto-stat-name">守</span>安定した意象・様式美。防御力として機能する。</div>
        <div class="howto-stat"><span class="howto-stat-name">雅</span>修辞技法の豊かさ（枕詞・掛け言葉など）。プレイヤーの成長に影響。</div>
        <div class="howto-stat"><span class="howto-stat-name">哀</span>物の哀れ・情感の深さ。特殊効果や成長に影響。</div>
        <div class="howto-stat" style="background:var(--color-blue)">コスト — 使用に必要なエネルギー。レアリティが高いほど重い。</div>
      </div>
    </section>

    <section class="howto-section">
      <h3>⭐ レアリティ</h3>
      <div class="howto-rarity-list">
        <div><span class="rarity-dot legendary"></span><strong>レジェンダリー</strong> — 天皇・上皇</div>
        <div><span class="rarity-dot epic"></span><strong>エピック</strong> — 大臣・親王・著名歌人</div>
        <div><span class="rarity-dot rare"></span><strong>レア</strong> — 中納言・少将など中級貴族</div>
        <div><span class="rarity-dot uncommon"></span><strong>アンコモン</strong> — 下級貴族・六歌仙・法師</div>
        <div><span class="rarity-dot common"></span><strong>コモン</strong> — その他</div>
      </div>
    </section>

    <section class="howto-section">
      <h3>✦ シナジー</h3>
      <p>特定の組み合わせでデッキシナジーが発動し、ボーナスが得られる。<br>
      例：<em>月の意象を持つ句3枚以上 → 「月光の宴」発動</em></p>
    </section>

    <section class="howto-section">
      <h3>🗺️ ローグライト探索</h3>
      <p>7層のマップを突破するのが目標。</p>
      <div class="howto-nodes">
        <div>⚔️ <strong>戦い</strong> — 通常戦闘</div>
        <div>👹 <strong>強敵</strong> — 手強い相手</div>
        <div>💀 <strong>大将</strong> — ボス戦</div>
        <div>🌸 <strong>休息</strong> — HP30%回復</div>
        <div>📜 <strong>出来事</strong> — テキストイベント</div>
      </div>
    </section>

    <section class="howto-section">
      <h3>⚔️ 戦闘</h3>
      <p>手札からカードをクリックして詠唱。<br>
      カードを使うほどプレイヤー自身の<strong>優雅（雅）</strong>・<strong>哀愁（哀）</strong>が育つ。</p>
    </section>
  </div>
</div>
`;

export function renderTitleScreen(container: HTMLElement): void {
  container.innerHTML = `
    <div class="screen title-screen">
      <h1>百人一首　カード刻</h1>
      <p class="subtitle">～ Hyakunin Isshu Roguelite ～</p>
      <div class="title-btn-group">
        <button class="btn btn-large" id="btn-start">はじめる</button>
        <button class="btn" id="btn-saveload">セーブデータ</button>
        <button class="btn" id="btn-howto">遊び方</button>
      </div>
      <p style="margin-top:40px;font-size:0.75rem;color:var(--color-text-muted)">
        100首から10枚を選び、歌の力で戦え
      </p>
    </div>
    ${HOWTO_HTML}
  `;

  container.querySelector('#btn-start')!.addEventListener('click', () => {
    store.setState({ runState: null, battleLog: [], screen: 'home' });
  });

  container.querySelector('#btn-saveload')!.addEventListener('click', () => {
    store.setState({ screen: 'save_load' });
  });

  container.querySelector('#btn-howto')!.addEventListener('click', () => {
    const overlay = container.querySelector<HTMLElement>('#howto-overlay')!;
    overlay.classList.add('open');
  });

  container.querySelector('#howto-close')!.addEventListener('click', () => {
    const overlay = container.querySelector<HTMLElement>('#howto-overlay')!;
    overlay.classList.remove('open');
  });

  container.querySelector('#howto-overlay')!.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      (e.currentTarget as HTMLElement).classList.remove('open');
    }
  });
}

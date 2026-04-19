import './style.css';
import { store } from './store/GameStore';
import type { GameScreen } from './store/GameStore';
import { renderTitleScreen } from './ui/screens/TitleScreen';
import { renderHomeScreen } from './ui/screens/HomeScreen';
import { renderInitialDraftScreen } from './ui/screens/DraftScreen';
import { renderRunScreen } from './ui/screens/RunScreen';
import { renderSaveLoadScreen } from './ui/screens/SaveLoadScreen';
import { renderUpgradeScreen } from './ui/screens/UpgradeScreen';
import { loadProfile } from './core/engine/ProfileManager';

const app = document.querySelector<HTMLElement>('#app')!;

// 起動時にプロファイルをロード
store.setState({ playerProfile: loadProfile() });

let currentScreen: GameScreen | null = null;

function render(): void {
  const { screen } = store.getState();
  if (screen === currentScreen) return;
  currentScreen = screen;

  switch (screen) {
    case 'title':
      renderTitleScreen(app);
      break;
    case 'home':
      renderHomeScreen(app);
      break;
    case 'initial_draft':
      renderInitialDraftScreen(app);
      break;
    case 'run':
      renderRunScreen(app);
      break;
    case 'save_load':
      renderSaveLoadScreen(app);
      break;
    case 'upgrade':
      renderUpgradeScreen(app);
      break;
    default:
      renderTitleScreen(app);
  }
}

store.subscribe(render);
render();

// SAIP Design System – Storybook Manager (clean & lightweight)
import packageJson from '../package.json';
import storybookVersion from './version.json';

const APP_VERSION = packageJson.version;
const STORYBOOK_VERSION = storybookVersion.version;
const SAIP_VERSION = STORYBOOK_VERSION;

// Expose versions globally (inne skrypty mogą z tego korzystać)
window.SAIP_VERSION = SAIP_VERSION;
window.APP_VERSION = APP_VERSION;
window.STORYBOOK_VERSION = STORYBOOK_VERSION;
window.STORYBOOK_VERSION_DATA = storybookVersion;

console.info(`[SAIP] Storybook loaded – version ${SAIP_VERSION}`);

document.addEventListener('DOMContentLoaded', () => {
  // 1) Zmień tytuł karty
  document.title = `SAIP Design System ${SAIP_VERSION} – Storybook`;

  // 2) Dodaj dropdown w prawym górnym rogu
  const injectVersionSwitcher = () => {
    if (document.querySelector('#saip-version-switcher')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'saip-version-switcher';
    wrapper.style.cssText = `
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 10000;
      background: white;
      border: 1px solid #e3e3e3;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: system-ui, sans-serif;
    `;

    wrapper.innerHTML = `
      <span style="font-size: 14px;">📦</span>
      <select id="saip-version-select" style="
        background: transparent;
        border: none;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        cursor: pointer;
        outline: none;
        padding: 0;
      ">
        <option value="current" selected>SAIP ${SAIP_VERSION}</option>
        <option value="info">📋 Version Info</option>
        <option value="github">🔗 GitHub</option>
        <option value="docs">📚 Documentation</option>
      </select>
    `;

    const select = wrapper.querySelector('#saip-version-select');
    select?.addEventListener('change', (e) => {
      const val = e.target.value;

      switch (val) {
        case 'info':
          alert(
            `SAIP Design System ${SAIP_VERSION}\nApp Version: ${APP_VERSION}\nLast Updated: ${storybookVersion.lastUpdated}`,
          );
          break;
        case 'github':
          window.open('https://github.com/your-org/saip', '_blank');
          break;
        case 'docs':
          window.open('/docs', '_blank');
          break;
        default:
          break;
      }

      // przywraca pierwszy element
      e.target.selectedIndex = 0;
    });

    // Dodaj hover effect
    wrapper.addEventListener('mouseenter', () => {
      wrapper.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });

    wrapper.addEventListener('mouseleave', () => {
      wrapper.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    });

    document.body.appendChild(wrapper);
    console.info('[SAIP] Version switcher injected into top-right corner');
  };

  // próba kilkukrotna
  [200, 800, 2000].forEach((delay) => setTimeout(injectVersionSwitcher, delay));
});

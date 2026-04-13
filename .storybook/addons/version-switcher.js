// SAIP Design System – Version Switcher (clean)
import { addons, types } from '@storybook/manager-api';

const ADDON_ID = 'saip/version-switcher';
const TOOL_ID = `${ADDON_ID}/tool`;
const VERSION = 'v1.1.0';

function VersionSwitcher() {
  const root = document.createElement('div');
  root.style.display = 'flex';
  root.style.alignItems = 'center';
  root.innerHTML = `
    <select style="
      font-size:12px;
      padding:4px 6px;
      border:1px solid #d1d5db;
      border-radius:4px;">
      <option selected>📦 SAIP ${VERSION}</option>
      <option value="info">📋 Info</option>
    </select>
  `;

  root.querySelector('select')?.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'info') alert(`SAIP Design System ${VERSION}`);
    if (val === 'github') window.open('https://github.com/…', '_blank');
    e.target.value = ''; // reset
  });

  return root;
}

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    title: 'Version Switcher',
    type: types.TOOL,
    render: VersionSwitcher,
  });
});

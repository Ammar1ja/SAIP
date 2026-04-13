// SAIP Design System Version Manager for Storybook 9
// Centralized version management using separate Storybook version

import packageJson from '../package.json';
import storybookVersion from './version.json';

// Global version constants
const APP_VERSION = packageJson.version;
const STORYBOOK_VERSION = storybookVersion.version;
const SAIP_VERSION = STORYBOOK_VERSION; // Use Storybook version for UI

// Export versions IMMEDIATELY for manager-head.html and other scripts
(window as any).SAIP_VERSION = SAIP_VERSION;
(window as any).APP_VERSION = APP_VERSION;
(window as any).STORYBOOK_VERSION = STORYBOOK_VERSION;
(window as any).STORYBOOK_VERSION_DATA = storybookVersion; // Export full version.json data

console.log(`🎯 SAIP Design System variables exported: v${SAIP_VERSION}`);

// Enhanced sidebar version labeling with aggressive detection
const updateSidebarVersions = () => {
  const categories = ['Atoms', 'Molecules', 'Organisms', 'Sections', 'Templates'];

  console.log('🔍 Updating sidebar versions...');

  // More comprehensive selectors for Storybook 9
  const selectors = [
    // Standard selectors
    '[data-item-id*="root"]',
    '[data-nodetype="root"]',
    '.sidebar-item[data-nodetype="root"]',
    '.sidebar-item',
    // More specific SB9 selectors
    '[data-testid*="root"]',
    '[data-item-id$="--root"]',
    '[aria-expanded]',
    '.sidebar-subheading',
    // Generic text containers that might contain category names
    'button[data-item-id]',
    'div[data-item-id] span',
    'div[data-item-id] div',
    '.os-content [data-item-id]',
  ];

  let foundItems = 0;

  selectors.forEach((selector, index) => {
    const items = document.querySelectorAll(selector);
    console.log(`🎯 Selector ${index + 1}: "${selector}" found ${items.length} items`);

    items.forEach((item) => {
      const text = item.textContent || (item as HTMLElement).innerText || '';
      const itemId = item.getAttribute('data-item-id') || '';

      // Debug logging
      if (text && categories.some((cat) => text.includes(cat))) {
        console.log(`📝 Found item: "${text}" with ID: "${itemId}"`);
      }

      if (text && !text.includes(`(v${SAIP_VERSION})`)) {
        const matchedCategory = categories.find((cat) => {
          return (
            text.trim() === cat ||
            text.includes(cat) ||
            itemId.toLowerCase().includes(cat.toLowerCase())
          );
        });

        if (matchedCategory) {
          const newText = `${matchedCategory} (v${SAIP_VERSION})`;
          console.log(`✅ Updating "${text}" to "${newText}"`);
          foundItems++;

          // Try multiple update strategies
          try {
            // Strategy 1: Direct text content
            if (item.textContent === text) {
              item.textContent = newText;
            }

            // Strategy 2: Find and update text nodes
            const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT, null);

            let textNode;
            while ((textNode = walker.nextNode())) {
              if (textNode.textContent && textNode.textContent.trim() === matchedCategory) {
                textNode.textContent = newText;
              }
            }

            // Strategy 3: Update specific child elements
            const textContainers = item.querySelectorAll('span, div, button');
            textContainers.forEach((container) => {
              if (container.textContent === matchedCategory) {
                container.textContent = newText;
              }
            });
          } catch (error) {
            console.warn('⚠️ Error updating item:', error);
          }
        }
      }
    });
  });

  console.log(`🎉 Updated ${foundItems} sidebar items with version ${SAIP_VERSION}`);
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log(`🎯 SAIP Design System Storybook v${STORYBOOK_VERSION} loaded`);
  console.log(`📱 App version: v${APP_VERSION}`);
  console.log(`📚 Storybook version: v${STORYBOOK_VERSION}`);

  // Update document title
  document.title = `SAIP Design System v${SAIP_VERSION} - Storybook`;

  // Update brand title
  const updateBrandTitle = () => {
    const brandSelectors = [
      '[title="Storybook"]',
      '[title="SAIP Design System Storybook"]',
      '.sidebar-header [title*="Storybook"]',
      '.os-content [title*="Storybook"]',
    ];

    brandSelectors.forEach((selector) => {
      const brandTitle = document.querySelector(selector);
      if (brandTitle) {
        brandTitle.textContent = `SAIP Design System v${SAIP_VERSION}`;
        (brandTitle as HTMLElement).title = `SAIP Design System v${SAIP_VERSION}`;
      }
    });
  };

  updateBrandTitle();
  setTimeout(updateBrandTitle, 2000);

  // Beautiful version badge is now handled by manager-head.html
  // This prevents duplicate badges
  console.log('🎨 Version badge handled by manager-head.html with beautiful tooltip');

  // Update sidebar versions with multiple strategies
  const runVersionUpdate = () => {
    updateSidebarVersions();

    // Multiple attempts with different delays
    setTimeout(updateSidebarVersions, 500);
    setTimeout(updateSidebarVersions, 1500);
    setTimeout(updateSidebarVersions, 3000);
    setTimeout(updateSidebarVersions, 5000);
    setTimeout(updateSidebarVersions, 10000);

    // Brute force approach - try to find any element with category text
    setTimeout(() => {
      console.log('🚀 Running brute force sidebar update...');
      const categories = ['Atoms', 'Molecules', 'Organisms', 'Sections', 'Templates'];

      categories.forEach((category) => {
        // Find all elements containing exactly this category name
        const xpath = `//text()[normalize-space(.)='${category}']`;
        const result = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
          null,
        );

        for (let i = 0; i < result.snapshotLength; i++) {
          const textNode = result.snapshotItem(i);
          if (textNode && textNode.textContent === category) {
            textNode.textContent = `${category} (v${SAIP_VERSION})`;
            console.log(`🎯 Brute force updated: ${category}`);
          }
        }
      });
    }, 2000);
  };

  // Initial update
  runVersionUpdate();

  // Watch for sidebar changes with enhanced MutationObserver
  const observeSidebar = () => {
    const sidebarSelectors = [
      '.sidebar-container',
      '[data-side="left"]',
      '.os-content',
      '#storybook-explorer-tree',
    ];

    sidebarSelectors.forEach((selector) => {
      const sidebar = document.querySelector(selector);
      if (sidebar) {
        const observer = new MutationObserver((mutations) => {
          let shouldUpdate = false;

          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              shouldUpdate = true;
            }
            if (mutation.type === 'characterData') {
              shouldUpdate = true;
            }
          });

          if (shouldUpdate) {
            setTimeout(updateSidebarVersions, 100);
          }
        });

        observer.observe(sidebar, {
          childList: true,
          subtree: true,
          characterData: true,
        });

        console.log(`📡 Observing sidebar changes on: ${selector}`);
      }
    });
  };

  setTimeout(observeSidebar, 1000);

  // Periodic updates as fallback
  setInterval(updateSidebarVersions, 10000); // Every 10 seconds

  // Global debug functions for testing
  (window as any).updateSidebarVersionsNow = updateSidebarVersions;
  (window as any).inspectSidebar = () => {
    console.log('🔍 Sidebar inspection:');
    const allElements = document.querySelectorAll('*');
    const textElements = Array.from(allElements).filter((el) => {
      const text = el.textContent || '';
      return ['Atoms', 'Molecules', 'Organisms', 'Sections', 'Templates'].some(
        (cat) => text.trim() === cat,
      );
    });
    textElements.forEach((el, index) => {
      console.log(`${index + 1}. Element:`, el);
      console.log(`   Text: "${el.textContent}"`);
      console.log(`   ID: "${el.getAttribute('data-item-id') || 'none'}"`);
      console.log(`   Classes: "${el.className}"`);
      console.log(`   Tag: ${el.tagName}`);
    });
  };
});

// Versions already exported at the top of the file

// Debug function for testing
(window as any).debugSaipVersion = () => {
  console.log(`📚 Storybook version: ${STORYBOOK_VERSION}`);
  console.log(`📱 App version: ${APP_VERSION}`);
  console.log(`🎯 Display version: ${SAIP_VERSION}`);
  console.log(
    '📁 Sidebar items found:',
    document.querySelectorAll('[data-item-id*="root"]').length,
  );
  console.log('📝 Last updated:', storybookVersion.lastUpdated);
  updateSidebarVersions();
};

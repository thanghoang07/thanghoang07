export function initWorkExpTabs() {
  const tabs = document.querySelectorAll('.company-tab');
  const details = document.querySelectorAll('.company-detail');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => handleTabClick(tab, tabs, details));
  });
}

function handleTabClick(clickedTab, allTabs, allDetails) {
  // Remove active state from all tabs
  allTabs.forEach(tab => tab.classList.remove('active'));

  // Hide all details
  allDetails.forEach(detail => detail.classList.add('hidden'));

  // Activate clicked tab
  clickedTab.classList.add('active');

  // Show corresponding detail
  const detail = document.getElementById('exp-' + clickedTab.dataset.company);
  if (detail) {
    detail.classList.remove('hidden');
  }
}

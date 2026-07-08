const WORK_EXPERIENCE_COMPANIES = ['hpt', 'tk25', 'nbn', 'devup'];

export function switchWorkExperienceTab(company, doc = document) {
  WORK_EXPERIENCE_COMPANIES.forEach((id) => {
    const isActive = id === company;
    const tab = doc.getElementById('tab-' + id);
    const panel = doc.getElementById('content-' + id);

    tab?.classList.toggle('active', isActive);
    tab?.setAttribute('aria-selected', String(isActive));
    tab?.setAttribute('tabindex', isActive ? '0' : '-1');
    panel?.classList.toggle('hidden', !isActive);
    panel?.setAttribute('aria-hidden', String(!isActive));
  });
}

export function initWorkExpTabs(doc = document) {
  const tabs = doc.querySelectorAll('.ds-tab[id^="tab-"]');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => switchWorkExperienceTab(tab.id.replace('tab-', ''), doc));
  });
}

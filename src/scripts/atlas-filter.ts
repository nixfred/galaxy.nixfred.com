// Atlas progressive enhancement (FR050, AC021). The catalog rendered by
// atlas/index.astro is already complete, real HTML with zero JS required;
// this module only narrows what is visible. It is imported as a module
// script so Astro bundles it into an external file under /_astro/, keeping
// it inside the CSP's script-src 'self' with no inline-script allowance
// (docs/SECURITY_PLAN.md section 2).

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function init(): void {
  const search = document.querySelector<HTMLInputElement>('#atlas-search');
  const filterButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-sector-filter]'),
  );
  const items = Array.from(
    document.querySelectorAll<HTMLLIElement>('.atlas-item'),
  );
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>('.atlas-section'),
  );
  const countEl = document.querySelector<HTMLElement>('#atlas-count');

  if (!search && filterButtons.length === 0) return;

  const activeSectors = new Set<string>();

  function apply(): void {
    const term = search ? normalize(search.value) : '';
    let visible = 0;
    for (const item of items) {
      const sector = item.dataset.sector ?? '';
      const haystack = item.dataset.search ?? '';
      const matchesSector =
        activeSectors.size === 0 || activeSectors.has(sector);
      const matchesTerm = term === '' || haystack.includes(term);
      const show = matchesSector && matchesTerm;
      item.hidden = !show;
      if (show) visible += 1;
    }
    for (const section of sections) {
      section.hidden = !section.querySelector('.atlas-item:not([hidden])');
    }
    if (countEl) {
      countEl.textContent = `Showing ${visible} of ${items.length} projects`;
    }
  }

  search?.addEventListener('input', apply);

  for (const button of filterButtons) {
    button.addEventListener('click', () => {
      const sector = button.dataset.sectorFilter ?? '';
      if (activeSectors.has(sector)) {
        activeSectors.delete(sector);
        button.setAttribute('aria-pressed', 'false');
      } else {
        activeSectors.add(sector);
        button.setAttribute('aria-pressed', 'true');
      }
      apply();
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

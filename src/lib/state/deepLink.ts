// Deep link state for map selection (FR020, AC015, AC016).
// The selected project lives in the URL as ?p=<slug>. pushState on select,
// popstate drives selection, and a fresh load applies the URL after the
// scene reports ready (deep links restore state after scene ready).
const PARAM = 'p';

export function readSlugFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get(PARAM);
}

export function writeSlugToUrl(slug: string | null): void {
  const url = new URL(window.location.href);
  const current = url.searchParams.get(PARAM);
  if (current === slug || (!current && !slug)) return;
  if (slug) url.searchParams.set(PARAM, slug);
  else url.searchParams.delete(PARAM);
  history.pushState({ p: slug }, '', url);
}

export function onSlugPop(cb: (slug: string | null) => void): () => void {
  const handler = (): void => cb(readSlugFromUrl());
  window.addEventListener('popstate', handler);
  return () => window.removeEventListener('popstate', handler);
}

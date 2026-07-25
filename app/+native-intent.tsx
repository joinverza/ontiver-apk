const TRUSTED_HANDOFF_HOST = 'links.ontiver.com';
const HANDOFF_TOKEN = /^handoff_[A-Za-z0-9_-]{8,180}$/;

export function redirectSystemPath({ path }: { path: string; initial: boolean }): string {
  try {
    const url = new URL(path, 'ontiver://app');
    const isUniversalLink = url.protocol === 'https:' && url.hostname === TRUSTED_HANDOFF_HOST;
    const isRegisteredFallback = url.protocol === 'ontiver:';
    const isContinuePath =
      url.pathname === '/continue' ||
      (isRegisteredFallback && url.hostname === 'continue');
    if (!isContinuePath || (!isUniversalLink && !isRegisteredFallback)) {
      return path;
    }
    const handoff = url.searchParams.get('handoff') ?? '';
    if (!HANDOFF_TOKEN.test(handoff)) {
      return '/continue';
    }
    return `/continue?handoff=${encodeURIComponent(handoff)}`;
  } catch {
    return '/continue';
  }
}

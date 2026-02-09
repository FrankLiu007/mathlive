// Return true if this is a browser environment, false if this is
// a server side environment (node.js) or web worker.
export function isBrowser(): boolean {
  return 'window' in globalThis && 'document' in globalThis;
}

export function isTouchCapable(): boolean {
  if ('matchMedia' in window)
    return window.matchMedia('(pointer: coarse)').matches;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

export function canVibrate(): boolean {
  return typeof navigator.vibrate === 'function';
}

export function osPlatform():
  | 'macos'
  | 'windows'
  | 'android'
  | 'ios'
  | 'chromeos'
  | 'other' {
  if (!isBrowser()) return 'other';

  const userAgent = navigator.userAgent;
  const platform = navigator['userAgentData']?.platform ?? navigator.platform;

  // 如果 platform 存在，优先使用 platform 判断
  if (platform) {
    if (/^mac/i.test(platform)) {
      // WebKit on iPad OS 14 looks like macOS.
      // Use the number of touch points to distinguish between macOS and iPad OS
      if (navigator.maxTouchPoints === 5) return 'ios';

      return 'macos';
    }

    if (/^win/i.test(platform)) return 'windows';
  }

  // 如果 platform 不存在或无法判断，使用 userAgent
  if (!userAgent) return 'other';

  if (/android/i.test(userAgent)) return 'android';

  if (/iphone|ipod|ipad/i.test(userAgent)) return 'ios';

  if (/\bcros\b/i.test(userAgent)) return 'chromeos';

  return 'other';
}

export function supportRegexPropertyEscape(): boolean {
  if (!isBrowser()) return true;

  const userAgent = navigator.userAgent;
  if (!userAgent) return true; // 如果 userAgent 不存在，假设支持

  if (/firefox/i.test(userAgent)) {
    const m = userAgent.match(/firefox\/(\d+)/i);
    if (!m) return false;
    const version = parseInt(m[1]);
    return version >= 78; // https://www.mozilla.org/en-US/firefox/78.0/releasenotes/
  }
  if (/trident/i.test(userAgent)) return false;

  if (/edge/i.test(userAgent)) {
    const m = userAgent.match(/edg\/(\d+)/i);
    if (!m) return false;
    const version = parseInt(m[1]);
    return version >= 79;
  }

  return true;
}

export function supportPopover(): boolean {
  return HTMLElement.prototype.hasOwnProperty('popover');
}

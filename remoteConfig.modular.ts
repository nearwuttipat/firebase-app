// remoteConfig.modular.ts
import { getApp } from '@react-native-firebase/app';
import {
  getRemoteConfig,
  fetchAndActivate,
  setDefaults,
  setConfigSettings,
  getBoolean,
  getNumber,
  getString,
  onConfigUpdated,
} from '@react-native-firebase/remote-config';

export const RC_KEYS = {
  MIN_VERSION_APP: 'min_version_app',
} as const;

export async function initRemoteConfig() {
  const app = getApp();                     // ใช้ [DEFAULT] จาก native
  const rc = getRemoteConfig(app);

  try {
    console.log('[RC] setDefaults');
    await setDefaults(rc, {
      [RC_KEYS.MIN_VERSION_APP]: 1,
    });

    console.log('[RC] setConfigSettings');
  await setConfigSettings(rc, {
    minimumFetchIntervalMillis: __DEV__ ? 0 : 60 * 60 * 1000,
    fetchTimeMillis: __DEV__ ? 15000 : 30000,
  });


    console.log('[RC] fetchAndActivate: start');
    const activated = await fetchAndActivate(rc);
    console.log('[RC] fetchAndActivate: done ->', activated);
  } catch (e) {
    console.error('[RC] init error:', e);
    // ไม่ throw ต่อ เพื่อไม่ให้ UI ค้าง
  }
}

export function rcNumber(key: string, fallback = 0): number {
  const rc = getRemoteConfig(getApp());
  const n = getNumber(rc, key);
  return Number.isFinite(n) ? n : fallback;
}

export function rcBool(key: string, fallback = false): boolean {
  const rc = getRemoteConfig(getApp());
  const v = getBoolean(rc, key);
  return typeof v === 'boolean' ? v : fallback;
}

export function rcString(key: string, fallback = ''): string {
  const rc = getRemoteConfig(getApp());
  const s = getString(rc, key);
  return typeof s === 'string' && s.length ? s : fallback;
}

export function subscribeRCUpdates(handler: () => void) {
  const rc = getRemoteConfig(getApp());
  const unsub = onConfigUpdated(rc, async () => {
    console.log('[RC] onConfigUpdated -> fetchAndActivate');
    try {
      await fetchAndActivate(rc);
      handler();
    } catch (e) {
      console.error('[RC] onConfigUpdated error:', e);
    }
  });
  return unsub;
}

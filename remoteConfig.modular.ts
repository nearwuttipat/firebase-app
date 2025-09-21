// src/remoteConfig.modular.ts
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
  const app = getApp();
  const rc = getRemoteConfig(app);

  await setDefaults(rc, {
    [RC_KEYS.MIN_VERSION_APP]: 1,
  });

  // ตรงนี้ส่งเป็น object ธรรมดาได้เลย ไม่ต้องมี type จาก lib
  await setConfigSettings(rc, {
    minimumFetchIntervalMillis: __DEV__ ? 0 : 60 * 60 * 1000,
    // fetchTimeoutMillis: 30000, // จะใส่เพิ่มก็ได้
  });

  await fetchAndActivate(rc);
}

export function rcNumber(key: string, fallback = 0): number {
  const rc = getRemoteConfig(getApp());
  const n = getNumber(rc, key);
  return Number.isFinite(n) ? n : fallback;
}

export function rcBool(key: string, fallback = false): boolean {
  const rc = getRemoteConfig(getApp());
  return getBoolean(rc, key) ?? fallback;
}

export function rcString(key: string, fallback = ''): string {
  const rc = getRemoteConfig(getApp());
  const s = getString(rc, key);
  return s ?? fallback;
}

export function subscribeRCUpdates(handler: () => void) {
  const rc = getRemoteConfig(getApp());
  const unsub = onConfigUpdated(rc, async () => {
    await fetchAndActivate(rc);
    handler();
  });
  return unsub;
}

import remoteConfig from '@react-native-firebase/remote-config';

export const RC_KEYS = {
  MIN_VERSION_APP: 'min_version_app',
} as const;

export async function initRemoteConfig() {
  await remoteConfig().setDefaults({
    [RC_KEYS.MIN_VERSION_APP]: 1,
  });
  await remoteConfig().setConfigSettings({
    minimumFetchIntervalMillis: __DEV__ ? 0 : 60 * 60 * 1000,
  });
  await remoteConfig().fetchAndActivate();
}

export function getRCNumber(key: string, fallback = 0) {
  const n = remoteConfig().getValue(key).asNumber();
  return Number.isFinite(n) ? n : fallback;
}

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {
  initRemoteConfig,
  rcNumber,
  RC_KEYS,
  subscribeRCUpdates,
} from './remoteConfig.modular'; // แบบ modular 
import { versionLabel } from './versionInfo';

export default function App() {
  const [ready, setReady] = useState(false);
  const [required, setRequired] = useState(0);

  console.log('RENDER APP');

  useEffect(() => {
  let unsub: undefined | (() => void);
  let didCancel = false;

  // hard timeout กันค้าง
  const t = setTimeout(() => !didCancel && setReady(true), 8000);

  (async () => {
    await initRemoteConfig();
    const value = rcNumber(RC_KEYS.MIN_VERSION_APP, 1);
    !didCancel && setRequired(value);
    !didCancel && setReady(true);
    unsub = subscribeRCUpdates(() => {
      !didCancel && setRequired(rcNumber(RC_KEYS.MIN_VERSION_APP, 1));
    });
  })().catch(e => {
    console.error('[App] init fatal:', e);
    !didCancel && setReady(true);
  });

  return () => {
    didCancel = true;
    clearTimeout(t);
    if (unsub) unsub();
  };
}, []);


  if (!ready) {
    return (
      <View style={styles.container}><Text>Loading…</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>min_version_app = {required}</Text>
      <Text>App version: {versionLabel}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

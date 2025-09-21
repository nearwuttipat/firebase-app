import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {
  initRemoteConfig,
  rcNumber,
  RC_KEYS,
  subscribeRCUpdates,
} from './remoteConfig.modular'; // แบบ modular 

export default function App() {
  const [ready, setReady] = useState(false);
  const [required, setRequired] = useState(0);

  useEffect(() => {
    let unsub: undefined | (() => void);
    (async () => {
      await initRemoteConfig();                // init แบบ modular
      setRequired(rcNumber(RC_KEYS.MIN_VERSION_APP, 1));
      setReady(true);

      // อัปเดตอัตโนมัติเมื่อ Console publish ค่าใหม่ (optional)
      unsub = subscribeRCUpdates(() => {
        setRequired(rcNumber(RC_KEYS.MIN_VERSION_APP, 1));
      });
    })();

    return () => {
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
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

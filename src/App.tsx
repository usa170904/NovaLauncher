import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import AiManagerScreen from './screens/AiManagerScreen';
import {defaultNovaSettings, NovaSettings} from './types';

const SETTINGS_KEY = '@nova/settings';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'settings' | 'ai'>('home');
  const [settings, setSettings] = useState<NovaSettings>(defaultNovaSettings);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY)
      .then(value => value && setSettings({...defaultNovaSettings, ...JSON.parse(value)}))
      .catch(() => {});
  }, []);

  const updateSettings = (next: NovaSettings) => {
    setSettings(next);
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0914" />
      <View style={styles.container}>
        {screen === 'home' ? (
          <HomeScreen settings={settings} onOpenSettings={() => setScreen('settings')} onOpenAi={() => setScreen('ai')} />
        ) : screen === 'settings' ? (
          <SettingsScreen settings={settings} onChange={updateSettings} onBack={() => setScreen('home')} />
        ) : (
          <AiManagerScreen onBack={() => setScreen('home')} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#0B0914'},
  container: {flex: 1},
});

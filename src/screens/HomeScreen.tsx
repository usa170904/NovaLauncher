import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  NovaAi,
  NovaLauncher,
  NovaMedia,
  NovaMiui,
  NovaTelecom,
  NovaVoice,
  openWebSearch,
  voiceEvents,
} from '../native/NovaNative';
import {NovaSettings} from '../types';

type Props = {settings: NovaSettings; onOpenSettings: () => void; onOpenAi: () => void};

export default function HomeScreen({settings, onOpenSettings, onOpenAi}: Props) {
  const [query, setQuery] = useState('');
  const [listening, setListening] = useState(false);
  const [isDefault, setIsDefault] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    NovaLauncher?.isDefaultLauncher().then(setIsDefault).catch(() => setIsDefault(false));
  }, []);

  useEffect(() => {
    if (!voiceEvents) return;
    const sub = voiceEvents.addListener('novaSpeechResult', event => {
      if (event?.text) setTranscript(event.text);
    });
    return () => sub.remove();
  }, []);

  const toggleVoice = async () => {
    if (!NovaVoice) return;
    setBusy(true);
    try {
      if (listening) {
        await NovaVoice.stopRecognition();
        await NovaVoice.stopVoiceService();
        setListening(false);
      } else {
        if (!(await NovaVoice.hasMicrophonePermission())) {
          const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
          if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
            setTranscript('Microphone permission is required for live recognition.');
            return;
          }
        }
        await NovaVoice.startVoiceService(settings.bilingualRecognition ? 'bn-BD,en-US' : 'en-US');
        await NovaVoice.startRecognition(settings.bilingualRecognition ? 'bn-BD' : 'en-US');
        setListening(true);
      }
    } finally {
      setBusy(false);
    }
  };

  const submitSearch = () => {
    if (query.trim()) openWebSearch(query.trim()).catch(() => {});
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View><Text style={styles.eyebrow}>NOVA AI LAUNCHER</Text><Text style={styles.title}>Good evening</Text></View>
        <Pressable style={styles.settingsButton} onPress={onOpenSettings}><Text style={styles.settingsIcon}>⚙</Text></Pressable>
      </View>

      <View style={[styles.orb, {borderColor: settings.glowColor}]}>
        <View style={[styles.orbInner, {backgroundColor: settings.glowColor}]}>
          <Text style={styles.orbText}>{listening ? 'LISTENING' : 'NOVA'}</Text>
          {busy && <ActivityIndicator color="#FFFFFF" style={styles.spinner} />}
        </View>
      </View>
      <Pressable style={[styles.voiceButton, listening && styles.voiceButtonActive]} onPress={toggleVoice}>
        <Text style={styles.voiceButtonText}>{listening ? 'Stop live recognition' : 'Start Hey Nova service'}</Text>
      </Pressable>
      <Text style={styles.caption}>Android foreground service + SpeechRecognizer bridge</Text>
      {transcript ? <View style={styles.transcriptCard}><Text style={styles.transcriptLabel}>LIVE TRANSCRIPT</Text><Text style={styles.transcript}>{transcript}</Text></View> : null}

      <View style={styles.searchRow}>
        <TextInput value={query} onChangeText={setQuery} onSubmitEditing={submitSearch} placeholder="Ask Nova to search..." placeholderTextColor="#8E889F" style={styles.searchInput} returnKeyType="search" />
        <Pressable style={styles.searchButton} onPress={submitSearch}><Text style={styles.searchButtonText}>⌕</Text></Pressable>
      </View>

      <View style={styles.grid}>
        <ActionTile label="Launcher role" value={isDefault ? 'Active' : 'Set as home'} onPress={() => NovaLauncher?.requestDefaultLauncher()} />
        <ActionTile label="Media" value="Play / pause" onPress={() => NovaMedia?.dispatchMediaAction('play')} />
        <ActionTile label="AI lab" value={NovaAi ? 'Chat + wallpaper' : 'Native module missing'} onPress={onOpenAi} />
        <ActionTile label="MIUI battery" value="Open settings" onPress={() => NovaMiui?.openBatteryOptimizationSettings()} />
        <ActionTile label="Call screening" value="Role status" onPress={() => NovaTelecom?.isCallScreeningRoleHeld()} />
        <ActionTile label="Smart sorting" value={settings.smartSorting ? 'Enabled' : 'Disabled'} onPress={onOpenSettings} />
      </View>
    </ScrollView>
  );
}

function ActionTile({label, value, onPress}: {label: string; value: string; onPress: () => void}) {
  return <Pressable style={styles.tile} onPress={onPress}><Text style={styles.tileLabel}>{label}</Text><Text style={styles.tileValue}>{value}</Text></Pressable>;
}

const styles = StyleSheet.create({
  content: {padding: 22, paddingBottom: 48},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  eyebrow: {color: '#A99CFF', fontSize: 11, fontWeight: '700', letterSpacing: 1.8},
  title: {color: '#FFFFFF', fontSize: 30, fontWeight: '700', marginTop: 5},
  settingsButton: {width: 44, height: 44, borderRadius: 22, backgroundColor: '#1B1728', alignItems: 'center', justifyContent: 'center'},
  settingsIcon: {color: '#FFFFFF', fontSize: 22},
  orb: {alignSelf: 'center', marginTop: 42, width: 168, height: 168, borderRadius: 84, borderWidth: 2, padding: 10, shadowColor: '#8B5CF6', shadowOpacity: 0.75, shadowRadius: 28, elevation: 14},
  orbInner: {flex: 1, borderRadius: 74, alignItems: 'center', justifyContent: 'center', opacity: 0.9},
  orbText: {color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 2},
  spinner: {marginTop: 12},
  voiceButton: {alignSelf: 'center', backgroundColor: '#7C3AED', borderRadius: 24, paddingHorizontal: 22, paddingVertical: 13, marginTop: 28},
  voiceButtonActive: {backgroundColor: '#DB2777'},
  voiceButtonText: {color: '#FFFFFF', fontWeight: '700'},
  caption: {color: '#8E889F', textAlign: 'center', fontSize: 12, marginTop: 9},
  transcriptCard: {backgroundColor: '#201A32', borderRadius: 14, padding: 14, marginTop: 16, borderWidth: 1, borderColor: '#3C2E5B'},
  transcriptLabel: {color: '#A99CFF', fontSize: 10, fontWeight: '800', letterSpacing: 1.4},
  transcript: {color: '#FFFFFF', fontSize: 15, lineHeight: 21, marginTop: 6},
  searchRow: {flexDirection: 'row', backgroundColor: '#171323', borderRadius: 16, marginTop: 32, borderWidth: 1, borderColor: '#2D2740'},
  searchInput: {flex: 1, color: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 14, fontSize: 15},
  searchButton: {width: 52, alignItems: 'center', justifyContent: 'center'},
  searchButtonText: {color: '#C4B5FD', fontSize: 28},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 18},
  tile: {width: '48%', backgroundColor: '#171323', borderRadius: 16, padding: 16, minHeight: 82},
  tileLabel: {color: '#9E96B2', fontSize: 12},
  tileValue: {color: '#FFFFFF', fontWeight: '700', marginTop: 9},
});

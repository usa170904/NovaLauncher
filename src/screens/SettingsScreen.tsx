import React from 'react';
import {Pressable, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {NovaSettings} from '../types';

export default function SettingsScreen({settings, onChange, onBack}: {settings: NovaSettings; onChange: (next: NovaSettings) => void; onBack: () => void}) {
  const toggle = (key: keyof NovaSettings) => {
    if (typeof settings[key] === 'boolean') onChange({...settings, [key]: !settings[key]});
  };
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}><Pressable onPress={onBack}><Text style={styles.back}>‹</Text></Pressable><Text style={styles.title}>Master settings</Text><View style={styles.spacer} /></View>
      <Text style={styles.subtitle}>Every privileged capability remains separately controllable.</Text>
      <Section title="Nova assistant">
        <ToggleRow label="Hey Nova voice service" value={settings.voiceAssistant} onChange={() => toggle('voiceAssistant')} />
        <ToggleRow label="Bengali + English recognition" value={settings.bilingualRecognition} onChange={() => toggle('bilingualRecognition')} />
        <ToggleRow label="AI auto-reply" value={settings.aiAutoReply} onChange={() => toggle('aiAutoReply')} />
        <ToggleRow label="AI call screener" value={settings.callScreener} onChange={() => toggle('callScreener')} />
      </Section>
      <Section title="Launcher experience">
        <ToggleRow label="Samsung-style control center" value={settings.samsungStylePanel} onChange={() => toggle('samsungStylePanel')} />
        <ToggleRow label="Smart app sorting" value={settings.smartSorting} onChange={() => toggle('smartSorting')} />
        <ToggleRow label="Weather widget" value={settings.weatherWidget} onChange={() => toggle('weatherWidget')} />
        <ToggleRow label="Step counter widget" value={settings.stepsWidget} onChange={() => toggle('stepsWidget')} />
      </Section>
      <Section title="Idle timer">
        <View style={styles.timerRow}>{[null, 1, 3, 5, 10].map(minutes => <Pressable key={String(minutes)} onPress={() => onChange({...settings, idleTimerMinutes: minutes})} style={[styles.timer, settings.idleTimerMinutes === minutes && styles.timerActive]}><Text style={styles.timerText}>{minutes === null ? 'Off' : `${minutes}m`}</Text></Pressable>)}</View>
        <Text style={styles.note}>Android does not support arbitrary RAM clearing. Nova uses safe lifecycle hints and MIUI settings instead.</Text>
      </Section>
    </ScrollView>
  );
}

function Section({title, children}: {title: string; children: React.ReactNode}) { return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>; }
function ToggleRow({label, value, onChange}: {label: string; value: boolean; onChange: () => void}) { return <View style={styles.row}><Text style={styles.label}>{label}</Text><Switch value={value} onValueChange={onChange} trackColor={{false: '#393347', true: '#7C3AED'}} thumbColor="#FFFFFF" /></View>; }

const styles = StyleSheet.create({
  content: {padding: 22, paddingBottom: 48},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  back: {color: '#C4B5FD', fontSize: 40, lineHeight: 40},
  title: {color: '#FFFFFF', fontSize: 24, fontWeight: '700'},
  spacer: {width: 28},
  subtitle: {color: '#8E889F', lineHeight: 20, marginTop: 8, marginBottom: 16},
  section: {backgroundColor: '#171323', borderRadius: 18, padding: 16, marginTop: 14},
  sectionTitle: {color: '#C4B5FD', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4},
  row: {minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  label: {color: '#FFFFFF', fontSize: 15},
  timerRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12},
  timer: {borderRadius: 10, borderWidth: 1, borderColor: '#3B334F', paddingVertical: 9, paddingHorizontal: 13},
  timerActive: {backgroundColor: '#7C3AED', borderColor: '#A78BFA'},
  timerText: {color: '#FFFFFF', fontWeight: '700'},
  note: {color: '#8E889F', fontSize: 12, lineHeight: 17, marginTop: 14},
});

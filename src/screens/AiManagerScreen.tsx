import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {NovaAi} from '../native/NovaNative';

type Provider = {provider: string; configured: boolean; baseUrl: string; model: string};
const labels: Record<string, string> = {openai: 'OpenAI', gemini: 'Gemini', claude: 'Claude', deepseek: 'DeepSeek', custom: 'Custom / Ollama'};

export default function AiManagerScreen({onBack}: {onBack: () => void}) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [provider, setProvider] = useState('openai');
  const [key, setKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [model, setModel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [wallpaperPrompt, setWallpaperPrompt] = useState('');
  const [wallpaper, setWallpaper] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    NovaAi?.listProviders().then(result => {
      setProviders(result);
      const selected = result.find(item => item.provider === 'openai') ?? result[0];
      if (selected) {
        setProvider(selected.provider);
        setBaseUrl(selected.baseUrl);
        setModel(selected.model);
      }
    }).catch(error => setMessage(error?.message ?? 'AI native module unavailable'));
  }, []);

  useEffect(() => {
    const selected = providers.find(item => item.provider === provider);
    if (selected) {
      setBaseUrl(selected.baseUrl);
      setModel(selected.model);
    }
  }, [provider, providers]);

  const save = async () => {
    if (!NovaAi) return setMessage('AI native module unavailable');
    setBusy(true); setMessage('');
    try {
      await NovaAi.saveProvider(provider, key, baseUrl, model);
      setKey('');
      setProviders(await NovaAi.listProviders());
      setMessage('Provider saved with Android Keystore protection');
    } catch (error: any) {
      setMessage(error?.message ?? 'Unable to save provider');
    } finally { setBusy(false); }
  };

  const ask = async () => {
    if (!NovaAi) return setMessage('AI native module unavailable');
    setBusy(true); setMessage('');
    try { setAnswer(await NovaAi.chat(provider, prompt)); } catch (error: any) { setMessage(error?.message ?? 'AI request failed'); } finally { setBusy(false); }
  };

  const generate = async () => {
    if (!NovaAi) return setMessage('AI native module unavailable');
    setBusy(true); setMessage('');
    try {
      const result = await NovaAi.generateWallpaper(provider, wallpaperPrompt, 1024, 1024);
      setWallpaper(result.imageUrl ?? (result.imageBase64 ? `data:image/png;base64,${result.imageBase64}` : ''));
    } catch (error: any) { setMessage(error?.message ?? 'Wallpaper generation failed'); } finally { setBusy(false); }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}><Pressable onPress={onBack}><Text style={styles.back}>‹</Text></Pressable><Text style={styles.title}>Nova AI manager</Text><View style={styles.spacer} /></View>
      <Text style={styles.subtitle}>Keys are encrypted by Android Keystore and never returned after saving.</Text>
      <View style={styles.providerRow}>{Object.keys(labels).map(item => <Pressable key={item} onPress={() => setProvider(item)} style={[styles.provider, provider === item && styles.providerActive]}><Text style={styles.providerText}>{labels[item]}</Text><Text style={styles.configured}>{providers.find(info => info.provider === item)?.configured ? 'Configured' : 'Not set'}</Text></Pressable>)}</View>

      <Section title="Provider connection">
        <TextInput value={key} onChangeText={setKey} placeholder="API key (never logged)" placeholderTextColor="#8E889F" secureTextEntry style={styles.input} autoCapitalize="none" />
        <TextInput value={baseUrl} onChangeText={setBaseUrl} placeholder="Base URL" placeholderTextColor="#8E889F" style={styles.input} autoCapitalize="none" />
        <TextInput value={model} onChangeText={setModel} placeholder="Model" placeholderTextColor="#8E889F" style={styles.input} autoCapitalize="none" />
        <Button label="Save provider securely" onPress={save} disabled={busy} />
      </Section>
      <Section title="Chat with Nova">
        <TextInput value={prompt} onChangeText={setPrompt} placeholder="Ask the configured provider..." placeholderTextColor="#8E889F" style={[styles.input, styles.multiline]} multiline />
        <Button label="Send prompt" onPress={ask} disabled={busy} />
        {answer ? <Text style={styles.answer}>{answer}</Text> : null}
      </Section>
      <Section title="AI wallpaper">
        <TextInput value={wallpaperPrompt} onChangeText={setWallpaperPrompt} placeholder="Bengali riverside at dusk, cinematic..." placeholderTextColor="#8E889F" style={[styles.input, styles.multiline]} multiline />
        <Button label="Generate 1024 × 1024" onPress={generate} disabled={busy} />
        {wallpaper ? <Image source={{uri: wallpaper}} style={styles.preview} /> : null}
        {wallpaper.startsWith('http') ? <Button label="Apply as device wallpaper" onPress={() => NovaAi?.applyWallpaper(wallpaper)} disabled={busy} /> : null}
      </Section>
      {busy ? <ActivityIndicator color="#A78BFA" style={styles.loader} /> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </ScrollView>
  );
}

function Section({title, children}: {title: string; children: React.ReactNode}) { return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>; }
function Button({label, onPress, disabled}: {label: string; onPress: () => void; disabled?: boolean}) { return <Pressable onPress={onPress} disabled={disabled} style={[styles.button, disabled && styles.disabled]}><Text style={styles.buttonText}>{label}</Text></Pressable>; }

const styles = StyleSheet.create({
  content: {padding: 22, paddingBottom: 48},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  back: {color: '#C4B5FD', fontSize: 40, lineHeight: 40},
  title: {color: '#FFFFFF', fontSize: 24, fontWeight: '700'},
  spacer: {width: 28},
  subtitle: {color: '#8E889F', lineHeight: 20, marginTop: 8, marginBottom: 16},
  providerRow: {gap: 8},
  provider: {backgroundColor: '#171323', borderRadius: 12, padding: 13, borderWidth: 1, borderColor: '#2D2740'},
  providerActive: {borderColor: '#8B5CF6', backgroundColor: '#21193A'},
  providerText: {color: '#FFFFFF', fontWeight: '700'},
  configured: {color: '#8E889F', fontSize: 11, marginTop: 3},
  section: {backgroundColor: '#171323', borderRadius: 18, padding: 16, marginTop: 14},
  sectionTitle: {color: '#C4B5FD', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12},
  input: {backgroundColor: '#0F0C18', borderRadius: 11, color: '#FFFFFF', paddingHorizontal: 13, paddingVertical: 12, marginBottom: 10, borderWidth: 1, borderColor: '#2D2740'},
  multiline: {minHeight: 82, textAlignVertical: 'top'},
  button: {backgroundColor: '#7C3AED', borderRadius: 11, padding: 13, alignItems: 'center', marginTop: 2},
  disabled: {opacity: 0.55},
  buttonText: {color: '#FFFFFF', fontWeight: '800'},
  answer: {color: '#EDE9FE', lineHeight: 21, marginTop: 14},
  preview: {width: '100%', aspectRatio: 1, borderRadius: 14, marginTop: 14, backgroundColor: '#0F0C18'},
  loader: {marginTop: 18},
  message: {color: '#A7F3D0', textAlign: 'center', marginTop: 16},
});

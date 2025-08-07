import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

let isInitialized = false;
let audioEnabled = true;

let clickSound: Audio.Sound | null = null;
let passedSound: Audio.Sound | null = null;
let isLoading = false;

async function ensureInitialized() {
  if (isInitialized || isLoading) return;
  isLoading = true;
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      playThroughEarpieceAndroid: false,
    });
    const click = await Audio.Sound.createAsync(
      require('../../assets/click.wav'),
      { shouldPlay: false, volume: 0.5 }
    );
    clickSound = click.sound;
    const passed = await Audio.Sound.createAsync(
      require('../../assets/passed.wav'),
      { shouldPlay: false, volume: 0.7 }
    );
    passedSound = passed.sound;
    isInitialized = true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Audio init error:', e);
  } finally {
    isLoading = false;
  }
}

export async function setAudioEnabled(enabled: boolean) {
  audioEnabled = enabled;
  if (enabled) {
    await ensureInitialized();
  }
}

export async function playClick() {
  if (!audioEnabled) return;
  await ensureInitialized();
  if (!clickSound) return;
  try {
    await clickSound.replayAsync();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('playClick error:', e);
  }
}

export async function playPassed() {
  if (!audioEnabled) return;
  await ensureInitialized();
  if (!passedSound) return;
  try {
    await passedSound.replayAsync();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('playPassed error:', e);
  }
}

export async function setVolumes(opts: { click?: number; passed?: number }) {
  await ensureInitialized();
  if (clickSound && typeof opts.click === 'number') {
    try { await clickSound.setVolumeAsync(opts.click); } catch {}
  }
  if (passedSound && typeof opts.passed === 'number') {
    try { await passedSound.setVolumeAsync(opts.passed); } catch {}
  }
}

export async function unloadAll() {
  // Keep sounds resident for instant replay; no-op to avoid unload races
}


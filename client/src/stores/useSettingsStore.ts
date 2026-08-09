import { create } from 'zustand';
import { soundManager } from '../utils/sound';

interface SettingsState {
  sound: boolean;
  music: boolean;
  animations: boolean;
  vibrations: boolean;
  showHints: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleAnimations: () => void;
  toggleVibrations: () => void;
  toggleHints: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  sound: localStorage.getItem('setting_sound') !== 'false',
  music: localStorage.getItem('setting_music') === 'true',
  animations: localStorage.getItem('setting_animations') !== 'false',
  vibrations: localStorage.getItem('setting_vibrations') !== 'false',
  showHints: localStorage.getItem('setting_hints') !== 'false',

  toggleSound: () => {
    const next = !get().sound;
    localStorage.setItem('setting_sound', String(next));
    soundManager.enabled = next;
    set({ sound: next });
  },

  toggleMusic: () => {
    const next = !get().music;
    localStorage.setItem('setting_music', String(next));
    set({ music: next });
  },

  toggleAnimations: () => {
    const next = !get().animations;
    localStorage.setItem('setting_animations', String(next));
    set({ animations: next });
  },

  toggleVibrations: () => {
    const next = !get().vibrations;
    localStorage.setItem('setting_vibrations', String(next));
    set({ vibrations: next });
  },

  toggleHints: () => {
    const next = !get().showHints;
    localStorage.setItem('setting_hints', String(next));
    set({ showHints: next });
  },
}));

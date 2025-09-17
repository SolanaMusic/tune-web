import { create } from "zustand";
import { useUserStore } from "./UserStore";
import axios from "axios";

type Artist = {
  id: number;
  name: string;
};

type Track = {
  id: number;
  title: string;
  artists: Artist[];
  cover: string;
  duration: number;
};

interface PlayerState {
  audio: HTMLAudioElement | null;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isRepeat: boolean;
  playTrack: (track: Track) => void;
  playOrToggle: (track: Track) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
}

const STORAGE_KEY = "player";

export const usePlayerStore = create<PlayerState>((set, get) => {
  const saved =
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  const initialState = saved ? JSON.parse(saved) : {};
  const audio = typeof window !== "undefined" ? new Audio() : null;

  let hasSentPlayEvent = false;
  let lastTrackId: number | null = null;
  let sessionPlayTime = 0;
  let lastTime = 0;

  const sendRecentlyPlayed = async (trackId: number) => {
    const { user } = useUserStore.getState();
    if (!user) return;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}tracks/recently-played`,
        { userId: user.id, trackId }
      );
    } catch (err) {
      console.error("Failed to send recently played", err);
    }
  };

  if (audio && initialState.currentTrack) {
    audio.src = `${process.env.NEXT_PUBLIC_API_BASE_URL}tracks/stream/${initialState.currentTrack.id}`;
    audio.currentTime = initialState.currentTime || 0;
    audio.volume = (initialState.volume ?? 100) / 100;
    audio.muted = initialState.isMuted || false;
    audio.pause();
  }

  if (audio) {
    audio.ontimeupdate = () => {
      const { currentTrack } = get();
      const currentTime = audio.currentTime;
      set({ currentTime });

      if (currentTrack) {
        if (lastTrackId !== currentTrack.id) {
          lastTrackId = currentTrack.id;
          hasSentPlayEvent = false;
          sessionPlayTime = 0;
          lastTime = currentTime;
        }

        sessionPlayTime += currentTime - lastTime;
        lastTime = currentTime;

        if (!hasSentPlayEvent && sessionPlayTime >= 10) {
          hasSentPlayEvent = true;
          sendRecentlyPlayed(currentTrack.id);
        }
      }

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...stored, currentTime })
      );
    };

    audio.onended = () => {
      const { isRepeat, audio } = get();
      if (isRepeat && audio) {
        audio.currentTime = 0;
        audio.play();
        set({ isPlaying: true });
      } else {
        set({ isPlaying: false });
      }

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...stored, isPlaying: get().isPlaying })
      );
    };
  }

  return {
    audio,
    currentTrack: initialState.currentTrack || null,
    isPlaying: false,
    currentTime: initialState.currentTime || 0,
    duration: initialState.duration || 0,
    volume: initialState.volume ?? 100,
    isMuted: initialState.isMuted || false,
    isRepeat: initialState.isRepeat || false,

    playTrack: (track) => {
      const { audio } = get();
      if (!audio) return;

      audio.src = `${process.env.NEXT_PUBLIC_API_BASE_URL}tracks/stream/${track.id}`;
      audio.currentTime = 0;
      audio.play();

      lastTrackId = track.id;
      hasSentPlayEvent = false;
      sessionPlayTime = 0;
      lastTime = 0;

      const newState = {
        currentTrack: track,
        isPlaying: true,
        currentTime: 0,
        duration: track.duration,
      };
      set(newState);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...newState,
          isRepeat: get().isRepeat,
          volume: get().volume,
          isMuted: get().isMuted,
        })
      );
    },

    playOrToggle: (track) => {
      const { currentTrack, isPlaying, playTrack, togglePlay } = get();
      if (currentTrack?.id === track.id) {
        togglePlay();
      } else {
        playTrack(track);
      }
    },

    togglePlay: () => {
      const { audio, isPlaying } = get();
      if (!audio) return;
      if (isPlaying) audio.pause();
      else audio.play();

      const newState = { isPlaying: !isPlaying };
      set(newState);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...stored, ...newState })
      );
    },

    setCurrentTime: (time) => {
      const { audio } = get();
      if (audio) audio.currentTime = time;
      set({ currentTime: time });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...stored, currentTime: time })
      );
    },

    setDuration: (duration) => {
      set({ duration });
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...stored, duration })
      );
    },

    setVolume: (volume) => {
      const { audio } = get();
      if (audio) {
        audio.volume = volume / 100;
        if (volume > 0) audio.muted = false;
      }
      const isMuted = volume === 0;
      const newState = { volume, isMuted };
      set(newState);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...stored, ...newState })
      );
    },

    toggleMute: () => {
      const { audio, isMuted } = get();
      if (audio) audio.muted = !isMuted;
      const newState = { isMuted: !isMuted };
      set(newState);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...stored, ...newState })
      );
    },

    toggleRepeat: () => {
      const { isRepeat } = get();
      const newState = { isRepeat: !isRepeat };
      set(newState);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...stored, ...newState })
      );
    },
  };
});

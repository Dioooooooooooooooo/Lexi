import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReadingSession } from '@/models/ReadingSession';
import { Message } from '@/types/message';

interface ReadingSessionStore {
  currentSession: ReadingSession | null;
  currentMessages: Message[] | null;
  sessions: Record<string, ReadingSession>; // key: sessionId
  messages: Record<string, Message[]>; // key: sessionId

  addMessage: (message: Message) => void;
  removeMessage: (messageId: number) => void;
  replaceLastMessage: (message: Message) => void;
  getCurrentMessages: () => Message[];

  setCurrentSession: (session: ReadingSession | null) => void;
  addSession: (session: ReadingSession) => void;
  getPastSession: (readingMaterialId: string) => ReadingSession | null;
  getSessionByReadingId: (readingMaterialId: string) => ReadingSession | null;

  updateReadingSessionProgress: (
    readingSessionId: string,
    percentage: number,
  ) => void;

  currentlyReading: ReadingSession[];
  setCurrentlyReading: (currentlyReading: ReadingSession[]) => void;
}

export const useReadingSessionStore = create<ReadingSessionStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessions: {},
      messages: {},

      get currentMessages() {
        const current = get().currentSession;

        console.log('currentsession', current);
        if (!current) return [];
        return get().messages[current.id] ?? [];
      },

      addMessage: message =>
        set(state => {
          const sessionId = get().currentSession?.id;

          console.log('addmsg current session', sessionId);
          if (!sessionId) return state;

          const newMessages = [...(state.messages[sessionId] ?? []), message];

          return {
            messages: {
              ...state.messages,
              [sessionId]: newMessages,
            },
            currentMessages: newMessages, // <-- keep in sync
          };
        }),

      removeMessage: messageId =>
        set(state => {
          const sessionId = get().currentSession?.id;
          if (!sessionId) return state;

          const newMessages = (state.messages[sessionId] ?? []).filter(
            msg => msg.id !== messageId,
          );

          return {
            messages: {
              ...state.messages,
              [sessionId]: newMessages,
            },
            currentMessages: newMessages,
          };
        }),

      replaceLastMessage: message =>
        set(state => {
          const sessionId = get().currentSession?.id;
          if (!sessionId) return state;

          const prev = state.messages[sessionId] ?? [];
          const newMessages = [...prev.slice(0, -1), message];
          return {
            messages: {
              ...state.messages,
              [sessionId]: [...prev.slice(0, -1), message],
            },
            currentMessages: newMessages,
          };
        }),

      getCurrentMessages: () => {
        const current = get().currentSession;
        if (!current) return [];
        return get().messages[current.id] ?? [];
      },

      // Sessions
      setCurrentSession: session =>
        set(state => {
          const currentMessages = session
            ? (state.messages[session.id] ?? [])
            : [];
          return { currentSession: session, currentMessages };
        }),

      addSession: session =>
        set(state => ({
          sessions: {
            ...state.sessions,
            [session.id]: session,
          },
        })),

      getPastSession: readingMaterialId => {
        const sessions = Object.values(get().sessions);
        return (
          sessions.find(
            s =>
              s.reading_material_id === readingMaterialId &&
              s.completion_percentage < 100,
          ) ?? null
        );
      },

      getSessionByReadingId: readingMaterialId => {
        const sessions = Object.values(get().sessions);
        return (
          sessions.find(s => s.reading_material_id === readingMaterialId) ??
          null
        );
      },

      updateReadingSessionProgress: (readingSessionId, percentage) =>
        set(state => ({
          sessions: {
            ...state.sessions,
            [readingSessionId]: {
              ...state.sessions[readingSessionId],
              completion_percentage: percentage,
            },
          },
        })),

      currentlyReading: [],
      setCurrentlyReading: currentlyReading => set({ currentlyReading }),
    }),
    {
      name: 'reading-session-store',
      storage: {
        getItem: async name => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async name => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);

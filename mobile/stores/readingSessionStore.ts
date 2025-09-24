import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReadingSession } from '@/models/ReadingSession';
import { Message } from '@/types/message';
import { User } from '@/models/User';

interface ReadingSessionStore {
  currentSession: ReadingSession | null;
  currentMessages: Message[] | null;
  currentSessionKey: string | null;

  sessions: Record<string, ReadingSession>;

  // key: sessionId or teacherId-readingMatId
  messages: Record<string, Message[]>;

  setCurrentSessionKey: (userId: string, readingMatId: string) => void;
  addMessage: (message: Message, user: User, readingMatId: string) => void;
  removeMessage: (messageId: number) => void;
  replaceLastMessage: (message: Message) => void;

  setCurrentSession: (session: ReadingSession | null) => void;
  addSession: (session: ReadingSession) => void;
  getPastSession: (readingMaterialId: string) => ReadingSession | null;
  getSessionByReadingId: (readingMaterialId: string) => ReadingSession | null;
  clearSession: () => void;

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
      currentSessionKey: null,
      sessions: {},
      messages: {},

      get currentMessages() {
        console.log('messages get current how');
        const current = get().currentSession;
        const sessionKey = get().currentSessionKey;

        if (!current) {
          return get().messages[sessionKey] ?? [];
        }

        return get().messages[current.id] ?? [];
      },

      addMessage: (message, user, readingMatId) =>
        set(state => {
          let sessionId = null;
          console.log('sesison key sdhkjfhsk', get().currentSessionKey);
          if (user.role === 'Teacher') {
            sessionId = `${user.id}-${readingMatId}`;
          } else {
            sessionId = get().currentSession?.id;
          }

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

          return {
            messages: {
              ...state.messages,
              [sessionId]: (state.messages[sessionId] ?? []).filter(
                msg => msg.id !== messageId,
              ),
            },
          };
        }),

      replaceLastMessage: message =>
        set(state => {
          const sessionId = get().currentSession?.id;
          if (!sessionId) return state;

          const prev = state.messages[sessionId] ?? [];
          return {
            messages: {
              ...state.messages,
              [sessionId]: [...prev.slice(0, -1), message],
            },
          };
        }),

      setCurrentSessionKey: (userId, readingMatId) =>
        set({
          currentSessionKey: `${userId}-${readingMatId}`,
        }),

      // Sessions
      setCurrentSession: session =>
        set(state => {
          const sessionKey = get().currentSessionKey;

          console.log('is this where the stories are initalized', sessionKey);

          // console.log('session', session.id, 'session stories', state.messages);

          if (!session) {
            console.log('pero mo lampos sya diri');
            const currentMessages = state.messages[sessionKey] ?? [];
            return { currentSession: null, currentMessages };
          }

          // const currentMessages = session
          //   ? (state.messages[session.id] ?? [])
          //   : [];
          const currentMessages = state.messages[session.id] ?? [];

          console.log('taysa brjshdkjas', currentMessages);
          return { currentSession: session, currentMessages };
        }),

      addSession: session =>
        set(state => ({
          sessions: {
            ...state.sessions,
            [session.id]: session,
          },
        })),

      clearSession: () =>
        set({
          currentSession: null,
          currentMessages: null,
          sessions: {}, // key: sessionId
          messages: {},
        }),

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

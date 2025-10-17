import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type User = {
  id: string;
  email: string;
  name: string;
};

export type SpeechMetrics = {
  clarity: number; // 0-100
  paceWpm: number;
  volume: number; // 0-100
  fillerWords: number;
  confidence: number; // 0-100
};

export type BodyMetrics = {
  posture: number; // 0-100
  headStability: number; // 0-100 (higher is more stable)
  gestureActivity: number; // 0-100 (higher is more movement)
  engagement: number; // 0-100
};

export type QuestionFeedback = {
  question: string;
  transcript: string;
  score: number; // 0-100
  feedback: string;
};

export type InterviewResult = {
  id: string;
  startedAt: number;
  endedAt: number;
  durationSec: number;
  domain?: string;
  type?: string;
  questions?: QuestionFeedback[];
  transcript?: string;
  speech: SpeechMetrics;
  body: BodyMetrics;
  overallScore: number; // 0-100
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  sessions: InterviewResult[];
  addSession: (res: InterviewResult) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "iapro_auth_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<InterviewResult[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.user) setUser(parsed.user);
        if (Array.isArray(parsed.sessions)) setSessions(parsed.sessions);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, sessions }));
  }, [user, sessions]);

  const login = useCallback(async (email: string, _password: string) => {
    // Mock login; integrate with backend later
    setUser({
      id: crypto.randomUUID(),
      email,
      name: email.split("@")[0] || "User",
    });
  }, []);

  const register = useCallback(
    async (name: string, email: string, _password: string) => {
      // Mock register; integrate with backend later
      setUser({ id: crypto.randomUUID(), email, name });
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addSession = useCallback((res: InterviewResult) => {
    setSessions((prev) => [res, ...prev]);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      sessions,
      addSession,
    }),
    [user, login, register, logout, sessions, addSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

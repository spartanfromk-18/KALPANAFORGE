import { createClient, type Session, type User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
    id: string;
    email: string;
    username: string;
    avatar?: string;
    createdAt: number;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) console.error('[auth] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required');

export const supabase = createClient(supabaseUrl || 'https://invalid.supabase.co', supabaseAnonKey || 'missing-anon-key');
let currentUser: User | null = null;

const clearLegacySession = () => {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem('kf_s_v4_p');
    localStorage.removeItem('kf_u_v4_d');
};

const mapUser = (user: SupabaseUser | null): User | null => {
    if (!user?.email) return null;
    return {
        id: user.id,
        email: user.email,
        username: String(user.user_metadata?.username || user.email.split('@')[0]),
        avatar: user.user_metadata?.avatar,
        createdAt: new Date(user.created_at).getTime(),
    };
};

const applySession = (session: Session | null) => { currentUser = mapUser(session?.user || null); };

clearLegacySession();
void supabase.auth.getSession().then(({ data }) => applySession(data.session));
supabase.auth.onAuthStateChange((_event, session) => applySession(session));

export const authService = {
    signUp: async (email: string, password: string, username: string): Promise<User> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}` } },
        });
        if (error) throw new Error(error.message);
        const user = mapUser(data.user);
        if (!user) throw new Error('Unable to create account');
        currentUser = user;
        return user;
    },

    signIn: async (email: string, password: string): Promise<User> => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        const user = mapUser(data.user);
        if (!user) throw new Error('Unable to sign in');
        currentUser = user;
        return user;
    },

    signOut: async (): Promise<void> => {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
        currentUser = null;
    },

    getCurrentUser: (): User | null => currentUser,

    getAccessToken: async (): Promise<string | null> => {
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token || null;
    },

    onChange: (callback: (user: User | null) => void) => {
        const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(mapUser(session?.user || null)));
        return () => data.subscription.unsubscribe();
    },

    isSecurelyAuthenticated: (): boolean => currentUser !== null,
};
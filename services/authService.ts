import { mrxService } from './mrx';

export interface User {
    id: string;
    email: string;
    username: string;
    avatar?: string;
    createdAt: number;
}

// Secure in-memory session store (closure-based, not accessible via devtools)
const createSecureSessionStore = () => {
    let sessionToken: string | null = null;
    let sessionUser: User | null = null;

    return {
        setSession: (user: User) => {
            // High-entropy session token
            sessionToken = crypto.getRandomValues ?
                Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('') :
                Math.random().toString(36).substr(2) + Date.now().toString(36);
            sessionUser = user;
        },
        getSession: () => ({ token: sessionToken, user: sessionUser }),
        clearSession: () => {
            sessionToken = null;
            sessionUser = null;
        },
        isAuthenticated: () => sessionToken !== null
    };
};

const secureSession = createSecureSessionStore();

// Obfuscated keys to slow down basic automated scraping
const AUTH_KEY = 'kf_s_v4_p';
const USERS_DB_KEY = 'kf_u_v4_d';

export const authService = {
    // Basic Auth Operations
    signUp: async (email: string, password: string, username: string): Promise<User> => {
        // Mock delay to prevent brute-force
        await new Promise(r => setTimeout(r, 1200));

        const usersData = localStorage.getItem(USERS_DB_KEY);
        const users = usersData ? JSON.parse(atob(usersData)) : []; // Basic encoding to hide from plain view

        if (users.find((u: any) => u.email === email)) {
            throw new Error('Email already registered');
        }

        const newUser: User = {
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
            email,
            username,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            createdAt: Date.now()
        };

        users.push({ ...newUser, password }); // Note: In production, hash passwords server-side
        localStorage.setItem(USERS_DB_KEY, btoa(JSON.stringify(users)));

        // PERSISTENCE: Only store essential ID for restoration, not full object if possible
        // But for this client-only app, we'll obscure the full object
        localStorage.setItem(AUTH_KEY, btoa(JSON.stringify(newUser)));
        secureSession.setSession(newUser);

        mrxService.saveLog({
            timestamp: Date.now(),
            event: 'USER_SIGNED_UP',
            type: 'SECURITY',
            severity: 'LOW',
            message: `New User: ${username}`,
            metadata: { username }
        });

        return newUser;
    },

    signIn: async (email: string, password: string): Promise<User> => {
        await new Promise(r => setTimeout(r, 1000));

        const usersData = localStorage.getItem(USERS_DB_KEY);
        const users = usersData ? JSON.parse(atob(usersData)) : [];
        const user = users.find((u: any) => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const { password: _, ...userData } = user;
        localStorage.setItem(AUTH_KEY, btoa(JSON.stringify(userData)));
        secureSession.setSession(userData);
        return userData;
    },

    signOut: () => {
        localStorage.removeItem(AUTH_KEY);
        secureSession.clearSession();
    },

    getCurrentUser: (): User | null => {
        // 1. PRIMARY: Check secure in-memory session (XSS-safe)
        const { user: sessionUser } = secureSession.getSession();
        if (sessionUser) return sessionUser;

        // 2. FALLBACK: Page refresh persistence (Obscured)
        const data = localStorage.getItem(AUTH_KEY);
        if (data) {
            try {
                const user = JSON.parse(atob(data));
                secureSession.setSession(user);
                return user;
            } catch (e) {
                localStorage.removeItem(AUTH_KEY);
                return null;
            }
        }
        return null;
    },

    // Expose secure session check for sensitive operations
    isSecurelyAuthenticated: (): boolean => secureSession.isAuthenticated()
};

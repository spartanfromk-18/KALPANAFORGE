export interface AuthenticatedUser {
    id: string;
    email?: string;
}

const bearerPattern = /^Bearer ([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)$/;

export const validateBearerToken = async (request: Request): Promise<AuthenticatedUser | null> => {
    const authorization = request.headers.get('authorization') || '';
    const match = authorization.match(bearerPattern);
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
    if (!match || !supabaseUrl || !anonKey) return null;

    try {
        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: { apikey: anonKey, Authorization: `Bearer ${match[1]}` },
        });
        if (!response.ok) return null;
        const user = await response.json() as { id?: unknown; email?: unknown };
        return typeof user.id === 'string' ? { id: user.id, email: typeof user.email === 'string' ? user.email : undefined } : null;
    } catch (error) {
        console.error('[auth] Supabase token validation failed', error);
        return null;
    }
};
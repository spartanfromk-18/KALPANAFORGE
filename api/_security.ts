const configuredOrigins = () => (process.env.ALLOWED_ORIGIN || '')
    .split(',').map((origin) => origin.trim()).filter(Boolean);

export const corsHeaders = (request: Request): HeadersInit => {
    const origin = request.headers.get('origin');
    const headers: Record<string, string> = {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Content-Type': 'application/json',
        'Vary': 'Origin',
    };
    if (origin && configuredOrigins().includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
    return headers;
};

export const originAllowed = (request: Request): boolean => {
    const origin = request.headers.get('origin');
    const allowed = configuredOrigins();
    return allowed.length > 0 && (!origin || allowed.includes(origin));
};

export const readJsonBody = async <T>(request: Request, maxBytes: number): Promise<T> => {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > maxBytes) throw new Error('PAYLOAD_TOO_LARGE');
    const text = await request.text();
    if (new TextEncoder().encode(text).length > maxBytes) throw new Error('PAYLOAD_TOO_LARGE');
    return JSON.parse(text) as T;
};

export const jsonError = (status: number, message: string, headers: HeadersInit) =>
    new Response(JSON.stringify({ error: message }), { status, headers });
import assert from 'node:assert/strict';
import caption from '../../../api/caption';
import enhance from '../../../api/enhance';

process.env.ALLOWED_ORIGIN = 'https://app.example.test';
process.env.VITE_SUPABASE_URL = 'https://project.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';

const validToken = 'eyJhbGciOiJub25lIn0.eyJzdWIiOiJ0ZXN0In0.signature';
const headers = (origin = 'https://app.example.test', token?: string) => ({
    Origin: origin,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const originalFetch = globalThis.fetch;
globalThis.fetch = async () => new Response(JSON.stringify({ id: 'user-1', email: 'test@example.test' }), { status: 200 });

const request = (url: string, init: RequestInit = {}) => new Request(`https://app.example.test${url}`, init);
const assertStatus = async (handler: (request: Request) => Promise<Response>, req: Request, expected: number) => {
    const response = await handler(req);
    assert.equal(response.status, expected);
};

for (const [path, handler] of [['/api/caption', caption], ['/api/enhance', enhance]] as const) {
    await assertStatus(handler, request(path, { method: 'POST', headers: headers(), body: '{}' }), 401);
    await assertStatus(handler, request(path, { method: 'POST', headers: headers('https://app.example.test', 'bad-token'), body: '{}' }), 401);
    await assertStatus(handler, request(path, { method: 'POST', headers: headers('https://evil.example.test', validToken), body: '{}' }), 403);
    await assertStatus(handler, request(path, { method: 'GET', headers: headers() }), 405);
    await assertStatus(handler, request(path, { method: 'POST', headers: headers('https://app.example.test', validToken), body: '{' }), 500);

    const oversized = path.endsWith('caption')
        ? JSON.stringify({ imageContext: 'x'.repeat(33 * 1024) })
        : JSON.stringify({ base64Image: 'x'.repeat(10 * 1024 * 1024 + 1024), type: 'CRISP' });
    await assertStatus(handler, request(path, { method: 'POST', headers: headers('https://app.example.test', validToken), body: oversized }), 413);
}

globalThis.fetch = originalFetch;
console.log('API smoke tests passed');
import assert from 'node:assert/strict';
import caption from '../../../api/caption';
import enhance from '../../../api/enhance';

process.env.ALLOWED_ORIGIN = 'https://app.example.test';
process.env.VITE_SUPABASE_URL = 'https://project.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.KV_REST_API_URL = 'https://kv.example.test';
process.env.KV_REST_API_TOKEN = 'test-kv-token';

const validToken = 'eyJhbGciOiJub25lIn0.eyJzdWIiOiJ0ZXN0In0.signature';
const headers = (origin = 'https://app.example.test', token?: string) => ({
    Origin: origin,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const originalFetch = globalThis.fetch;
let kvThrows = false;
let geminiCalls = 0;
globalThis.fetch = async (input) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url.includes('project.supabase.co')) {
        return new Response(JSON.stringify({ id: 'user-1', email: 'test@example.test' }), { status: 200 });
    }
    if (url.includes('kv.example.test')) {
        if (kvThrows) throw new Error('KV unavailable');
        return new Response(JSON.stringify([{ result: [1, 60] }]), { status: 200 });
    }
    if (url.includes('generativelanguage.googleapis.com')) geminiCalls++;
    return new Response('{}', { status: 200 });
};

const request = (url: string, init: RequestInit = {}) => new Request(`https://app.example.test${url}`, init);
const assertStatus = async (handler: (request: Request) => Promise<Response>, req: Request, expected: number) => {
    const response = await handler(req);
    assert.equal(response.status, expected);
};

for (const [path, handler] of [['/api/caption', caption], ['/api/enhance', enhance]] as const) {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    await assertStatus(handler, request(path, {
        method: 'POST',
        headers: headers('https://app.example.test', validToken),
        body: JSON.stringify({ imageContext: 'test' }),
    }), 503);
    assert.equal(geminiCalls, 0);

    process.env.KV_REST_API_URL = 'https://kv.example.test';
    process.env.KV_REST_API_TOKEN = 'test-kv-token';
    kvThrows = true;
    await assertStatus(handler, request(path, {
        method: 'POST',
        headers: headers('https://app.example.test', validToken),
        body: JSON.stringify({ imageContext: 'test' }),
    }), 503);
    assert.equal(geminiCalls, 0);
    kvThrows = false;
}

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
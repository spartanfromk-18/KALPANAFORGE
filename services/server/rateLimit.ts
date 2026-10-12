import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

export const limitUser = async (userId: string): Promise<boolean> => {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
        console.error('[rate-limit] KV credentials missing; user limiter unavailable');
        return true;
    }
    try {
        const limiter = new Ratelimit({ redis: kv, limiter: Ratelimit.slidingWindow(60, '60 s'), prefix: '@kalpana-forge/user' });
        return (await limiter.limit(userId)).success;
    } catch (error) {
        console.error('[rate-limit] user limiter failed; request allowed', error);
        return true;
    }
};
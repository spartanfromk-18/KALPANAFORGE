import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

export type UserLimitResult = 'allowed' | 'limited' | 'unavailable';

export const limitUser = async (userId: string): Promise<UserLimitResult> => {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
        console.error('[rate-limit] KV credentials missing; user limiter unavailable');
        return 'unavailable';
    }
    try {
        const limiter = new Ratelimit({ redis: kv, limiter: Ratelimit.slidingWindow(60, '60 s'), prefix: '@kalpana-forge/user' });
        return (await limiter.limit(userId)).success ? 'allowed' : 'limited';
    } catch (error) {
        console.error('[rate-limit] user limiter failed; request rejected', error);
        return 'unavailable';
    }
};
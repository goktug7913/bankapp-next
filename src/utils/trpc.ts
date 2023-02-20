import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '@/server/routers/_app';

function getBaseUrl() {
    if (typeof window !== 'undefined')
        // browser should use relative path
        return '';

    if (process.env.VERCEL_URL)
        // reference for vercel.com
        return `https://${process.env.VERCEL_URL}`;

    // assume localhost if not on vercel
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * This is the auth token that is used for all requests.
 */
let token: string | null = null;
export function setAuthToken(newToken: string | null) {
    token = newToken;
}

export const trpc = createTRPCNext<AppRouter>({
    config({ ctx }) {

        return {
            links: [
                httpBatchLink({
                    /**
                     * We need the full url if we're using SSR.
                     * @link https://trpc.io/docs/ssr
                     **/
                    url: `${getBaseUrl()}/api/trpc`,
                }),
            ],
            headers: {
                authorization: token,
            }
            /**
             * @link https://tanstack.com/query/v4/docs/reference/QueryClient
             **/
            // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
        };
    },

    /**
     * @link https://trpc.io/docs/ssr
     **/
    ssr: false,
});
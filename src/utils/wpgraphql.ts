import { QueryClient } from '@tanstack/query-core';

const endpoint = 'https://wp.atenews.ph/graphql';
const token = process.env.WP_API_TOKEN;

export const gql = (
  strings: TemplateStringsArray,
  ...values: unknown[]
): string =>
  strings.reduce(
    (acc, str, i) => acc + str + (i < values.length ? String(values[i]) : ''),
    '',
  );

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
    },
  },
});

const WPGraphQL = {
  request: async <T>(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<T> => {
    return queryClient.fetchQuery<T>({
      queryKey: ['wp-graphql', query, variables],
      queryFn: async () => {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: token ? `Basic ${token}` : '',
          },
          body: JSON.stringify({ query, variables }),
        });

        const json = (await res.json()) as {
          data?: T;
          errors?: Array<{ message: string }>;
        };

        if (json.errors && json.errors.length > 0) {
          throw new Error(json.errors[0]?.message ?? 'GraphQL request failed');
        }

        return json.data as T;
      },
    });
  },
};

export default WPGraphQL;

'use client';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo';

interface ApolloClientProviderProps {
  children: React.ReactNode;
}

export function ApolloClientProvider({ children }: ApolloClientProviderProps) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}
import { Text } from '@codemirror/state';
import { type PropsWithChildren, createContext, useState } from 'react';

import type { APISpec } from '../types/discord';
import type { UseStateReturnType } from '../types/react';

export interface IAPIRequestBuilderContext {
  method: UseStateReturnType<APISpec['method']>;
  path: UseStateReturnType<string>;
  params: UseStateReturnType<[string, string][]>;
  query: UseStateReturnType<[string, string][]>;
  headers: UseStateReturnType<[string, string][]>;
  body: UseStateReturnType<Text>;
  auth: UseStateReturnType<keyof APISpec['auth']>;
}

export const APIRequestBuilderContext = createContext<IAPIRequestBuilderContext>({
  method: ['GET', () => {}],
  path: ['', () => {}],
  params: [[], () => {}],
  query: [[], () => {}],
  headers: [[], () => {}],
  body: [Text.of(['{}']), () => {}],
  auth: ['bot', () => {}],
});

export const APIRequestBuilderProvider = ({ children }: PropsWithChildren) => {
  const method = useState<APISpec['method']>('GET');
  const path = useState('');
  const params = useState<[string, string][]>([]);
  const query = useState<[string, string][]>([]);
  const headers = useState<[string, string][]>([]);
  const body = useState<Text>(Text.of(['{}']));
  const auth = useState<keyof APISpec['auth']>('bot');

  return (
    <APIRequestBuilderContext.Provider
      value={{
        method,
        path,
        params,
        query,
        headers,
        body,
        auth,
      }}
    >
      {children}
    </APIRequestBuilderContext.Provider>
  );
};

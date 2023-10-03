import { type PropsWithChildren, createContext } from 'react';
import { useSessionStorage } from 'usehooks-ts';

import type { UseStateReturnType } from '../types/react';

export interface ISessionStorageContext {
  clientId: UseStateReturnType<string>;
  clientSecret: UseStateReturnType<string>;
  botToken: UseStateReturnType<string>;
  scopes: UseStateReturnType<string>;
  accessToken: UseStateReturnType<string>;
  refreshToken: UseStateReturnType<string>;
  expiresAt: UseStateReturnType<string>;
}

export const SessionStorageContext = createContext<ISessionStorageContext>({
  clientId: ['', () => {}],
  clientSecret: ['', () => {}],
  botToken: ['', () => {}],
  scopes: ['', () => {}],
  accessToken: ['', () => {}],
  refreshToken: ['', () => {}],
  expiresAt: ['', () => {}],
});

export const SessionStorageProvider = ({ children }: PropsWithChildren) => {
  const clientId = useSessionStorage<string>('clientId', '');
  const clientSecret = useSessionStorage<string>('clientSecret', '');
  const botToken = useSessionStorage<string>('botToken', '');
  const scopes = useSessionStorage<string>('scopes', '');
  const accessToken = useSessionStorage<string>('accessToken', '');
  const refreshToken = useSessionStorage<string>('refreshToken', '');
  const expiresAt = useSessionStorage<string>('expiresAt', '');

  return (
    <SessionStorageContext.Provider
      value={{
        clientId,
        clientSecret,
        botToken,
        scopes,
        accessToken,
        refreshToken,
        expiresAt,
      }}
    >
      {children}
    </SessionStorageContext.Provider>
  );
};

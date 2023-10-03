import { type PropsWithChildren, createContext, useState } from 'react';

import type { VerboseRequestPayload, VerboseResponsePayload } from '../types/common';
import type { UseStateReturnType } from '../types/react';

export type VerboseRequestResponsePayload =
  | ({
      type: 'request';
    } & VerboseRequestPayload)
  | ({
      type: 'response';
    } & VerboseResponsePayload);

export interface IRequestResponseContext {
  request: UseStateReturnType<VerboseRequestResponsePayload | null>;
  response: UseStateReturnType<VerboseRequestResponsePayload | null>;
}

export const RequestResponseContext = createContext<IRequestResponseContext>({
  request: [null, () => {}],
  response: [null, () => {}],
});

export const RequestResponseProvider = ({ children }: PropsWithChildren) => {
  const request = useState<VerboseRequestResponsePayload | null>(null);
  const response = useState<VerboseRequestResponsePayload | null>(null);

  return (
    <RequestResponseContext.Provider value={{ request, response }}>
      {children}
    </RequestResponseContext.Provider>
  );
};

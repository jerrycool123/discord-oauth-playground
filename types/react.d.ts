import type { Dispatch, SetStateAction } from 'react';

export type UseStateReturnType<S> = [S, Dispatch<SetStateAction<S>>];

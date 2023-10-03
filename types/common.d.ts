export interface VerboseRequestPayload {
  rawHeader: string;
  body: string | null;
}

export interface VerboseResponsePayload {
  httpVersion: string;
  status: number;
  reasonPhrase: string;
  headers: Record<string, string>;
  body: string | null;
}

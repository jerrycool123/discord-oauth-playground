import { VerboseRequestResponsePayload } from '../contexts/RequestResponseProvider';

export const useFormattedRequestResponse = (
  payload: VerboseRequestResponsePayload | null,
  hideHeaders: boolean,
) => {
  if (payload === null) return '';

  const { body } = payload;
  if (payload.type === 'request') {
    const lines = `${payload.rawHeader.trim()}${body === null ? '' : `\n\n${body}`}`.split('\n');
    return lines
      .map((line) =>
        line.startsWith('Authorization: Bot')
          ? `Authorization: Bot ${'*'.repeat(20)}`
          : line.startsWith('Authorization: Bearer')
          ? `Authorization: Bearer ${'*'.repeat(20)}`
          : line,
      )
      .join('\n');
  } else {
    return `HTTP/${payload.httpVersion} ${payload.reasonPhrase} ${payload.status}
${Object.entries(hideHeaders ? [] : payload.headers)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}${body === null ? '' : `\n\n${body}`}`;
  }
};

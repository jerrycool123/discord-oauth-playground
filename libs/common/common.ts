export const extractVariables = (input: string): string[] => {
  const regex = /\{(\w+)\}/g;
  const matches = [];
  let match = regex.exec(input);

  while (match !== null) {
    matches.push(match[1]);
    match = regex.exec(input);
  }

  return matches;
};

export const capitalize = (input: string): string => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

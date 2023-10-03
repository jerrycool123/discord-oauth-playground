import theme from 'antd/es/theme';

export const useToken = () => {
  const props = theme.useToken();
  return { ...props, colorStyle: { color: props.token.colorText } };
};

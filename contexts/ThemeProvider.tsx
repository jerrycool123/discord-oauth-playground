import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import type Entity from '@ant-design/cssinjs/es/Cache';
import ConfigProvider from 'antd/es/config-provider';
import theme from 'antd/es/theme';
import { useServerInsertedHTML } from 'next/navigation';
import { type PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react';

import type { UseStateReturnType } from '../types/react';

const { useToken, defaultAlgorithm, darkAlgorithm } = theme;

export interface IThemeContext {
  darkTheme: UseStateReturnType<boolean>;
}

export const ThemeContext = createContext<IThemeContext>({
  darkTheme: [false, () => {}],
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const cache = useMemo<Entity>(() => createCache(), []);

  const darkTheme = useState(false);
  const [isDarkTheme, setIsDarkTheme] = darkTheme;

  useServerInsertedHTML(() => (
    <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  ));

  useEffect(() => {
    const darkThemeMatcher = window.matchMedia('(prefers-color-scheme: dark)');

    const handleDarkThemeChange = (event: MediaQueryListEvent) => {
      setIsDarkTheme(event.matches);
    };

    darkThemeMatcher.addEventListener('change', handleDarkThemeChange);
    setIsDarkTheme(darkThemeMatcher.matches);

    return () => {
      darkThemeMatcher.removeEventListener('change', handleDarkThemeChange);
    };
  }, [setIsDarkTheme]);

  return (
    <ThemeContext.Provider value={{ darkTheme }}>
      <StyleProvider cache={cache}>
        <ConfigProvider
          theme={{
            algorithm: isDarkTheme ? darkAlgorithm : defaultAlgorithm,
          }}
          renderEmpty={() => <></>}
        >
          <InnerProvider>{children}</InnerProvider>
        </ConfigProvider>
      </StyleProvider>
    </ThemeContext.Provider>
  );
};

const InnerProvider = ({ children }: PropsWithChildren) => {
  const { token } = useToken();

  useEffect(() => {
    document.body.style.backgroundColor = token.colorBgContainer;
  }, [token]);

  return <>{children}</>;
};

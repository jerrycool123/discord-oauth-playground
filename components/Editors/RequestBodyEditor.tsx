import { indentWithTab, standardKeymap } from '@codemirror/commands';
import { json, jsonLanguage, jsonParseLinter } from '@codemirror/lang-json';
import { lintGutter, linter } from '@codemirror/lint';
import { EditorState, type Extension, Text } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useContext, useEffect, useRef } from 'react';

import { ThemeContext } from '../../contexts/ThemeProvider';

const basicExtensions: Extension[] = [
  basicSetup,
  keymap.of([...standardKeymap, indentWithTab]),
  json(),
  EditorState.tabSize.of(2),
  jsonLanguage,
  linter(jsonParseLinter()),
  lintGutter(),
];

export const RequestBodyEditor = ({
  value,
  setValue,
  isEditable = true,
}: {
  value?: Text;
  setValue: (value: Text) => void;
  isEditable?: boolean;
}) => {
  const {
    darkTheme: [isDarkTheme],
  } = useContext(ThemeContext);

  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current === null) return;

    const state = EditorState.create({
      doc: value ?? Text.of(['{}']),
      extensions: [
        ...basicExtensions,
        EditorView.updateListener.of((view) => {
          if (view.docChanged) {
            setValue(view.state.doc);
          }
        }),
        EditorView.editable.of(isEditable),
        ...(isDarkTheme ? [oneDark] : []),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      view.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, isEditable, isDarkTheme]);

  return <div ref={editorRef}></div>;
};

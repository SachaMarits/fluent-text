import React, { ReactNode } from 'react';
import { TextEditorContext, TextEditorContextType } from './TextEditorContext';

interface TextEditorProviderProps {
  children: ReactNode;
  value: TextEditorContextType;
}

export const TextEditorProvider: React.FC<TextEditorProviderProps> = ({ children, value }) => {
  return <TextEditorContext.Provider value={value}>{children}</TextEditorContext.Provider>;
};

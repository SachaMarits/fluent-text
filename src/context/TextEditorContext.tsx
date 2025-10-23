import { createContext, useContext } from 'react';
import { FluentEditorFile } from '../types/File';
import { FluentEditorTemplate } from '../types/Template';

export interface TextEditorContextType {
  hideTitles: boolean;
  hideGroupNames: boolean;
  textOptions: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    [key: string]: any;
  };
  options: string[];
  isEditing: boolean;
  isHoveringAction: boolean;
  setIsHoveringAction: (isHoveringAction: boolean) => void;
  vertical: boolean;
  showAttachments: boolean;
  templates: FluentEditorTemplate[] | undefined;
  attachments: FluentEditorFile[];
  setAttachments: (attachments: FluentEditorFile[]) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export const TextEditorContext = createContext<TextEditorContextType | undefined>(undefined);

export const useTextEditorContext = () => {
  const context = useContext(TextEditorContext);
  if (context === undefined) {
    throw new Error('useTextEditorContext must be used within a TextEditorProvider');
  }
  return context;
};

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { TextEditorContext } from './context';
import TextEditorToolbar from './components/Toolbar/TextEditorToolbar';
import { FluentEditorFile } from './types/File';
import { TranslationProvider, Language } from './translations';
import { useBreakpoint } from './hooks/useBreakpoint';
import { FluentEditorTemplate } from './types/Template';
import { Toaster } from 'sonner';
import { decodeBase64, getContent, extractBackgroundImageUrl } from './utils/conversion';
import ShortenedString from './components/Base/ShortenedString';
import { Variable } from './types/Variable';

import './styles/main.scss';

export const FluentTextPlaceholder = `<div><br></div>`;

interface TextEditorProps {
  // Basic
  id?: string;
  defaultValue?: string;

  // Layout
  vertical?: boolean;
  textWidth?: string;
  height?: string | number;
  responsive?: boolean;
  className?: string;

  // Toggles
  hideTitles?: boolean;
  hideGroupNames?: boolean;
  showAttachments?: boolean;
  input?: boolean;
  disabled?: boolean;
  emailFormat?: boolean;
  minified?: boolean;
  noPadding?: boolean;
  defaultValueIsBase64?: boolean;

  // Options
  options?: string[];
  textOptions?: string[];
  language?: Language;

  // External data
  templates?: FluentEditorTemplate[] | undefined;
  variables?: Variable[];
  attachments?: FluentEditorFile[];
  setAttachments?: React.Dispatch<React.SetStateAction<FluentEditorFile[]>>;
  onContentChange?: (content: string, base64Content: string) => void;
}

export default function FluentText({
  id = 'text-editor-document-text',
  defaultValue = '',
  defaultValueIsBase64 = false,
  // Layout
  vertical = false,
  textWidth = '600px',
  height = 'auto',
  responsive = false,
  className = '',

  // Toggles
  hideTitles = false,
  hideGroupNames = false,
  showAttachments = false,
  input = false,
  disabled = false,
  emailFormat = true,
  minified = false,
  noPadding = false,

  // Options
  options = ['text', 'color', 'image', 'layout', 'element'],
  textOptions = ['style', 'alignment', 'link', 'font', 'variable'],
  language = 'en',

  // External data
  templates,
  variables = [],
  attachments = [],
  setAttachments = () => {},
  onContentChange,
}: TextEditorProps) {
  const text = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isHoveringAction, setIsHoveringAction] = useState<boolean>(false);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const { isMd } = useBreakpoint();
  const [showAttachmentsState, setShowAttachmentsState] = useState<boolean>(isMd());
  const isInitialized = useRef<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const table = document.getElementById('editor-table');
    const lastCell = document.getElementById('text-editor-wrapper');

    if (table) {
      if (!table.contains(target)) {
        if (lastCell) {
          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(lastCell);
          range.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const clickedImage = e.target as HTMLImageElement;

    if (text.current) {
      text.current.querySelectorAll('img').forEach(img => {
        img.classList.remove('selected-image');
      });
      disableImageOptions(true);

      if (clickedImage.tagName === 'IMG') {
        clickedImage.classList.add('selected-image');
        disableImageOptions(false);
      }
    }
  };

  const disableImageOptions = (disabled: boolean) => {
    document.querySelectorAll('.selected-image-option').forEach(button => {
      (button as HTMLButtonElement).disabled = disabled;
    });
  };

  const triggerContentChange = useCallback(() => {
    if (onContentChange) {
      const htmlContent = getContent(id, true, minified);
      const base64Content = getContent(id, false, minified);
      onContentChange(htmlContent || '', base64Content || '');
    }
  }, [onContentChange, id]);

  const debouncedContentChange = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      triggerContentChange();
    }, 300);
  }, [triggerContentChange]);

  // Enlève les styles dédiés aux emails mais préserve l'image de fond
  const removeStyles = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const textEditorWrapper = tempDiv.querySelector('#text-editor-wrapper') as HTMLElement;

    if (textEditorWrapper) {
      // Sauvegarde l'image de fond si elle existe
      const backgroundImageStyle = textEditorWrapper.style.backgroundImage;
      const backgroundSize = textEditorWrapper.style.backgroundSize;
      const backgroundPosition = textEditorWrapper.style.backgroundPosition;
      const backgroundRepeat = textEditorWrapper.style.backgroundRepeat;

      textEditorWrapper.removeAttribute('style');

      // Restaure uniquement l'image de fond
      if (backgroundImageStyle) {
        textEditorWrapper.style.backgroundImage = backgroundImageStyle;
        textEditorWrapper.style.backgroundSize = backgroundSize;
        textEditorWrapper.style.backgroundPosition = backgroundPosition;
        textEditorWrapper.style.backgroundRepeat = backgroundRepeat;
      }

      return tempDiv.innerHTML;
    }
    return html;
  };

  const handleCompatibility = () => {
    if (text.current) {
      // @ts-ignore
      text.current.querySelectorAll(`[style*="text-align: right"]`).forEach(e => (e.align = 'right'));
      // @ts-ignore
      text.current.querySelectorAll(`[style*="text-align: left"]`).forEach(e => (e.align = 'left'));
      // @ts-ignore
      text.current.querySelectorAll(`[style*="text-align: center"]`).forEach(e => (e.align = 'center'));
      // @ts-ignore
      text.current.querySelectorAll(`[style*="text-align: justify"]`).forEach(e => (e.align = 'justify'));
    }
  };

  useEffect(() => {
    if (text.current && !isInitialized.current) {
      let defaultValueContent = defaultValue;
      if (defaultValueIsBase64) {
        defaultValueContent = decodeBase64(defaultValue);
      }

      // Détecter s'il y a une image de fond dans le contenu
      let extractedImageUrl = extractBackgroundImageUrl(defaultValueContent);

      if (extractedImageUrl) {
        extractedImageUrl = extractedImageUrl?.replace(/&quot;/g, '"');
        setBackgroundImage(extractedImageUrl);
      }

      // Extraire le contenu interne si defaultValueContent contient une div
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = defaultValueContent;

      // Chercher d'abord #text-editor-wrapper, sinon prendre la première div, sinon garder le contenu tel quel
      const wrapperDiv = tempDiv.querySelector('#text-editor-wrapper');
      if (wrapperDiv) {
        defaultValueContent = wrapperDiv.innerHTML;
      } else {
        // Si pas de #text-editor-wrapper, chercher une div simple
        const firstDiv = tempDiv.querySelector('div');
        if (firstDiv && tempDiv.children.length === 1 && tempDiv.children[0] === firstDiv) {
          // Si la div est le seul enfant direct, prendre son contenu
          defaultValueContent = firstDiv.innerHTML;
        }
        // Sinon, garder defaultValueContent tel quel
      }

      const htmlContent = emailFormat
        ? defaultValueContent === FluentTextPlaceholder
          ? `
            <table width="100%" border="0" cellspacing="0" id="editor-table">
              <tr>
                <td class="center" align="center" valign="top">
                  <center>
                    <table width="560" border="0" cellspacing="0">
                      <tr
                        style="font-family: Verdana, sans-serif; max-width: 560px"
                        face="Verdana, sans-serif, font-size: 16px"
                      >
                        <td id="text-editor-wrapper" style="background-image: url(${backgroundImage})">${defaultValueContent || ''}</td>
                      </tr>
                    </table>
                  </center>
                </td>
              </tr>
            </table>
          `
          : removeStyles(defaultValueContent)
        : `<div id="text-editor-wrapper">${defaultValueContent || ''}</div>`;

      text.current.innerHTML = htmlContent;
      const editor = document.getElementById(id) as HTMLElement;
      editor.style.backgroundSize = 'cover';
      editor.style.backgroundPosition = 'center';
      editor.style.backgroundRepeat = 'no-repeat';
      editor.style.backgroundImage = `url(${extractedImageUrl})`;

      // Si aucune image n'a été trouvée avant, chercher dans le DOM après injection
      if (!extractedImageUrl) {
        const wrapper = text.current.querySelector('#text-editor-wrapper') as HTMLElement;
        if (wrapper && wrapper.style.backgroundImage) {
          const bgImage = wrapper.style.backgroundImage;
          // Extrait l'URL de l'image (enlève "url(" et ")" ou les guillemets)
          const imageUrl = bgImage.replace(/url\(['"]?([^'"]+)['"]?\)/i, '$1');
          if (imageUrl) {
            setBackgroundImage(imageUrl.trim());
          }
        }
      }

      isInitialized.current = true;
    }
  }, []);

  // Applique l'image de fond sur #text-editor-wrapper dans le contenu
  useEffect(() => {
    if (text.current && isInitialized.current) {
      const wrapper = text.current.querySelector('#text-editor-wrapper') as HTMLElement;
      if (wrapper) {
        if (backgroundImage) {
          wrapper.style.backgroundImage = `url(${backgroundImage})`;
          wrapper.style.backgroundSize = 'cover';
          wrapper.style.backgroundPosition = 'center';
          wrapper.style.backgroundRepeat = 'no-repeat';
        } else {
          // Ne supprime que l'image de fond, pas les autres styles
          if (wrapper.style.backgroundImage) {
            wrapper.style.backgroundImage = '';
            wrapper.style.backgroundSize = '';
            wrapper.style.backgroundPosition = '';
            wrapper.style.backgroundRepeat = '';
          }
        }
      }
    }
  }, [backgroundImage]);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <TranslationProvider defaultLanguage={language}>
      <TextEditorContext.Provider
        value={{
          hideTitles,
          hideGroupNames,
          options,
          textOptions,
          vertical,
          showAttachments,
          templates,
          attachments,
          setAttachments,
          isEditing,
          setIsEditing,
          isHoveringAction,
          setIsHoveringAction,
          backgroundImage,
          setBackgroundImage,
          variables,
        }}
      >
        <div
          id="text-editor"
          className={`text-editor${vertical ? '-vertical' : ''} ${className || ''} ${input ? 'input-editor' : ''}`}
        >
          {!vertical && <TextEditorToolbar text={text} />}

          <div className="text-editor-document">
            <div
              id={id}
              contentEditable={!disabled}
              className={`fluent-text-editor-content text-editor-content${responsive ? ' text-editor-responsive' : ''} ${
                disabled ? 'text-editor-disabled' : ''
              }`}
              style={{
                minWidth: textWidth,
                width: textWidth,
                padding: noPadding ? '0' : '20px',
                minHeight: height,
              }}
              ref={text}
              onClick={e => {
                handleContentClick(e);
                handleImageClick(e);
              }}
              onBlur={() => {
                handleCompatibility();
                setIsEditing(false);
                triggerContentChange();
              }}
              onFocus={() => setIsEditing(true)}
              onInput={() => debouncedContentChange()}
            />

            <div className="text-editor-attachments">
              {showAttachmentsState &&
                attachments.map((fichier: FluentEditorFile, index: number) => (
                  <div
                    className={`text-editor-attachment ${fichier.url ? 'pointer' : ''}`}
                    key={index}
                    onClick={() => (fichier?.url ? window.open(fichier.url, '_blank') : {})}
                  >
                    <ShortenedString text={fichier.name} maxLength={20} />
                    <i
                      className="mdi mdi-close pointer p-2 h5 mb-0"
                      onClick={e => {
                        e.stopPropagation();
                        setAttachments(attachments.filter((_: any, i: number) => i !== index));
                      }}
                    />
                  </div>
                ))}

              {showAttachments && (
                <div
                  className="text-editor-attachment text-editor-attachments-collapse"
                  onClick={() => setShowAttachmentsState(!showAttachmentsState)}
                >
                  <div className="position-relative mr-2">
                    <i className="mdi mdi-paperclip" />
                    <div className="notification-number">{attachments.length}</div>
                  </div>
                  <i className={`mdi mdi-chevron-${showAttachmentsState ? 'up' : 'down'}`} />
                </div>
              )}
            </div>
          </div>

          {vertical && <TextEditorToolbar text={text} />}
        </div>
        <Toaster />
      </TextEditorContext.Provider>
    </TranslationProvider>
  );
}

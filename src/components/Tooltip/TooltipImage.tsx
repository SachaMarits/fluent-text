import React, { useRef, useState } from 'react';
import Tooltip from '../Tooltip/Tooltip';
import { Button, Input } from 'reactstrap';
import { restoreSelection, saveSelection } from '../../functions/selectionHandler';
import { useTextEditorContext } from '../../context';
import { useTranslation } from '../../translations';

interface TooltipImageProps {
  text: React.RefObject<HTMLDivElement>;
}
const TooltipImage = ({ text }: TooltipImageProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { hideTitles, isEditing, isHoveringAction, setIsHoveringAction } = useTextEditorContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [imageLink, setImageLink] = useState('');
  const [savedSelection, setSavedSelection] = useState<Range>(document.createRange());
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    setFile(e.dataTransfer.files[0]);
  };

  const handleInsertImage = () => imageInputRef.current?.click();

  const handleImageUpload = () => {
    if (file) {
      if (savedSelection) restoreSelection(savedSelection);
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageUrl = event.target?.result as string;
        const maxEditorWidth = 560;

        const tempImg = new Image();
        tempImg.src = imageUrl;
        tempImg.onload = () => {
          let { width } = tempImg;
          let { height } = tempImg;

          if (width > maxEditorWidth) {
            const ratio = width / height;
            width = maxEditorWidth;
            height = width / ratio;
          }

          document.execCommand('insertImage', false, imageUrl);
          const img = document.querySelectorAll(`img[src="${imageUrl}"`);
          if (img) {
            const lastImage = img[img.length - 1] as HTMLImageElement;
            if (lastImage) {
              lastImage.style.maxWidth = `${maxEditorWidth}px`;
              lastImage.style.width = `${width}px`;
              lastImage.style.height = `${height}px`;
              lastImage.width = width;
              lastImage.height = height;

              if (imageLink) {
                const link = document.createElement('a');
                link.href = imageLink;
                link.target = '_blank';
                link.appendChild(lastImage.cloneNode(true));
                lastImage.parentNode?.replaceChild(link, lastImage);
              }
            }
          }

          // @ts-ignore
          text.current?.querySelectorAll('img').forEach((img: HTMLImageElement) => {
            img.classList.add('resizable-image');
            img.addEventListener('mousedown', (e: MouseEvent) => {
              if (e.target === img) {
                e.preventDefault();
                const originalWidth = img.offsetWidth;
                const originalHeight = img.offsetHeight;
                const startX = e.clientX;
                const ratio = originalWidth / originalHeight;
                const maxHeight = maxEditorWidth / ratio;

                const resizeImage = (e: MouseEvent) => {
                  const newWidth = originalWidth + (e.clientX - startX);
                  const newHeight = newWidth / ratio;
                  const width = newWidth > maxEditorWidth ? maxEditorWidth : newWidth;
                  const height = newHeight > maxHeight ? maxHeight : newHeight;

                  img.style.maxWidth = `${maxEditorWidth}px`;
                  img.style.width = `${width}px`;
                  img.style.height = `${height}px`;
                  img.width = width;
                  img.height = height;
                };

                document.addEventListener('mousemove', resizeImage);
                document.addEventListener('mouseup', () => {
                  document.removeEventListener('mousemove', resizeImage);
                });
              }
            });
          });
        };
      };
      reader.readAsDataURL(file);
    }

    setIsOpen(false);
    reset();
  };

  const reset = () => {
    setImageLink('');
    setFile(null);
  };

  return (
    // @ts-ignore
    <Tooltip
      toggle={
        <button
          className="btn btn-option"
          onClick={() => {
            setSavedSelection(saveSelection());
            setIsOpen(true);
          }}
          title={hideTitles ? '' : t('insererImage')}
          onMouseDown={() => setIsHoveringAction(true)}
          onMouseLeave={() => setIsHoveringAction(false)}
          disabled={!isEditing && !isHoveringAction}
        >
          <i className="mdi mdi-image-plus" />
        </button>
      }
      show={isOpen}
      content={
        <div className="text-editor-link">
          <div
            className={`empty-line-placeholder pointer mb-2 ${file || isDragOver ? 'success' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleInsertImage}
          >
            {file ? (
              file.name
            ) : (
              <>
                {t('insererImage')} <i className="mdi mdi-plus" />
              </>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            style={{ display: 'none' }}
            onChange={e => {
              setFile(e.target.files?.[0] || null);
              e.target.value = '';
            }}
          />
          <Input
            className="mb-2"
            type="url"
            placeholder={`${t('lien')} (${t('facultatif')})`}
            onBlur={e => setImageLink(e.target.value)}
          />
          <div className="d-flex justify-content-between">
            <Button
              color="danger"
              onClick={() => {
                reset();
                setIsOpen(false);
              }}
            >
              {t('fermer')}
            </Button>
            <Button color="success custom-success" onClick={() => handleImageUpload()}>
              {t('ajouter')} <i className="mdi mdi-plus" />
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default TooltipImage;

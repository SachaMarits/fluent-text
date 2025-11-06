import React, { useRef, useState } from 'react';
import Tooltip from './Tooltip';
import { Button } from 'reactstrap';
import { useTextEditorContext } from '../../context';
import { useTranslation } from '../../translations';

interface TooltipBackgroundImageProps {
  text: React.RefObject<HTMLDivElement>;
}
const TooltipBackgroundImage = ({ text }: TooltipBackgroundImageProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { hideTitles, setBackgroundImage, backgroundImage } = useTextEditorContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const applyBackgroundImageToContent = (imageUrl: string) => {
    if (text.current) {
      const wrapper = document.getElementById('text-editor-document-text') as HTMLElement;
      console.log('wrapper', wrapper);
      if (wrapper) {
        wrapper.style.backgroundImage = `url(${imageUrl})`;
        wrapper.style.backgroundSize = 'cover';
        wrapper.style.backgroundPosition = 'center';
        wrapper.style.backgroundRepeat = 'no-repeat';
      }
    }
  };

  const removeBackgroundImageFromContent = () => {
    if (text.current) {
      const wrapper = document.getElementById('text-editor-document-text') as HTMLElement;
      if (wrapper) {
        wrapper.style.backgroundImage = '';
        wrapper.style.backgroundSize = '';
        wrapper.style.backgroundPosition = '';
        wrapper.style.backgroundRepeat = '';
      }
    }
  };

  const handleImageUpload = () => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageUrl = event.target?.result as string;
        applyBackgroundImageToContent(imageUrl);
        if (setBackgroundImage) {
          setBackgroundImage(imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }

    setIsOpen(false);
    reset();
  };

  const handleRemoveBackground = () => {
    removeBackgroundImageFromContent();
    if (setBackgroundImage) {
      setBackgroundImage('');
    }
    setIsOpen(false);
    reset();
  };

  const reset = () => {
    setFile(null);
  };

  return (
    // @ts-ignore
    <Tooltip
      toggle={
        <button
          className="btn btn-option"
          onClick={() => {
            setIsOpen(true);
          }}
          title={hideTitles ? '' : t('imageDeFond')}
        >
          <i className="mdi mdi-file-image-outline" />
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
            ) : backgroundImage ? (
              <>
                {t('imageDeFond')} <i className="mdi mdi-check" />
              </>
            ) : (
              <>
                {t('insererImageDeFond')} <i className="mdi mdi-plus" />
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
            {backgroundImage && (
              <Button color="warning" onClick={handleRemoveBackground}>
                {t('supprimer')}
              </Button>
            )}
            <Button color="success" onClick={() => handleImageUpload()} disabled={!file}>
              {t('ajouter')} <i className="mdi mdi-plus" />
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default TooltipBackgroundImage;

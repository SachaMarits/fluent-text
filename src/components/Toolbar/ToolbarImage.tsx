import React, { useEffect } from 'react';
import TooltipImage from '../Tooltip/TooltipImage';
import { useTextEditorContext } from '../../context';
import { useTranslation } from '../../translations';
import TooltipBackgroundImage from '../Tooltip/TooltipBackgroundImage';

interface ToolbarImageProps {
  text: React.RefObject<HTMLDivElement>;
}

const ToolbarImage = ({ text }: ToolbarImageProps) => {
  const { t } = useTranslation();
  const { hideTitles, hideGroupNames } = useTextEditorContext();

  useEffect(() => {
    document.querySelectorAll('.selected-image-option').forEach((button: any) => {
      button.disabled = true;
    });
  }, []);

  const handleAlignment = (float: string) => {
    const selectedImage = document.querySelector('.selected-image') as HTMLImageElement;
    if (selectedImage) {
      selectedImage.style.float = float;
      selectedImage.align = float;
    }
  };

  return (
    <div className="tool-group">
      <div className="tool-group-icons">
        <TooltipImage text={text} />
        <button
          className="btn btn-option selected-image-option"
          onClick={() => handleAlignment('left')}
          title={hideTitles ? '' : t('alignerAGauche')}
        >
          <i className="mdi mdi-align-horizontal-left" />
        </button>
        <button
          className="btn btn-option selected-image-option"
          onClick={() => handleAlignment('right')}
          title={hideTitles ? '' : t('alignerADroite')}
        >
          <i className="mdi mdi-align-horizontal-right" />
        </button>
        <button
          className="btn btn-option selected-image-option"
          onClick={() => handleAlignment('none')}
          title={hideTitles ? '' : t('enleverAlignement')}
        >
          <i className="mdi mdi-signature-image" />
        </button>
        <TooltipBackgroundImage text={text} />
      </div>
      {!hideGroupNames && <p className="tool-group-title">{t('image')}</p>}
    </div>
  );
};

export default ToolbarImage;

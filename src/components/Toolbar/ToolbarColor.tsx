import { useState } from 'react';
import ToolbarIconGroup from './ToolbarIconGroup';
import { useTranslation } from '../../translations';
import { useTextEditorContext } from '../../context';

interface ToolbarColorProps {
  handleStyle: (style: string, value: string | undefined) => void;
}

const ToolbarColor = ({ handleStyle }: ToolbarColorProps) => {
  const { t } = useTranslation();
  const { hideTitles, hideGroupNames } = useTextEditorContext();
  const [fontColor, setFontColor] = useState('#ff0000');
  const [highlightColor, setHighlightColor] = useState('#ffff00');

  return (
    <div className="tool-group">
      <div className="tool-group-icons">
        <ToolbarIconGroup
          icon="text"
          color={fontColor}
          onChange={v => {
            setFontColor(v);
            handleStyle('foreColor', v);
          }}
          title={hideTitles ? '' : t('couleurDeLaPolice')}
          splitCollapseEvent
        />
        <ToolbarIconGroup
          icon="highlight"
          color={highlightColor}
          onChange={v => {
            setHighlightColor(v);
            handleStyle('hiliteColor', v);
          }}
          title={hideTitles ? '' : t('couleurDeSurlignage')}
          splitCollapseEvent
        />
      </div>
      {!hideGroupNames && <p className="tool-group-title">{t('couleur')}</p>}
    </div>
  );
};

export default ToolbarColor;

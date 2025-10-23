import { useTranslation } from '../../translations';
import { useTextEditorContext } from '../../context';
import TooltipButton from '../Tooltip/TooltipButton';
import TooltipTable from '../Tooltip/TooltipTable';

const ToolbarElement = () => {
  const { t } = useTranslation();
  const { hideTitles, hideGroupNames, isEditing, isHoveringAction, setIsHoveringAction } = useTextEditorContext();

  return (
    <div className="tool-group">
      <div className="tool-group-icons">
        <TooltipButton />
        <TooltipTable />
        <button
          className="btn btn-option"
          onClick={() => document.execCommand('insertHorizontalRule')}
          title={hideTitles ? '' : t('ajouterLigneHorizontale')}
          onMouseDown={() => setIsHoveringAction(true)}
          onMouseLeave={() => setIsHoveringAction(false)}
          disabled={!isEditing && !isHoveringAction}
        >
          <i className="mdi mdi-minus" />
        </button>
      </div>
      {!hideGroupNames && <p className="tool-group-title">{t('element')}</p>}
    </div>
  );
};

export default ToolbarElement;

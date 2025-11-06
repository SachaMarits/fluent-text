import { useState } from 'react';
import { Button, Input } from 'reactstrap';
import { restoreSelection, saveSelection } from '../../functions/selectionHandler';
import { useTextEditorContext } from '../../context';
import Tooltip from './Tooltip';
import { useTranslation } from '../../translations';

const primaire = '#007bff';

const TooltipButton = () => {
  const { t } = useTranslation();
  const { hideTitles, isEditing, isHoveringAction, setIsHoveringAction } = useTextEditorContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [savedSelection, setSavedSelection] = useState<Range>(document.createRange());
  const [buttonName, setButtonName] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [buttonColor, setButtonColor] = useState(primaire);

  const handleButton = () => {
    if (savedSelection) restoreSelection(savedSelection);

    const buttonHtml = `<a contentEditable="false" href="${buttonLink}" target="_blank" style="background: ${buttonColor}; color: white; padding: 0.375rem 0.75rem; borderRadius: 2px; display: inline-block; margin: 5px; text-decoration: none;">${buttonName}</a>`;
    document.execCommand('insertHTML', false, buttonHtml);
    setIsOpen(false);
    reset();
  };

  const reset = () => {
    setButtonName('');
    setButtonLink('');
    setButtonColor(primaire);
  };

  return (
    <Tooltip
      toggle={
        <button
          className="btn btn-option"
          onClick={() => {
            setSavedSelection(saveSelection());
            setIsOpen(true);
          }}
          title={hideTitles ? '' : t('ajouterBouton')}
          onMouseDown={() => setIsHoveringAction(true)}
          onMouseLeave={() => setIsHoveringAction(false)}
          disabled={!isEditing && !isHoveringAction}
        >
          <i className="mdi mdi-button-cursor" />
        </button>
      }
      show={isOpen}
      content={
        <div className="text-editor-link">
          <Input type="text" className="mb-2" placeholder={t('texte')} onChange={e => setButtonName(e.target.value)} />
          <Input className="mb-2" type="url" placeholder={t('lien')} onBlur={e => setButtonLink(e.target.value)} />
          <Input type="color" defaultValue={buttonColor} onBlur={e => setButtonColor(e.target.value)} />
          <hr />
          <p className="mt-2 text-sm text-center">{t('previsualisation')}</p>
          <div className="d-flex align-items-center justify-content-center my-2">
            {buttonName && (
              <a
                href={buttonLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: buttonColor,
                  color: 'white',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '2px',
                  textDecoration: 'none',
                }}
              >
                {buttonName}
              </a>
            )}
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <Button
              color="danger mt-2"
              onClick={() => {
                reset();
                setIsOpen(false);
              }}
            >
              {t('fermer')}
            </Button>
            <Button color="success mt-2" onClick={() => handleButton()}>
              {t('ajouter')} <i className="mdi mdi-plus" />
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default TooltipButton;

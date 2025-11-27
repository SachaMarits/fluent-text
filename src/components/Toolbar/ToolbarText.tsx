import { useState } from 'react';
import { Button, Input } from 'reactstrap';
import Dropdown from '../Base/Dropdown';
import Tooltip from '../Tooltip/Tooltip';
import { useTextEditorContext } from '../../context';
import { restoreSelection, saveSelection } from '../../functions/selectionHandler';
import { useTranslation } from '../../translations';
import { useBreakpoint } from '../../hooks/useBreakpoint';

type Setting = {
  style: string;
  icon: string;
  title: string;
  option: string;
};

const settings: Setting[] = [
  { option: 'style', style: 'bold', icon: 'bold', title: 'gras' },
  { option: 'style', style: 'italic', icon: 'italic', title: 'italique' },
  {
    option: 'style',
    style: 'underline',
    icon: 'underline',
    title: 'souligner',
  },
  {
    option: 'alignment',
    style: 'justifyLeft',
    icon: 'align-left',
    title: 'alignerAGauche',
  },
  {
    option: 'alignment',
    style: 'justifyCenter',
    icon: 'align-center',
    title: 'alignerAuCentre',
  },
  {
    option: 'alignment',
    style: 'justifyRight',
    icon: 'align-right',
    title: 'alignerADroite',
  },
  {
    option: 'alignment',
    style: 'justifyFull',
    icon: 'align-justify',
    title: 'justifier',
  },
];

type Option = {
  id: number | string;
  text: string;
};

const fontSizeOptions: Option[] = [
  { id: 1, text: 'plusPetit' },
  { id: 2, text: 'petit' },
  { id: 3, text: 'moyen' },
  { id: 4, text: 'grand' },
  { id: 5, text: 'plusGrand' },
  { id: 6, text: 'extraGrand' },
];

const fontOptions: Option[] = [
  { id: 'Arial, sans-serif', text: 'Arial' },
  { id: 'Times New Roman, serif', text: 'Times New Roman' },
  { id: 'Verdana, sans-serif', text: 'Verdana' },
  { id: 'Georgia, serif', text: 'Georgia' },
  { id: 'Courier New, monospace', text: 'Courier New' },
];

type ToolbarTextProps = {
  handleStyle: (style: string, value?: string | undefined) => void;
};

export default function ToolbarText({ handleStyle }: ToolbarTextProps) {
  const { t } = useTranslation();
  const { hideTitles, hideGroupNames, textOptions, variables } = useTextEditorContext();
  const [linkName, setLinkName] = useState('');
  const [linkValue, setLinkValue] = useState('');
  const [savedSelection, setSavedSelection] = useState<Range>(document.createRange());
  const [isLinkTooltipOpen, setIsLinkTooltipOpen] = useState<boolean>(false);
  const { windowWidth } = useBreakpoint();
  const overrideFontFaces = () => {
    const fontElements = document.querySelectorAll('font');

    fontElements.forEach(fontElement => {
      const fontFaceValue = fontElement.getAttribute('face');
      if (fontFaceValue) fontElement.style.fontFamily = fontFaceValue;
    });
  };

  const handleVariable = (id: string) => {
    const variable = variables.find(v => v.value === id);
    if (variable) {
      const textToInsert = variable.name;
      const element = document.createElement('span');
      element.classList.add('text-editor-variable-data');
      element.setAttribute('title', t('explicationVariable'));
      element.setAttribute('contentEditable', 'false');
      element.setAttribute('translate', 'no');
      element.setAttribute('variable', variable.value);
      element.textContent = textToInsert;

      const selection = window.getSelection();
      if (selection) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(element);

        const newRange = document.createRange();
        newRange.setStartAfter(element);
        newRange.setEndAfter(element);

        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  };

  const handleLink = () => {
    if (savedSelection) restoreSelection(savedSelection);

    const linkHTML = `<a href="${linkValue}" target="_blank">${linkName}</a>`;
    document.execCommand('insertHTML', false, linkHTML);
    setLinkName('');
    setLinkValue('');
    setIsLinkTooltipOpen(false);
  };

  const filteredSettings = settings.filter(setting => textOptions.includes(setting.option));

  return (
    <div className="tool-group">
      <div className="tool-group-icons">
        {windowWidth < 700
          ? textOptions.some((o: string) => o === 'style' || o === 'alignement') && (
              <Dropdown
                options={filteredSettings.map(({ icon, style, title }) => ({
                  id: style,
                  text: (
                    <p>
                      <i className={`mdi mdi-format-${icon}`} /> {t(title as any)}
                    </p>
                  ),
                }))}
                toggle={
                  <button className="btn btn-option btn-collapse" title={hideTitles ? '' : t('taillePolice')}>
                    <i className="mdi mdi-format-text" />
                    <i className="mdi mdi-chevron-down" />
                  </button>
                }
                onClick={(id: string | number) => handleStyle(id.toString())}
                closeOnLeave
              />
            )
          : filteredSettings.map(({ icon, style, title }) => (
              <button
                key={icon}
                className="btn btn-option"
                onClick={() => handleStyle(style)}
                title={hideTitles ? '' : t(title as any)}
              >
                <i className={`mdi mdi-format-${icon}`} />
              </button>
            ))}

        {textOptions.some((o: string) => o === 'link') && (
          <Tooltip
            toggle={
              <button
                className="btn btn-option"
                title={hideTitles ? '' : t('lien')}
                onClick={() => {
                  setSavedSelection(saveSelection());
                  setIsLinkTooltipOpen(true);
                }}
              >
                <i className="mdi mdi-link" />
              </button>
            }
            show={isLinkTooltipOpen}
            content={
              <form
                className="text-editor-link"
                onSubmit={e => {
                  e.preventDefault();
                  handleLink();
                }}
              >
                <Input
                  type="text"
                  className="mb-2"
                  placeholder={t('texte')}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => setLinkName(e.target.value)}
                />
                <Input
                  type="url"
                  placeholder={t('lien')}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => setLinkValue(e.target.value)}
                />
                <div className="d-flex justify-content-between">
                  <Button color="danger mt-2" onClick={() => setIsLinkTooltipOpen(false)}>
                    {t('fermer')}
                  </Button>
                  <Button type="submit" color="success custom-success mt-2">
                    {t('ajouter')} <i className="mdi mdi-plus" />
                  </Button>
                </div>
              </form>
            }
          />
        )}

        {textOptions.some((o: string) => o === 'font') && (
          <>
            <Dropdown
              options={fontSizeOptions.map(f => ({
                ...f,
                text: t(f.text as any),
              }))}
              toggle={
                <button className="btn btn-option btn-collapse" title={hideTitles ? '' : t('taillePolice')}>
                  <i className="mdi mdi-format-size" />
                  <i className="mdi mdi-chevron-down" />
                </button>
              }
              onClick={(id: string | number) => handleStyle('fontSize', id.toString())}
              closeOnLeave
            />
            <Dropdown
              options={fontOptions}
              toggle={
                <button className="btn btn-option btn-collapse" title={hideTitles ? '' : t('police')}>
                  <i className="mdi mdi-format-font" />
                  <i className="mdi mdi-chevron-down" />
                </button>
              }
              onClick={(id: string | number) => {
                handleStyle('fontName', id.toString());
                overrideFontFaces();
              }}
              closeOnLeave
            />
          </>
        )}

        {textOptions.some((o: string) => o === 'variable') && variables.length > 0 && (
          <Dropdown
            options={variables.map(v => ({
              id: v.value,
              text: v.name,
            }))}
            toggle={
              <button className="btn btn-option btn-collapse" title={hideTitles ? '' : t('ajouterVariable')}>
                <i className="mdi mdi-text-account" />
                <i className="mdi mdi-chevron-down" />
              </button>
            }
            onClick={(id: string | number) => handleVariable(id.toString())}
            width={200}
            closeOnLeave
          />
        )}
      </div>
      {!hideGroupNames && <p className="tool-group-title">{t('texte')}</p>}
    </div>
  );
}

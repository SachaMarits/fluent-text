import React, { useRef, useState } from 'react';
import { useTextEditorContext } from '../../context';
import { useTranslation } from '../../translations';
import Dropdown from '../Base/Dropdown';
import { useSwal } from '../../hooks/useSwal';
import { decodeBase64 } from '../../utils/conversion';
import { useToast } from '../../hooks/useToast';
import { FluentEditorFile } from '../../types/File';

interface ToolbarLayoutProps {
  text: React.RefObject<HTMLDivElement>;
}

const ToolbarLayout = ({ text }: ToolbarLayoutProps) => {
  const { t } = useTranslation();
  const { hideTitles, hideGroupNames, showAttachments, attachments, setAttachments, templates } =
    useTextEditorContext();

  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const piecesJointesInputRef = useRef(null);
  const swal = useSwal();
  const toast = useToast();

  const handleFullScreen = () => {
    const textEditor = document.getElementById('text-editor');
    if (textEditor) {
      textEditor.classList.toggle('text-editor-fullscreen');
      setFullscreen(!fullscreen);
    }
  };

  const handleTemplate = (id: number) => {
    const template = templates?.find(t => t.id === id);
    if (template && text.current && (template.contentBase64 || template.content)) {
      swal.confirmation(t('remplacerContenu')).then(result => {
        if (result.isConfirmed) {
          // @ts-ignore
          if (template.contentBase64) text.current.innerHTML = decodeBase64(template.contentBase64);
          // @ts-ignore
          if (template.content) text.current.innerHTML = template.content;
        }
      });
    } else {
      toast.error(t('erreurModeleIntrouvable'));
    }
  };

  // @ts-ignore
  const handlePiecesJointes = () => piecesJointesInputRef.current?.click();

  const handlePiecesJointesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.currentTarget;
    if (files) {
      const piecesJointesArr = Array.from(files) as FluentEditorFile[];
      setAttachments([...attachments, ...piecesJointesArr]);
    }
  };

  return (
    <div className="tool-group">
      <div className="tool-group-icons">
        {templates && (
          <Dropdown
            options={templates.map(template => ({
              id: template.id,
              text: template.title,
            }))}
            toggle={
              <button className="btn btn-option btn-collapse" title={hideTitles ? '' : t('chargerModele')}>
                <i className="mdi mdi-file-document-edit" />
                <i className="mdi mdi-chevron-down" />
              </button>
            }
            onClick={(id: string | number) => handleTemplate(+id)}
            width={200}
            closeOnLeave
          />
        )}

        {showAttachments && (
          <>
            <button
              className="btn btn-option position-relative"
              onClick={handlePiecesJointes}
              title={hideTitles ? '' : t('insererPiecesJointes')}
            >
              <div className="notification-number">{attachments.length}</div>
              <i className="mdi mdi-paperclip-plus" />
            </button>
            <input
              type="file"
              multiple
              ref={piecesJointesInputRef}
              style={{ display: 'none' }}
              onChange={handlePiecesJointesUpload}
            />
          </>
        )}
        <button
          className={`btn btn-option ${fullscreen ? 'active' : ''}`}
          onClick={handleFullScreen}
          title={hideTitles ? '' : fullscreen ? t('pleinEcranFermer') : t('pleinEcran')}
        >
          <i className={`mdi ${fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'}`} />
        </button>
        {fullscreen && <i className="mdi mdi-close pointer text-editor-toggle-fullscreen" onClick={handleFullScreen} />}
      </div>
      {!hideGroupNames && <p className="tool-group-title">{t('document')}</p>}
    </div>
  );
};

export default ToolbarLayout;

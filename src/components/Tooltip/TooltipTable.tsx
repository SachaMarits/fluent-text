import { useState } from 'react';
import { Button } from 'reactstrap';
import { restoreSelection, saveSelection } from '../../functions/selectionHandler';
import { useTextEditorContext } from '../../context';
import Tooltip from './Tooltip';
import { useTranslation } from '../../translations';

const TooltipTable = () => {
  const { t } = useTranslation();
  const { hideTitles, isEditing, isHoveringAction, setIsHoveringAction } = useTextEditorContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [savedSelection, setSavedSelection] = useState<Range>(document.createRange());
  const [tableRow, setTableRow] = useState(2);
  const [tableCol, setTableCol] = useState(3);

  const handleButton = () => {
    if (savedSelection) restoreSelection(savedSelection);

    const randomId = Math.random().toString(36).substring(7);

    const tableHtml = `<table id="${randomId}" style="width: 100%; border-collapse: collapse;"><tbody>${Array(tableRow)
      .fill('row')
      .map(
        () =>
          `<tr>${Array(tableCol)
            .fill('col')
            .map(() => `<td style="border: 1px solid black; vertical-align: baseline;">&nbsp;</td>`)
            .join('')}</tr>`
      )
      .join('')}</tbody></table>`;

    document.execCommand('insertHTML', false, tableHtml);
    const table = document.getElementById(randomId);
    addResizeHandlers(table);
    setIsOpen(false);
    reset();
  };

  const isActive = (col: number, row: number) => {
    return tableCol >= col + 1 && tableRow >= row + 1 ? 'active' : '';
  };

  // Fonction pour ajouter des gestionnaires d'événements de redimensionnement aux lignes et colonnes du tableau
  function addResizeHandlers(table: any) {
    table.style.position = 'relative';

    // Sélectionner toutes les lignes et colonnes du tableau
    const rows = table.querySelectorAll('tr');
    const cols = table.querySelectorAll('td');

    // Ajouter des gestionnaires d'événements pour chaque ligne et colonne
    rows.forEach((row: any) => {
      row.style.position = 'relative';
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'resize-handle';
      resizeHandle.style.width = '100%';
      resizeHandle.style.height = '20px';
      resizeHandle.style.position = 'absolute';
      resizeHandle.style.left = '0';
      resizeHandle.style.bottom = '-5px';
      resizeHandle.style.cursor = 'ns-resize';
      resizeHandle.style.zIndex = '100';

      resizeHandle.addEventListener('mousedown', (e: MouseEvent) => {
        e.preventDefault();

        const originalHeight = row.offsetHeight;
        const startY = e.clientY;

        const resizeTable = (e: MouseEvent) => {
          const newHeight = originalHeight + (e.clientY - startY);
          const height = newHeight;
          resizeHandle.style.height = '100px';
          resizeHandle.style.bottom = '-40px';

          row.style.height = `${height}px`;
          row.height = height;
          row.querySelectorAll('td').forEach((td: any) => {
            td.style.height = `${height}px`;
            td.height = height;
          });
          row.querySelectorAll('.resize-handle-col').forEach((handle: any) => {
            handle.style.height = `${height}px`;
            handle.height = height;
          });
        };

        window.addEventListener('mousemove', resizeTable);
        window.addEventListener('mouseup', () => {
          window.removeEventListener('mousemove', resizeTable);
          resizeHandle.style.height = '20px';
          resizeHandle.style.bottom = '-5px';
        });
      });
      row.appendChild(resizeHandle);
    });

    cols.forEach((col: any) => {
      col.style.position = 'relative';
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'resize-handle resize-handle-col';
      resizeHandle.style.width = '10px';
      resizeHandle.style.height = '27px';
      resizeHandle.style.cursor = 'ew-resize';
      resizeHandle.style.position = 'absolute';
      resizeHandle.style.right = '-5px';
      resizeHandle.style.bottom = '0';
      resizeHandle.style.zIndex = '100';

      resizeHandle.addEventListener('mousedown', (e: MouseEvent) => {
        e.preventDefault();
        const originalWidth = col.offsetWidth;
        const startX = e.clientX;

        const resizeTable = (e: MouseEvent) => {
          resizeHandle.style.width = '100px';
          resizeHandle.style.right = '-40px';
          const newWidth = originalWidth + (e.clientX - startX);
          const width = newWidth > 560 ? 560 : newWidth;

          col.style.maxWidth = `${560}px`;
          col.style.width = `${width}px`;
          col.width = width;
        };

        window.addEventListener('mousemove', resizeTable);
        window.addEventListener('mouseup', () => {
          window.removeEventListener('mousemove', resizeTable);
          resizeHandle.style.width = '10px';
          resizeHandle.style.right = '-5px';
        });
      });
      col.appendChild(resizeHandle);
    });
  }

  const reset = () => {
    setTableRow(2);
    setTableCol(3);
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
          title={hideTitles ? '' : t('ajouterTableau')}
          onMouseDown={() => setIsHoveringAction(true)}
          onMouseLeave={() => setIsHoveringAction(false)}
          disabled={!isEditing && !isHoveringAction}
        >
          <i className="mdi mdi-table-plus" />
        </button>
      }
      show={isOpen}
      content={
        <div className="text-editor-link">
          <p>
            {t('tableauDe')} {tableRow}x{tableCol}
          </p>
          {Array(6)
            .fill('row')
            .map((e, r) => (
              <div key={e + r} className="text-editor-row">
                {Array(7)
                  .fill('col')
                  .map((e, c) => (
                    <div
                      key={e + c}
                      onClick={() => {
                        setTableRow(r + 1);
                        setTableCol(c + 1);
                      }}
                      className={`text-editor-col pointer ${isActive(c, r)}`}
                    />
                  ))}
              </div>
            ))}
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

export default TooltipTable;

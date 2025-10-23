import { useTextEditorContext } from '../../context';
import Tooltip from '../Tooltip/Tooltip';

interface ToolbarIconGroupProps {
  icon: string;
  color: string;
  onChange: (color: string) => void;
  title: string;
  splitCollapseEvent?: boolean;
}

const ToolbarIconGroup = ({ icon, color, onChange, title, splitCollapseEvent }: ToolbarIconGroupProps) => {
  const { hideTitles } = useTextEditorContext();

  return (
    <button
      className={`btn btn-option btn-collapse${splitCollapseEvent ? ' split-collapse' : ''}`}
      title={hideTitles || !title ? '' : title}
    >
      <div className="icon-collapse" onClick={() => onChange(color)}>
        <i className={`mdi mdi-format-color-${icon}`} />
        <i className="mdi mdi-color-helper" style={{ color }} />
      </div>

      <Tooltip
        toggle={<i className="mdi mdi-chevron-down" />}
        content={<input className="m-1" type="color" value={color} onChange={e => onChange(e.target.value)} />}
      />
    </button>
  );
};

export default ToolbarIconGroup;

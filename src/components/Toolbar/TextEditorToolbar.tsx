import ToolbarColor from './ToolbarColor';
import ToolbarElement from './ToolbarElement';
import ToolbarImage from './ToolbarImage';
import ToolbarLayout from './ToolbarLayout';
import ToolbarText from './ToolbarText';
import { useTextEditorContext } from '../../context';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface ToolbarColorProps {
  text: React.RefObject<HTMLDivElement>;
}

const TextEditorToolbar = ({ text }: ToolbarColorProps) => {
  const { options } = useTextEditorContext();
  const { windowWidth } = useBreakpoint();

  const handleStyle = (style: string, value: string | undefined = undefined) =>
    document.execCommand(style, false, value);

  return (
    <div className={`text-editor-toolbar ${windowWidth >= 600 ? 'sticky-top' : ''}`}>
      {options.some((o: string) => o === 'text') && <ToolbarText handleStyle={handleStyle} />}
      {options.some((o: string) => o === 'color') && <ToolbarColor handleStyle={handleStyle} />}
      {options.some((o: string) => o === 'image') && <ToolbarImage text={text} />}
      {options.some((o: string) => o === 'element') && <ToolbarElement />}
      {options.some((o: string) => o === 'layout') && <ToolbarLayout text={text} />}
    </div>
  );
};

export default TextEditorToolbar;

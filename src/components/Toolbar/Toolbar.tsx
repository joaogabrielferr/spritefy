import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { StoreType, store } from '../../store';
import { ToolButtonType, toolsType } from '../../types';
import { EventBus } from '../../EventBus';
import { CLEAR_TOP_CANVAS } from '../../utils/constants';
import './toolbar.scss';

const toolButtons = [
  { tool: 'pencil', tooltip: 'Pen tool(P or 1)' },
  { tool: 'eraser', tooltip: 'Eraser tool(E or 2)' },
  { tool: 'paintBucket', tooltip: 'Paint bucket(B or 3)' },
  { tool: 'dropper', tooltip: 'Color picker(D or 4)' },
  { tool: 'line', tooltip: 'Pencil stroke line(L or 5)' },
  { tool: 'rectangle', tooltip: 'Rectangle tool(R or 6)' },
  { tool: 'elipse', tooltip: 'Circle tool(G or 7)' },
  { tool: 'selection', tooltip: 'Selection tool(S or 8)' },
  { tool: 'dithering', tooltip: 'Dithering tool(T or 9)' }
] as ToolButtonType[];

interface ToolbarProps {
  isMobile: boolean;
  isWelcomeModalOpen: boolean;
  isToolbarMobileOpen: boolean;
  toogleToolbarMobile: Dispatch<SetStateAction<boolean>>;
}
export function Toolbar({ isWelcomeModalOpen, isToolbarMobileOpen, isMobile, toogleToolbarMobile }: ToolbarProps) {
  const selectedTool = store((state: StoreType) => state.selectedTool);
  const setSelectedTool = store((state: StoreType) => state.setSelectedTool);

  const handleSetSelectedTool = useCallback(
    (tool: toolsType) => {
      EventBus.getInstance().publish(CLEAR_TOP_CANVAS);
      setSelectedTool(tool);
      toogleToolbarMobile(false);
    },
    [setSelectedTool, toogleToolbarMobile]
  );

  useEffect(() => {
    function checkKeys(event: KeyboardEvent) {
      if (!isWelcomeModalOpen) {
        if (['p', 'P', '1'].indexOf(event.key) > -1) {
          handleSetSelectedTool('pencil');
        } else if (['e', 'E', '2'].indexOf(event.key) > -1) {
          handleSetSelectedTool('eraser');
        } else if (['b', 'B', '3'].indexOf(event.key) > -1) {
          handleSetSelectedTool('paintBucket');
        } else if (['d', 'D', '4'].indexOf(event.key) > -1) {
          handleSetSelectedTool('dropper');
        } else if (['l', 'L', '5'].indexOf(event.key) > -1) {
          handleSetSelectedTool('line');
        } else if (['r', 'R', '6'].indexOf(event.key) > -1) {
          handleSetSelectedTool('rectangle');
        } else if (['g', 'G', '7'].indexOf(event.key) > -1) {
          handleSetSelectedTool('elipse');
        } else if (['s', 'S', '8'].indexOf(event.key) > -1) {
          handleSetSelectedTool('selection');
        } else if (['t', 'T', '9'].indexOf(event.key) > -1) {
          handleSetSelectedTool('dithering');
        }
      }
    }

    document.addEventListener('keydown', checkKeys);

    return function () {
      document.removeEventListener('keydown', checkKeys);
    };
  }, [handleSetSelectedTool, isWelcomeModalOpen, setSelectedTool]);

  return (
    <div className={`toolbar${isMobile ? (isToolbarMobileOpen ? `-mobile open` : `-mobile`) : ''}`}>
      {toolButtons.map((button: ToolButtonType) => {
        return (
          <div key={button.tool}>
            <button
              className="tool-button"
              style={{ backgroundColor: selectedTool === button.tool ? '#3e496b' : '' }}
              onClick={() => handleSetSelectedTool(button.tool)}
              data-tooltip-id="my-tooltip"
              data-tooltip-content={button.tooltip}>
              {button.svg ? (
                button.svg
              ) : (
                <img
                  height={'24px'}
                  style={{ imageRendering: 'pixelated' }}
                  src={`./public/${button.tool}.png`}
                  alt={button.tool}
                />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

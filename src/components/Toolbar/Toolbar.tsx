import { useCallback, useEffect } from 'react';
import { StoreType, store } from '../../store';
import { ToolButtonType, toolsType } from '../../types';
import { EventBus } from '../../EventBus';
import { CLEAR_TOP_CANVAS } from '../../utils/constants';

interface ToolbarProps {
  toolButtons: ToolButtonType[];
  isMobile?: boolean;
  isWelcomeModalOpen: boolean;
}
export function Toolbar({ toolButtons, isWelcomeModalOpen }: ToolbarProps) {
  const selectedTool = store((state: StoreType) => state.selectedTool);
  const setSelectedTool = store((state: StoreType) => state.setSelectedTool);

  const handleSetSelectedTool = useCallback(
    (tool: toolsType) => {
      EventBus.getInstance().publish(CLEAR_TOP_CANVAS);
      setSelectedTool(tool);
    },
    [setSelectedTool]
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
    <div className="teste">
      {toolButtons.map((button: ToolButtonType) => {
        return (
          <div key={button.tool}>
            <button
              className="tool-button"
              style={{ backgroundColor: selectedTool === button.tool ? '#634cb8' : '' }}
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

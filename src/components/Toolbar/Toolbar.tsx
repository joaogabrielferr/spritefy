import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { StoreType, store } from '../../store';
import { ToolButtonType, toolsType } from '../../types';
import { EventBus } from '../../EventBus';
import { CLEAR_TOP_CANVAS } from '../../utils/constants';
import './toolbar.scss';
import { HexColorPicker } from 'react-colorful';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';

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
  const selectedColor = store((state: StoreType) => state.selectedColor);
  const setSelectedColor = store((state: StoreType) => state.setSelectedColor);
  const selectedColorSecondary = store((state: StoreType) => state.selectedColorSecondary);
  const setSelectedColorSecondary = store((state: StoreType) => state.setSelectedColorSecondary);

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [colorPickerPosition, setColorPickerPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const [colorBeingUpdated, setColorBeingUpdated] = useState<'primary' | 'secondary'>('primary');

  const colorButtonRef = useRef<HTMLButtonElement>(null);

  function handleOpenColorPicker(type: 'primary' | 'secondary') {
    const buttonPos = colorButtonRef.current?.getBoundingClientRect();
    setColorPickerPosition({
      top: buttonPos!.top,
      left: buttonPos!.left + 50
    });

    setColorBeingUpdated(type);
    setIsColorPickerOpen((prev) => !prev);
  }

  const handleSetSelectedTool = useCallback(
    (tool: toolsType) => {
      EventBus.getInstance().publish(CLEAR_TOP_CANVAS);
      setSelectedTool(tool);
      toogleToolbarMobile(false);
    },
    [setSelectedTool, toogleToolbarMobile]
  );

  function swapSelectedColors() {
    const aux = selectedColor;
    setSelectedColor(selectedColorSecondary);
    setSelectedColorSecondary(aux);
  }

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
    <>
      <div className={`toolbar${isMobile ? (isToolbarMobileOpen ? `-mobile open` : `-mobile`) : ''}`}>
        {toolButtons.map((button: ToolButtonType) => {
          return (
            <div key={button.tool}>
              <button
                className="tool-button"
                style={{ backgroundColor: selectedTool === button.tool ? '#5e78c7' : '' }}
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
        <div
          style={{
            position: 'relative',
            height: '70px',
            display: 'flex',
            justifyContent: !isMobile ? 'flex-start' : 'center'
          }}>
          {!isMobile ? (
            <button className="color-button option" onClick={swapSelectedColors}>
              <FontAwesomeIcon size="lg" color="#bababa" icon={faShuffle} />
            </button>
          ) : null}
          <button
            className="color-button primary"
            style={{ backgroundColor: selectedColor }}
            data-tooltip-id="my-tooltip"
            data-tooltip-content={'Current primary color(left mouse button)'}
            onClick={() => handleOpenColorPicker('primary')}
            ref={colorButtonRef}
          />
          {!isMobile ? (
            <button
              className="color-button secondary"
              style={{ backgroundColor: selectedColorSecondary }}
              data-tooltip-id="my-tooltip"
              data-tooltip-content={'Current secondary color(right mouse button)'}
              onClick={() => handleOpenColorPicker('secondary')}
              ref={colorButtonRef}
            />
          ) : null}
        </div>
      </div>
      <ToolbarColorPicker
        isColorPickerOpen={isColorPickerOpen}
        setIsColorPickerOpen={setIsColorPickerOpen}
        position={colorPickerPosition}
        toogleToolbarMobile={toogleToolbarMobile}
        type={colorBeingUpdated}></ToolbarColorPicker>
    </>
  );
}

function ToolbarColorPicker({
  isColorPickerOpen,
  setIsColorPickerOpen,
  position,
  toogleToolbarMobile,
  type
}: {
  isColorPickerOpen: boolean;
  setIsColorPickerOpen: Dispatch<SetStateAction<boolean>>;
  position: { top: number; left: number };
  toogleToolbarMobile: Dispatch<SetStateAction<boolean>>;
  type: 'primary' | 'secondary';
}) {
  const selectedColor = store((state: StoreType) => state.selectedColor);
  const setSelectedColor = store((state: StoreType) => state.setSelectedColor);

  const selectedColorSecondary = store((state: StoreType) => state.selectedColorSecondary);
  const setSelectedColorSecondary = store((state: StoreType) => state.setSelectedColorSecondary);

  function handleCloseColorPicker() {
    setIsColorPickerOpen(false);
    toogleToolbarMobile(false);
  }

  return (
    <div
      style={{ display: isColorPickerOpen ? 'block' : 'none', left: position.left, top: position.top < 500 ? 300 : position.top }}
      className="color-picker">
      <div>
        <HexColorPicker
          color={type === 'primary' ? selectedColor : selectedColorSecondary}
          onChange={type === 'primary' ? setSelectedColor : setSelectedColorSecondary}
        />
        <button onClick={handleCloseColorPicker}>select color</button>
      </div>
    </div>
  );
}

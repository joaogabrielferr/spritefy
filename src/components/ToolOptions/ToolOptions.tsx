import React, { ChangeEvent, useCallback, useEffect } from 'react';
import { ToolButtonType, toolsType } from '../../types';
import './toolOptions.scss';
import { store, StoreType } from '../../store';
import { EventBus } from '../../EventBus';
import {
  CLEAR_TOP_CANVAS,
  COPY_SELECTED_DRAW,
  DELETE_SELECTED_DRAW,
  PASTE_SELECTED_DRAW,
  REDO_LAST_DRAW,
  RESET_CANVAS_POSITION,
  UNDO_LAST_DRAW
} from '../../utils/constants';
import { faArrowRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ToolOptionsProps {
  toolButtons: ToolButtonType[];
  isMobile?: boolean;
  isWelcomeModalOpen: boolean;
}

//TODO: refactor this component

export function ToolOptions({ toolButtons, isMobile, isWelcomeModalOpen }: ToolOptionsProps) {
  const selectedTool = store((state: StoreType) => state.selectedTool);
  const setSelectedTool = store((state: StoreType) => state.setSelectedTool);
  const oneToOneRatioElipse = store((state: StoreType) => state.oneToOneRatioElipse);
  const toogleOneToOneRatioElipse = store((state: StoreType) => state.toogleOneToOneRatioElipse);
  const toogleXMirror = store((state: StoreType) => state.toogleXMirror);
  const XMirror = store((state: StoreType) => state.xMirror);
  const toogleYMirror = store((state: StoreType) => state.toogleYMirror);
  const YMirror = store((state: StoreType) => state.yMirror);
  const erasingRightButton = store((state: StoreType) => state.erasingRightButton);
  const penSize = store((state: StoreType) => state.penSize);

  const toogleErasingRightButton = store((state: StoreType) => state.toogleErasingRightButton);

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
        }
      }
    }

    document.addEventListener('keydown', checkKeys);

    return function () {
      document.removeEventListener('keydown', checkKeys);
    };
  }, [handleSetSelectedTool, isWelcomeModalOpen, setSelectedTool]);

  return (
    <div className="toolOptions-wrapper">
      <div className="sidebar-item">
        <div className="tool-options">
          <div className="inner-tool-options ">
            <div style={{ marginTop: '5px', fontSize: '12px', fontWeight: 'bold' }}>{selectedTool.toUpperCase()}</div>
            {['pencil', 'eraser', 'line', 'rectangle', 'elipse', 'selection', 'paintBucket', 'dropper', 'dithering'].find(
              (tool) => tool === selectedTool
            ) && (
              <div>
                <div
                  style={{
                    marginTop: '5px',
                    fontSize: '12px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                  <span>PIXEL SIZE</span>
                  <span>{penSize}</span>
                </div>
                <PenSizeSlider />
              </div>
            )}
            {selectedTool === 'elipse' && (
              <div className="checkbox-wrapper">
                <label className="checkbox">
                  KEEP 1 TO 1 RATIO
                  <input
                    type="checkbox"
                    id="OneToOneRatioElipse"
                    checked={oneToOneRatioElipse}
                    onChange={() => toogleOneToOneRatioElipse()}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
            )}
            {['pencil'].find((tool) => tool === selectedTool) && (
              <div className="checkbox-wrapper">
                <label className="checkbox">
                  MIRROR X AXIS
                  <input type="checkbox" id="MirrorXAxis" checked={XMirror} onChange={() => toogleXMirror()} />
                  <span className="checkmark"></span>
                </label>
              </div>
            )}
            {['pencil'].find((tool) => tool === selectedTool) && (
              <div className="checkbox-wrapper">
                <label className="checkbox">
                  MIRROR Y AXIS
                  <input type="checkbox" id="MirrorXAxis" checked={YMirror} onChange={() => toogleYMirror()} />
                  <span className="checkmark"></span>
                </label>
              </div>
            )}
            {['eraser'].find((tool) => tool === selectedTool) && !isMobile && (
              <div className="checkbox-wrapper">
                <label className="checkbox">
                  ERASE ON RIGHT CLICK
                  <input
                    type="checkbox"
                    id="MirrorXAxis"
                    checked={erasingRightButton}
                    onChange={() => toogleErasingRightButton()}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
            )}
            {['selection'].find((tool) => tool === selectedTool) && (
              <button
                data-tooltip-id="my-tooltip-extra-options"
                data-tooltip-content="Ctrl + C"
                className="extra-options-button"
                onClick={() => {
                  EventBus.getInstance().publish(COPY_SELECTED_DRAW);
                }}>
                COPY SELECTED DRAW
              </button>
            )}
            {['selection'].find((tool) => tool === selectedTool) && (
              <button
                data-tooltip-id="my-tooltip-extra-options"
                data-tooltip-content="Ctrl + V"
                className="extra-options-button"
                onClick={() => {
                  EventBus.getInstance().publish(PASTE_SELECTED_DRAW);
                }}>
                PASTE SELECTED DRAW
              </button>
            )}
            {['selection'].find((tool) => tool === selectedTool) && (
              <button
                data-tooltip-id="my-tooltip-extra-options"
                data-tooltip-content="Del"
                className="extra-options-button"
                onClick={() => {
                  EventBus.getInstance().publish(DELETE_SELECTED_DRAW);
                }}>
                DELETE SELECTED DRAW
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="sidebar-item">
        <button
          data-tooltip-id="my-tooltip-extra-options"
          data-tooltip-content="Ctrl + Z"
          onClick={() => {
            EventBus.getInstance().publish(UNDO_LAST_DRAW);
          }}
          className="extra-options-button">
          <FontAwesomeIcon size="lg" color="#abbbc7" icon={faArrowRotateLeft} />
          UNDO
        </button>
        <button
          data-tooltip-id="my-tooltip-extra-options"
          data-tooltip-content="Ctrl + Y"
          onClick={() => {
            EventBus.getInstance().publish(REDO_LAST_DRAW);
          }}
          className="extra-options-button">
          <FontAwesomeIcon size="lg" color="#abbbc7" icon={faRotateRight} />
          REDO
        </button>
        <button
          data-tooltip-id="my-tooltip-extra-options"
          data-tooltip-content="Ctrl + Space"
          onClick={() => {
            EventBus.getInstance().publish(RESET_CANVAS_POSITION);
          }}
          className="extra-options-button">
          RESET CANVAS POSITION
        </button>
      </div>
    </div>
  );
}

function PenSizeSlider() {
  const penSize = store((state: StoreType) => state.penSize);
  const setPenSize = store((state: StoreType) => state.setPenSize);

  return (
    <>
      <div className="slider-wrapper">
        <div className="slider-range">
          <input
            className="slider"
            type="range"
            min={1}
            max={10}
            value={penSize}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPenSize(+e.target.value)}
            id="range"
          />
        </div>
      </div>
    </>
  );
}

// function ToolOptions({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="tool-options">
//       <div
//         className="inner-tool-options
//       ">
//         {children}
//       </div>
//     </div>
//   );
// }

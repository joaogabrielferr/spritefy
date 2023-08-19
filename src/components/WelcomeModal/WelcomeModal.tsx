import { useState } from 'react';
import '../modal.scss';
import { StoreType, store } from '../../store';

interface WelcomeModalProps {
  onCloseModal: (displaySize: number) => void;
}

const presets = [16, 32, 64, 128, 256, 512];

//TODO: add option to import saved drawing

export function WelcomeModal({ onCloseModal }: WelcomeModalProps) {
  const setIsWelcomeModalOpen = store((state: StoreType) => state.setIsWelcomeModalOpen);

  const [size, setSize] = useState(32);
  const [inputError, setInputError] = useState(false);
  const [validSize, setValidSize] = useState(32);
  function handleSetSize(value: string | number) {
    if (!isNaN(Number(value))) {
      if (+value < 10 || +value > 700) {
        setInputError(true);
      } else {
        setInputError(false);
        setValidSize(+value);
      }

      setSize(+value);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">NEW DRAWING</h3>
        </div>
        <div className="modal-body">
          <p>
            <code>To start a new drawing, enter the width and height for the drawing canvas or select a preset size</code>
          </p>
          <div className="modal-section">
            <div>
              <div className="modal-input">
                <label>WIDTH</label>
                <div className="modal-input-wrapper">
                  <input type="text" value={size} onChange={(e) => handleSetSize(e.target.value)} />
                  <span>
                    <code>px</code>
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="modal-input">
                <label>HEIGHT</label>
                <div className="modal-input-wrapper">
                  <input type="text" value={size} onChange={(e) => handleSetSize(e.target.value)} />
                  <span>
                    <code>px</code>
                  </span>
                </div>
              </div>
              {inputError ? (
                <span style={{ color: 'red' }}>
                  <code>the width and height has to be at least 10px and at most 700px</code>
                </span>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="modal-section">
            <div className="modal-presets">
              {presets.map((preset) => {
                return (
                  <button key={preset} className="modal-presets-item modal-button" onClick={() => onCloseModal(preset)}>
                    {preset}x{preset}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="modal-button" onClick={() => setIsWelcomeModalOpen(false)}>
            Cancel
          </button>
          <button type="button" className="modal-button" onClick={() => onCloseModal(size)} disabled={inputError}>
            Start drawing
          </button>
        </div>
        <div style={{ width: '100%', height: '10px' }}></div>
      </div>
    </div>
  );
}

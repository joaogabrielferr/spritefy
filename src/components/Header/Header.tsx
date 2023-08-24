import { faFile, faBroom, faDownload, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EventBus } from '../../EventBus';
import { START_NEW_DRAWING, CLEAR_DRAWING } from '../../utils/constants';
import './header.scss';
import { createSpriteSheet } from '../../algorithms/createSpriteSheet';
import { store, StoreType } from '../../store';
import { useState } from 'react';

export function Header({ isMobile }: { isMobile: boolean }) {
  const [isTopBarMobileOpen, setIsTopBarMobileOpen] = useState(false);

  const displaySize = store((store: StoreType) => store.displaySize);

  const framesList = store((store: StoreType) => store.framesList);

  function downloadDrawing(close?: boolean) {
    if (close) setIsTopBarMobileOpen(false);
    createSpriteSheet(displaySize, framesList);
  }

  function handleAction(action: string) {
    setIsTopBarMobileOpen(false);
    EventBus.getInstance().publish(action);
  }

  function handleClearDrawing() {
    if (confirm('This action will clear all frames! Do you want to proceed?')) {
      EventBus.getInstance().publish(CLEAR_DRAWING);
    }
  }

  return (
    <>
      <header className="header">
        <div className="inner-header">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: isMobile ? '60%' : '50%'
            }}>
            {!isMobile ? (
              <nav className="topbar-nav">
                <button onClick={() => EventBus.getInstance().publish(START_NEW_DRAWING)}>
                  <FontAwesomeIcon size="lg" color="white" icon={faFile} /> NEW DRAWING
                </button>
                <button onClick={handleClearDrawing}>
                  <FontAwesomeIcon size="lg" color="white" icon={faBroom} />
                  CLEAR DRAWING
                </button>
                <button className="topbar-download" onClick={() => downloadDrawing()}>
                  <FontAwesomeIcon size="lg" color="#abbbc7" icon={faDownload} />
                  SAVE DRAWING
                </button>
                {/* <button>ABOUT</button> */}
              </nav>
            ) : (
              <div onClick={() => setIsTopBarMobileOpen((prev) => !prev)}>
                <FontAwesomeIcon size="2x" color="white" icon={faBars} />
              </div>
            )}
            <div>
              <div className="logo-container">
                <img height={'16px'} style={{ imageRendering: 'pixelated' }} src={`./logo.png`} alt={'logo'} />
                PRITEFY
              </div>
            </div>
          </div>

          <div
            style={{
              width: '2%',
              height: '90%',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}>
            <a
              href="https://github.com/joaogabrielferr/spritefy"
              target="_blank"
              style={{ textDecoration: 'none', color: 'white' }}>
              <img height={'20px'} src={`./github-mark-white.png`} alt={'github icon'} />
            </a>
          </div>
        </div>
      </header>
      <div className={`topbar-mobile ${isTopBarMobileOpen ? 'open' : ''}`}>
        <nav className="topbar-nav">
          <button onClick={() => handleAction(START_NEW_DRAWING)}>
            <FontAwesomeIcon size="lg" color="white" icon={faFile} /> NEW DRAWING
          </button>
          <button onClick={() => handleAction(CLEAR_DRAWING)}>
            <FontAwesomeIcon size="lg" color="white" icon={faBroom} />
            CLEAR DRAWING
          </button>
          <button className="topbar-download" onClick={() => downloadDrawing(true)}>
            <FontAwesomeIcon size="lg" color="#abbbc7" icon={faDownload} />
            SAVE DRAWING
          </button>
        </nav>
      </div>
    </>
  );
}

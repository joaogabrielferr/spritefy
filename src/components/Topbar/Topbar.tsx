import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './topbar.scss';
import { faArrowRotateLeft, faBars, faBroom, faDownload, faFile, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { EventBus } from '../../EventBus';
import { CLEAR_DRAWING, START_NEW_DRAWING } from '../../utils/constants';
import { store, StoreType } from '../../store';
import { createSpriteSheet } from '../../algorithms/createSpriteSheet';
import { useState } from 'react';

export function Topbar({ isMobile }: { isMobile: boolean }) {
  const displaySize = store((store: StoreType) => store.displaySize);

  const framesList = store((store: StoreType) => store.framesList);

  const frameRate = store((store: StoreType) => store.frameRate);

  const [isTopBarMobileOpen, setIsTopBarMobileOpen] = useState(false);

  function downloadDrawing(close?: boolean) {
    if (close) setIsTopBarMobileOpen(false);
    createSpriteSheet(displaySize, framesList);
  }

  return (
    <>
      <div className="topbar">
        <div className="inner-topbar">
          {!isMobile ? (
            <nav className="topbar-nav">
              <button onClick={() => EventBus.getInstance().publish(START_NEW_DRAWING)}>
                <FontAwesomeIcon size="lg" color="#abbbc7" icon={faArrowRotateLeft} /> UNDO
              </button>
              <button onClick={() => EventBus.getInstance().publish(CLEAR_DRAWING)}>
                <FontAwesomeIcon size="lg" color="#abbbc7" icon={faRotateRight} /> REDO
              </button>
              <button className="topbar-download" onClick={() => downloadDrawing()}>
                RESET CANVAS POSITION
              </button>
            </nav>
          ) : (
            <div onClick={() => setIsTopBarMobileOpen((prev) => !prev)}>
              <FontAwesomeIcon size="2x" color="white" icon={faBars} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

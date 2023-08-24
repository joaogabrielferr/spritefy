import { Dispatch, SetStateAction } from 'react';
import { faGear, faArrowRotateLeft, faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EventBus } from '../../EventBus';
import { UNDO_LAST_DRAW, REDO_LAST_DRAW, RESET_CANVAS_POSITION } from '../../utils/constants';
import { StoreType, store } from '../../store';
import './mobileMenu.scss';

interface MobileMenuProps {
  setIsToolbarMobileOpen: Dispatch<SetStateAction<boolean>>;
  setIsLeftSidebarMobileOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightSidebarMobileOpen: Dispatch<SetStateAction<boolean>>;
}

export function MobileMenu(props: MobileMenuProps) {
  const selectedTool = store((store: StoreType) => store.selectedTool);

  return (
    <div className="mobile-options">
      <div className="mobile-row row-1">
        <button onClick={() => props.setIsToolbarMobileOpen(true)}>
          <img height={'24px'} style={{ imageRendering: 'pixelated' }} src={`./public/${selectedTool}.png`} alt={selectedTool} />
        </button>
        <button onClick={() => props.setIsLeftSidebarMobileOpen(true)}>
          <img height={'13px'} style={{ imageRendering: 'pixelated' }} src={`./public/${selectedTool}.png`} alt={selectedTool} />
          <FontAwesomeIcon size="lg" color="black" icon={faGear} />
        </button>
        {/* <button>COLOR</button> */}
        <button onClick={() => props.setIsRightSidebarMobileOpen(true)}>FRAMES</button>
      </div>
      <div className="mobile-row row-2">
        <button onClick={() => EventBus.getInstance().publish(UNDO_LAST_DRAW)}>
          <FontAwesomeIcon size="lg" color="black" icon={faArrowRotateLeft} />
        </button>
        <button onClick={() => EventBus.getInstance().publish(REDO_LAST_DRAW)}>
          <FontAwesomeIcon size="lg" color="black" icon={faArrowRotateRight} />
        </button>
        <button onClick={() => EventBus.getInstance().publish(RESET_CANVAS_POSITION)}>RESET POSITION</button>
      </div>
    </div>
  );
}

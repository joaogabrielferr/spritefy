import { Dispatch, SetStateAction } from 'react';
import './sideBar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  children: React.ReactNode;
  isMobile: boolean;
  isOpen: boolean;
  side: 'left' | 'right';
  toogleSidebarOnMobile: Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({ children, isMobile, isOpen, toogleSidebarOnMobile, side }: SidebarProps) {
  return (
    <div className={`sidebar${isMobile ? (isOpen ? `-mobile open ${side}` : `-mobile ${side}`) : ''}`}>
      {isMobile ? (
        <div className="sidebar-close-button-mobile">
          <button onClick={() => toogleSidebarOnMobile(false)}>
            CLOSE <FontAwesomeIcon size="lg" color="white" icon={faXmark} />
          </button>
        </div>
      ) : (
        ''
      )}
      {children}
    </div>
  );
}

import { Dispatch, SetStateAction } from 'react';
import './sideBar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  children: React.ReactNode;
  isMobile: boolean;
  isOpen: boolean;
  toogleSidebarOnMobile: Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({ children, isMobile, isOpen, toogleSidebarOnMobile }: SidebarProps) {
  console.log(isMobile);
  return (
    <div className={`sidebar${isMobile ? (isOpen ? '-mobile open' : '-mobile') : ''}`}>
      {isMobile ? (
        <div className="sidebar-close-button-mobile">
          <button onClick={() => toogleSidebarOnMobile(!isOpen)}>
            <FontAwesomeIcon size="lg" color="white" icon={faXmark} />
          </button>
        </div>
      ) : (
        ''
      )}
      {children}
    </div>
  );
}

import { Dispatch, SetStateAction } from 'react';
import './sideBar.scss';

interface SidebarProps {
  children: React.ReactNode;
  isMobile: boolean;
  isOpen: boolean;
  toogleSidebarOnMobile: Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({ children, isMobile, isOpen, toogleSidebarOnMobile }: SidebarProps) {
  return (
    <div className={`sidebar${isMobile ? (isOpen ? '-mobile open' : '-mobile') : ''}`}>
      <span> &nbsp;</span>
      {isMobile ?? (
        <div>
          <button onClick={() => toogleSidebarOnMobile(!isOpen)}>X</button>
        </div>
      )}
      {children}
    </div>
  );
}

import { Dispatch, SetStateAction } from 'react';
import './sideBar.scss';

interface SidebarProps {
  children: React.ReactNode;
  height: number;
  isMobile: boolean;
  isOpen: boolean;
  toogleSidebarOnMobile: Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({ children, isMobile, height, isOpen, toogleSidebarOnMobile }: SidebarProps) {
  return (
    <div
      style={{ height: !isMobile ? height - 45 : '100%' }}
      className={`sidebar${isMobile ? (isOpen ? '-mobile open' : '-mobile') : ''}`}>
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

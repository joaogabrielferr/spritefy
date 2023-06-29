import './sideBar.scss';

interface SidebarProps {
  children: React.ReactNode;
  height: number;
  width: number;
}

export function Sidebar({ children, height, width }: SidebarProps) {
  return (
    <div
      style={{
        height: height
      }}
      className="sidebar">
      {children}
    </div>
  );
}

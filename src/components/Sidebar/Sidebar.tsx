import './sideBar.scss';

interface SidebarProps {
  children: React.ReactNode;
  height: number;
  width: number;
}

export function Sidebar({ children, height, width }: SidebarProps) {
  function foo() {
    //
  }

  return (
    <div
      style={{
        height: height,
        width: width
      }}
      className="sidebar">
      {children}
    </div>
  );
}

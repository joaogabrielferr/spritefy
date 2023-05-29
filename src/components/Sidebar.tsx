import './sideBar.css';

interface SidebarProps{
    children: React.ReactNode;
    width : number | string;
    height : number;
    marginTop? : number | string;
}

export function Sidebar({children,width,height,marginTop} : SidebarProps){

    return <div className = "sideBar" style = {{height:height,width:width,marginTop:marginTop}}>
        {children}
    </div>

}
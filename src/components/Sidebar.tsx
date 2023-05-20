import '../styles/sideBar.css'


interface SidebarProps{
    children: React.ReactNode;
    width : number | string;
    height : number;
}

export function Sidebar({children,width,height} : SidebarProps){

    return <div className = "sideBar" style = {{height:height,width:width}}>
        {children}
    </div>

}
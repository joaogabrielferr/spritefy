import './sideBar.css';

interface SidebarProps{
    children: React.ReactNode;
    height : number;
    width: number;
}

export function Sidebar({children,height,width} : SidebarProps){

    return <div style = {{width:width,height:height,display:'flex',justifyContent:'flex-start',alignItems:'center',flexDirection:'column',backgroundColor:'rgb(38, 45, 61)'}}>
        {children}
    </div>

}
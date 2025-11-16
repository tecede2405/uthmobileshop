import "./style.css";
import Header from '../../components/header';
import SidebarNav from '../../components/navbar';
import FooterBar from '../../components/footer';
import { Outlet } from 'react-router-dom';
import {useState} from "react";
 
function Layout() {
    const [showSidebar, setShowSidebar] = useState(false);

    return(
        <>
        <Header onToggleSidebar={() => setShowSidebar(true)} />
        <div className="container main-content">
            <SidebarNav visible={showSidebar} onClose={() => setShowSidebar(false)} />
            <Outlet />
        </div>
        <FooterBar />
        </>
    )
}

export default Layout;
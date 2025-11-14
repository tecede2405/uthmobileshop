import "./style.css";
import Header from '../../components/header';
import SidebarNav from '../../components/navbar';
import FooterBar from '../../components/footer';
import { Outlet } from 'react-router-dom';

function Layout() {

    return(
        <>
        <Header />
        <div className="container main-content">
            <SidebarNav />
            <Outlet />
        </div>
        <FooterBar />
        </>
    )
}

export default Layout;
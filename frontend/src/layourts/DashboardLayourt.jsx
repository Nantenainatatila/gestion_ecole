import Navbar from "../composants/Navbar";
import { Outlet } from "react-router-dom";
import logo from "../assets/logo.jpg";

function DashboardLayourt () {
    return (
        <div>
            <Navbar />
            <img src={logo} alt="Logo" className="logo-fixed" />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
export default DashboardLayourt;
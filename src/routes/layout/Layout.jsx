import { Outlet } from "react-router"
import "./layout.css"
import { Navbar } from "../../components/navbar/Navbar"

export const Layout = () => {
    return <div className="main-container">
        <Navbar />
        <div className="outlet-container">
            <Outlet />
        </div>
    </div>
}
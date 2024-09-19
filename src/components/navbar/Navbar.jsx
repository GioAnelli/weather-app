import { useLocation, useNavigate } from "react-router-dom";
import MyLocationAutoComplete from "../atom/myLocationAutoComplete";
import "./navbar.css";
import { IoMdPartlySunny } from "react-icons/io";
import { useEffect, useState } from "react";
import SettingSelector from "./settings/Settings";
import Button from "@mui/material/Button";

export const Navbar = () => {
  const location = useLocation();
  const checkHome = () => location.pathname === "/";
  const [isHome, setIsHome] = useState(checkHome());
  const navigate = useNavigate();

  useEffect(() => {
    setIsHome(checkHome());
  }, [location]);

  return (
    <nav className="nav-bar">
      <div className="first-column">
        <IoMdPartlySunny style={{ width: "50px", height: "50px" }} />
        <h1>Easy Weather</h1>
      </div>
      <div className="second-column">
        {!isHome ? <MyLocationAutoComplete /> : ""}
      </div>
      <div class="third-column">
        <Button
          variant="text"
          sx={{ color: "var(--black)" }}
          onClick={() => navigate("/")}
        >
          Home
        </Button>
        <Button
          variant="text"
          sx={{ color: "var(--black)" }}
          onClick={() => navigate("/sub")}
        >
          Weather in your Location
        </Button>
        <SettingSelector />
      </div>
    </nav>
  );
};

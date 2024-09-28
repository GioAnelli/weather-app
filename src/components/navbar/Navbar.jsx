import { useLocation, useNavigate } from "react-router-dom";
import MyLocationAutoComplete from "../atom/myLocationAutoComplete";
import "./navbar.css";
import { IoMdPartlySunny } from "react-icons/io";
import { useEffect, useState, useCallback } from "react";
import SettingSelector from "./settings/Settings";
import Button from "@mui/material/Button";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Usa useCallback per evitare che le funzioni vengano ricreate a ogni render
  const checkHome = useCallback(
    () => location.pathname === "/",
    [location.pathname]
  );
  const checkSubHome = useCallback(
    () => location.pathname === "/sub",
    [location.pathname]
  );

  const [isHome, setIsHome] = useState(checkHome());
  const [isSubHome, setIsSubHome] = useState(checkSubHome());

  useEffect(() => {
    setIsHome(checkHome());
    setIsSubHome(checkSubHome());
  }, [location, checkHome, checkSubHome]);

  return (
    <nav className="nav-bar">
      <div className="first-column">
        <IoMdPartlySunny style={{ width: "50px", height: "50px" }} />
        <h1>Easy Weather</h1>
      </div>
      <div className="second-column">
        {!isHome ? <MyLocationAutoComplete /> : ""}
      </div>
      <div className="third-column">
        <Button
          variant="text"
          sx={{ color: "var(--black)" }}
          onClick={() => navigate("/")}
        >
          Home
        </Button>
        {!isSubHome ? (
          <Button
            variant="text"
            sx={{ color: "var(--black)" }}
            onClick={() => navigate("/sub")}
          >
            Weather in your Location
          </Button>
        ) : (
          ""
        )}

        <SettingSelector />
      </div>
    </nav>
  );
};

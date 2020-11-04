import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "react-router-dom";

function Header() {
  return (
    <AppBar position="static">
      <Toolbar className="header-toolbar">
        <h2>Film Information</h2>
        <Link id="navlink" to="/">
          Home
        </Link>
        <Link id="navlink" to="/reviews">
          Reviews
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

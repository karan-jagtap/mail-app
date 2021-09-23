import React, { Component } from "react";
import "./Navbar.css";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: "",
    };
  }

  onLogoutClick = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("picture");
    this.props.history.replace("/login");
  };

  onMenuItemClick = (e) => {
    e.preventDefault();
    const { id } = e.target;
    this.setState({ active: id });
    if (id === "new") {
      this.props.history.replace("/");
    } else {
      this.props.onMenuItemClick(id);
    }
  };

  render() {
    return (
      <div className="navbar navbar-dark bg-dark navbar-container">
        <div className="container">
          {/* Start - Navbar Brand */}
          <div
            id="new"
            className="navbar-brand navbar-header-container"
            href="#"
            onClick={this.onMenuItemClick}
          >
            <img
              src="app_logo.png"
              alt="App Logo"
              width="36"
              height="36"
              className="navbar-brand-img"
            />
            <span className="navbar-header-appname">
              <span className="header-highlight-text">E</span>-Mail
              <span className="header-highlight-text">io</span>
            </span>
          </div>
          {/* End - Navbar Brand */}

          <div
            className="navbar-nav"
            style={{
              marginLeft: "auto",
              position: "relative",
              flexDirection: "row",
            }}
          >
            <button
              id="draft"
              className={
                this.state.active === "draft"
                  ? "nav-link nav-link-btn nav-link-btn-active"
                  : "nav-link nav-link-btn"
              }
              style={{ marginRight: 20, cursor: "pointer" }}
              onClick={this.onMenuItemClick}
            >
              Drafts
            </button>
            <button
              id="sent"
              className={
                this.state.active === "sent"
                  ? "nav-link nav-link-btn nav-link-btn-active"
                  : "nav-link nav-link-btn"
              }
              style={{ marginRight: 20, cursor: "pointer" }}
              onClick={this.onMenuItemClick}
            >
              Sent Emails
            </button>
            <div className="dropstart">
              <img
                src={sessionStorage.getItem("picture")}
                alt="dp"
                className="rounded-icon"
                data-bs-toggle="dropdown"
              />
              <div
                className="dropdown-menu"
                style={{ position: "absolute", padding: 0 }}
              >
                <div className="dropdown-container">
                  <img
                    src={sessionStorage.getItem("picture")}
                    alt="dp"
                    className="rounded-icon-inner"
                  />
                  <div className="my-2 mx-3" style={{ cursor: "alias" }}>
                    {sessionStorage.getItem("name")}
                  </div>
                  <div
                    className="mx-3"
                    style={{
                      textDecoration: "underline",
                      color: "blue",
                      cursor: "alias",
                    }}
                  >
                    {sessionStorage.getItem("email")}
                  </div>
                  <button className="logout-btn" onClick={this.onLogoutClick}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;

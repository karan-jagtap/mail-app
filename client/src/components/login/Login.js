import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";
import "./Login.css";

class Login extends Component {
  componentDidMount() {}

  onGoogleSuccess = (res) => {
    console.log("onGoogleSuccess() - res : ", res);
    axios
      .post("/api/login", { tokenId: res.tokenId })
      .then((response) => {
        console.log("onGoogleSuccess() - axios response : ", response);
        if (response.data.success) {
          const { email, name, picture } = response.data;
          localStorage.setItem("token", res.tokenId);
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("name", name);
          sessionStorage.setItem("picture", picture);
          this.props.history.replace("/");
        }
      })
      .catch((err) => {
        console.log("onGoogleSuccess() - axios err : ", err);
      });
  };
  onGoogleFailure = (res) => {
    console.log("onGoogleFailure() - res : ", res);
  };

  render() {
    return (
      <div id="login-component">
        <div className="row custom-row">
          <div className="col-md-6 custom-column left-column">
            <img className="app-logo" src="app_logo.png" alt="App Logo" />
            <div className="header-app-name">
              <span className="header-highlight-text">E</span>-Mail
              <span className="header-highlight-text">io</span>
            </div>
            <div className="header-tagline">
              A custom email sending{" "}
              <span className="header-highlight-text">platform</span>
            </div>
          </div>
          <div className="col-md-6 custom-column">
            <div className="header-message">
              Sign In using Google to send emails
            </div>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText="Login using Google"
              cookiePolicy={"single_host_origin"}
              onSuccess={this.onGoogleSuccess}
              onFailure={this.onGoogleFailure}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

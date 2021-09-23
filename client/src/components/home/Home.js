import axios from "axios";
import React, { Component } from "react";
import SWAL from "sweetalert2";
import DraftEmail from "../draftEmail/DraftEmail";
import FormEmail from "../formEmail/FormEmail";
import Navbar from "../navbar/Navbar";
import SentEmail from "../sentEmail/SentEmail";
import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      activeMenu: "new", //'new','sent','draft'
    };
  }

  componentDidMount() {
    if (localStorage.getItem("token") === null) {
      this.props.history.replace("/login");
    } else {
      const self = this;
      axios
        .post("/api/verify_token", { tokenId: localStorage.getItem("token") })
        .then((res) => {
          console.log("/verify_token : res : ", res);
          const { success, message_code, message_text, email, name, picture } =
            res.data;
          if (!success) {
            if (message_code === "token_expired") {
              SWAL.fire({
                icon: "error",
                title: "Session Expired",
                text: message_text,
                showConfirmButton: true,
                confirmButtonText: "Go to Login",
                confirmButtonColor: "#c6342c",
                allowOutsideClick: false,
                preConfirm: () => {
                  localStorage.removeItem("token");
                  sessionStorage.removeItem("email");
                  sessionStorage.removeItem("name");
                  sessionStorage.removeItem("picture");
                  self.props.history.replace("/login");
                },
              });
            }
          } else {
            sessionStorage.setItem("email", email);
            sessionStorage.setItem("name", name);
            sessionStorage.setItem("picture", picture);
            axios.defaults.headers.common["authorization"] =
              localStorage.getItem("token");
          }
          this.setState({ loading: false });
        })
        .catch((err) => {
          console.log("/verify_token : err : ", err);
          this.setState({ loading: false });
        });
    }
  }

  onMenuItemClick = (id) => {
    this.setState({ activeMenu: id });
  };

  render() {
    let pageToDisplay = <FormEmail {...this.props} />;
    if (this.state.activeMenu === "draft") {
      pageToDisplay = <DraftEmail {...this.props} />;
    } else if (this.state.activeMenu === "sent") {
      pageToDisplay = <SentEmail {...this.props} />;
    }

    return (
      <div style={{ minHeight: "100vh" }}>
        <Navbar {...this.props} onMenuItemClick={this.onMenuItemClick} />
        {!this.state.loading && pageToDisplay}
      </div>
    );
  }
}

export default Home;

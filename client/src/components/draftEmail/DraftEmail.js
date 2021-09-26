import axios from "axios";
import React, { Component } from "react";
import FormEmail from "../formEmail/FormEmail";
import "./DraftEmail.css";

const Swal = require("sweetalert2");
class DraftEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      activeDraft: null,
    };
  }

  componentDidMount() {
    const self = this;
    axios
      .post("/email/drafts", { from: sessionStorage.getItem("email") })
      .then((res) => {
        console.log("/email/drafts - res - ", res);
        const { success, data, message_code, message_text } = res.data;
        if (success) {
          this.setState({
            loading: false,
            activeDraft: data[0],
            data: [
              ...data.map((item, i) => {
                return {
                  ...item,
                  active: i === 0 ? true : false,
                };
              }),
            ],
          });
        } else {
          if (message_code === "token_expired") {
            Swal.fire({
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
          } else {
            Swal.fire({
              icon: "error",
              title: "Server Error",
              text: "Something went wrong. Please try again later.",
              showConfirmButton: true,
              confirmButtonText: "Okay",
              confirmButtonColor: "#c6342c",
            });
          }
        }
      })
      .catch((err) => {
        console.log("/email/drafts - err - ", err);
      });
  }

  onMenuItemClick = (e, id) => {
    let foundIndex = -1;
    let temp = [
      ...this.state.data.map((item, i) => {
        let active = false;
        if (item._id === id) {
          foundIndex = i;
          active = true;
        }
        return {
          ...item,
          active,
        };
      }),
    ];
    this.setState({
      data: temp,
      activeDraft: temp[foundIndex],
    });
  };

  render() {
    const loadignLayout = (
      <div className="loading-parent">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

    const mainLayout = (
      <div id="draft-email" className="parent">
        {this.state.data.length > 0 ? (
          <>
            {/* Start - Left Menu */}
            <div className="menu">
              {this.state.data.map((item) => (
                <div
                  key={item._id}
                  className={item.active ? "menu-item active" : "menu-item"}
                  onClick={(e) => this.onMenuItemClick(e, item._id)}
                >
                  <span className="fit-text-content to">
                    {item.to.length < 0 || item.to[0] === ""
                      ? "No Email"
                      : item.to}
                  </span>
                  <span className="fit-text-content subject">
                    {item.subject === "" ? "No Subject" : item.subject}
                  </span>
                </div>
              ))}
            </div>
            {/* End - Left Menu */}
            <div className="form-email">
              <FormEmail from="draft" data={this.state.activeDraft} />
            </div>
          </>
        ) : (
          <div className="no-data-found-msg">
            <i
              className="bi bi-exclamation-square"
              style={{ color: "red", marginRight: 20 }}
            ></i>
            No Data Found
          </div>
        )}
      </div>
    );

    if (this.state.loading) {
      return loadignLayout;
    }
    return mainLayout;
  }
}

export default DraftEmail;

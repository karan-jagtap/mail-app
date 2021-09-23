import React, { Component } from "react";
import axios from "axios";
import "./FormEmail.css";
import Swal from "sweetalert2";

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const SUBJECT_REGEX = /[a-zA-Z0-9]+/;
const ERRORS = [
  // start - empty errors
  {
    id: "to_empty",
    message: "Please enter To email address",
  },
  {
    id: "cc_empty",
    message: "Please enter Cc email address",
  },
  {
    id: "bcc_empty",
    message: "Please enter Bcc email address",
  },
  {
    id: "subject_empty",
    message: "Please enter subject",
  },
  {
    id: "body_empty",
    message: "Please enter body",
  },
  // end - empty errors

  // start - valid email errors
  {
    id: "to_invalid",
    message: "Please enter valid email address for 'To'",
  },
  {
    id: "cc_invalid",
    message: "Please enter valid email address for 'Cc'",
  },
  {
    id: "bcc_invalid",
    message: "Please enter valid email address for 'Bcc'",
  },
  {
    id: "subject_invalid",
    message: "Please enter valid subject",
  },
  // end - valid email errors
];

class FormEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ccLayoutVisible: false,
      bccLayoutVisible: false,
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      body: "",
      files: [],
      errors: [],
      showErrorBlock: false,
      isUploadInProgres: false,
      // disableSubmitButton:false,
      successUpload: 0,
      failedUpload: 0,
      decodedFiles: [],
      originalFiles: [],
    };

    this.bodyRef = React.createRef();
    this.fileRef = React.createRef();
  }

  handleOnCcBccClick = (e) => {
    e.preventDefault();
    const { id } = e.target;
    console.log(id);
    if (id === "cc-text") {
      console.log("inside cc-text");
      this.setState((prevState) => ({
        ccLayoutVisible: !prevState.ccLayoutVisible,
      }));
    } else if (id === "bcc-text") {
      console.log("inside bcc-text");
      this.setState((prevState) => ({
        bccLayoutVisible: !prevState.bccLayoutVisible,
      }));
    }
  };

  onInputChange = (e) => {
    e.preventDefault();
    const { name, value, id, innerHTML } = e.target;
    if (id === "body-block") {
      this.setState({ body: innerHTML });
    } else {
      this.setState({
        [name]: value,
      });
    }
  };

  onSendEmailClick = (e) => {
    e.preventDefault();
    if (this.validate()) {
      this.apiSendEmail();
    }
  };

  validate = () => {
    const { to, cc, bcc, subject, body, ccLayoutVisible, bccLayoutVisible } =
      this.state;
    let showErrorBlock = false,
      toEmptyFlag = false,
      ccEmptyFlag = false,
      bccEmptyFlag = false,
      subjectEmptyFlag = false;
    let errors = [];
    // if empty
    if (to === "") {
      console.log("inside");
      errors.push("to_empty");
      showErrorBlock = true;
      toEmptyFlag = true;
    }
    if (cc === "" && ccLayoutVisible) {
      errors.push("cc_empty");
      showErrorBlock = true;
      ccEmptyFlag = true;
    }
    if (bcc === "" && bccLayoutVisible) {
      errors.push("bcc_empty");
      showErrorBlock = true;
      bccEmptyFlag = true;
    }
    if (subject === "") {
      errors.push("subject_empty");
      showErrorBlock = true;
      subjectEmptyFlag = true;
    }
    if (body === "") {
      errors.push("body_empty");
      showErrorBlock = true;
    }

    // invalid email
    if (!this.validateEmail(to.split(",")) && !toEmptyFlag) {
      errors.push("to_invalid");
      showErrorBlock = true;
    }
    if (!this.validateEmail(cc.split(",")) && !ccEmptyFlag && ccLayoutVisible) {
      errors.push("cc_invalid");
      showErrorBlock = true;
    }
    if (
      !this.validateEmail(bcc.split(",")) &&
      !bccEmptyFlag &&
      bccLayoutVisible
    ) {
      errors.push("bcc_invalid");
      showErrorBlock = true;
    }

    //invalid subject, atleast 1 digit or letter should be present
    if (!SUBJECT_REGEX.test(subject) && !subjectEmptyFlag) {
      errors.push("subject_invalid");
      showErrorBlock = true;
    }
    this.setErrorState(errors, showErrorBlock);
    return !showErrorBlock;
  };

  validateEmail = (arr) => {
    let flag = true;
    for (let i = 0; i < arr.length; i++) {
      if (!EMAIL_REGEX.test(arr[i])) {
        flag = false;
        return;
      }
    }
    return flag;
  };

  setErrorState = (ids, showErrorBlock) => {
    this.setState({
      errors: [...ERRORS.filter((e) => ids.includes(e.id))],
      showErrorBlock,
    });
  };

  apiSendEmail = () => {
    const self = this;
    const data = {
      from: sessionStorage.getItem("email"),
      to: this.state.to,
      cc: this.state.cc,
      bcc: this.state.bcc,
      subject: this.state.subject,
      body: this.state.body,
      files:
        this.state.decodedFiles.length > 0
          ? this.state.decodedFiles.map((file) => file.url)
          : "",
    };
    axios
      .post("email/send", data)
      .then((res) => {
        console.log("/send-email - res - ", res);
        const { success, message_text } = res.data;
        if (success) {
          // Swal.fire({
          //   icon: "success",
          //   title: "Email Sent",
          //   text: "Email sent successfully.",
          //   showConfirmButton: true,
          //   confirmButtonText: "Okay",
          //   confirmButtonColor: "#c6342c",
          //   allowOutsideClick: false,
          //   preConfirm: () => {
          //     self.clearState();
          //   },
          // });
        } else {
          // Swal.fire({
          //   icon: "error",
          //   title: "Session Expired",
          //   text: message_text,
          //   showConfirmButton: true,
          //   confirmButtonText: "Go to Login",
          //   confirmButtonColor: "#c6342c",
          //   allowOutsideClick: false,
          //   preConfirm: () => {
          //     localStorage.removeItem("token");
          //     sessionStorage.removeItem("email");
          //     sessionStorage.removeItem("name");
          //     sessionStorage.removeItem("picture");
          //     self.props.history.replace("/login");
          //   },
          // });
        }
      })
      .catch((err) => console.log("/send-email - err - ", err));
  };

  clearState = () => {
    this.setState({
      ccLayoutVisible: false,
      bccLayoutVisible: false,
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      body: "",
      errors: [],
      showErrorBlock: false,
    });
    // this.bodyRef.current.innerHTML = "";
  };

  onFileChoose = (e) => {
    e.preventDefault();
    const filesArr = Object.entries(e.target.files);
    this.setState(
      { decodedFiles: [], originalFiles: filesArr.map((item) => item[1]) },
      () => {
        filesArr.forEach((f, i) => {
          console.log(`file[${i}] - `, f[1].name);
          const reader = new FileReader();
          reader.readAsDataURL(f[1]);
          reader.onloadend = () => {
            this.setState(
              {
                decodedFiles: [
                  ...this.state.decodedFiles,
                  {
                    fileName: f[1].name,
                    isUploadInProgres: true,
                    data: reader.result,
                    success: false,
                  },
                ],
              },
              () => {
                this.uploadDataToCloudinary(f[1].name, reader.result);
              }
            );
          };
        });
      }
    );
  };

  onDeleteAttachment = (publicId = "", fileName) => {
    if (publicId !== "") {
      console.log("publicId - ", publicId);
      axios
        .post("/email/delete", { publicId, fileName })
        .then((res) => {
          console.log("/email/delete - res - ", res);
          if (res.data.success) {
            this.setState({
              decodedFiles: [
                ...this.state.decodedFiles.filter(
                  (f) => f.fileName !== res.data.fileName
                ),
              ],
            });
          }
        })
        .catch((err) => {
          console.log("/email/delete - err - ", err);
        });
    }
  };

  uploadDataToCloudinary = (fileName, data) => {
    const axiosData = {
      fileName,
      data,
    };
    axios
      .post("/email/upload", axiosData)
      .then((res) => {
        console.log("/email/upload - res - ", res.data);
        const { fileName, success, url, message, publicId } = res.data;
        if (success) {
          let temp = [...this.state.decodedFiles];
          let index = temp.findIndex((f) => {
            return f.fileName === fileName;
          });
          temp[index] = {
            ...temp[index],
            isUploadInProgres: false,
            success,
            url,
            publicId,
          };
          this.setState({
            decodedFiles: [...temp],
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "File Upload Error",
            text: message,
            // showConfirmButton: true,
            // confirmButtonText: "Okay",
            // confirmButtonColor: "#c6342c",
            // allowOutsideClick: false,
          });
        }
      })
      .catch((err) => console.log("/email/upload err - ", err));
  };

  render() {
    const ccLayout = (
      <div className="mb-3">
        <label htmlFor="cc_email" className="form-label form-label-sm">
          Cc
        </label>
        <input
          type="email"
          className="form-control form-control-sm"
          id="cc_email"
          name="cc"
          autoComplete
          aria-describedby="emailHelp"
          onChange={this.onInputChange}
          value={this.state.cc}
        />
        <div id="emailHelp" className="form-text">
          Enter comma separated emails (,).
        </div>
      </div>
    );

    const bccLayout = (
      <div className="mb-3">
        <label htmlFor="bcc_email" className="form-label form-label-sm">
          Bcc
        </label>
        <input
          type="email"
          className="form-control form-control-sm"
          id="bcc_email"
          name="bcc"
          aria-describedby="emailHelp"
          autoComplete
          value={this.state.bcc}
          onChange={this.onInputChange}
        />
        <div id="emailHelp" className="form-text">
          Enter comma separated emails (,).
        </div>
      </div>
    );

    return (
      <div id="form-email" className="card">
        <div className="card-header custom-card-header">New Email</div>
        <div className="card-body">
          {this.state.showErrorBlock && (
            <ul className="errors-container">
              {this.state.errors.length > 0 &&
                this.state.errors.map((error) => (
                  <li className="error-item">{error.message}</li>
                ))}
            </ul>
          )}
          <form onSubmit={this.onSendEmailClick} encType="multipart/form-data">
            {/* Start - To block */}
            <div className="mb-3">
              <div className="to-cc-bcc-container">
                <label htmlFor="to_email" className="form-label form-label-sm">
                  To
                </label>
                <div>
                  <span
                    id="cc-text"
                    className="cc-bcc-text"
                    onClick={this.handleOnCcBccClick}
                  >
                    Cc
                  </span>
                  <span
                    id="bcc-text"
                    className="cc-bcc-text"
                    onClick={this.handleOnCcBccClick}
                  >
                    Bcc
                  </span>
                </div>
              </div>
              <input
                type="text"
                className="form-control form-control-sm"
                id="to_email"
                name="to"
                value={this.state.to}
                aria-describedby="emailHelp"
                onChange={this.onInputChange}
              />
              <div id="emailHelp" className="form-text">
                Enter comma separated emails (,).
              </div>
            </div>
            {/* End - To block */}

            {/* Start - Cc Block */}
            {this.state.ccLayoutVisible && ccLayout}
            {/* End - Cc Block */}

            {/* Start - Bcc Block */}
            {this.state.bccLayoutVisible && bccLayout}
            {/* End - Bcc Block */}

            {/* Start - Subject Block */}
            <div className="mb-3">
              <label
                htmlFor="subject-block"
                className="form-label form-label-sm"
              >
                Subject
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="subject-block"
                name="subject"
                autoComplete="off"
                value={this.state.subject}
                onChange={this.onInputChange}
              />
            </div>
            {/* End - Subject Block */}

            {/* Start - Body Block */}
            <div className="mb-3">
              <label htmlFor="body-block" className="form-label form-label-sm">
                Body
              </label>
              <div
                ref={this.bodyRef}
                id="body-block"
                name="body"
                className="form-control body-block"
                placeholder="Start typing..."
                contentEditable
                onInput={this.onInputChange}
              />
            </div>
            {/* End - Body Block */}

            {/* Start - File Progress Block */}
            <div className="mb-3 files-block">
              {this.state.decodedFiles.map((file, i) => {
                return (
                  <div
                    className={
                      file.isUploadInProgres
                        ? "single-file-container"
                        : file.success
                        ? "single-file-container success"
                        : "single-file-container error"
                    }
                  >
                    <span style={{ whiteSpace: "nowrap" }}>
                      {file.fileName}
                    </span>
                    {file.isUploadInProgres ? (
                      <div className="loader"></div>
                    ) : (
                      <i
                        onClick={(e) =>
                          this.onDeleteAttachment(file.publicId, file.fileName)
                        }
                        disabled
                        className="bi bi-x"
                        style={{
                          fontSize: 28,
                          marginLeft: 6,
                          cursor: "pointer",
                        }}
                      ></i>
                    )}
                  </div>
                );
              })}
            </div>
            {/* End - File Progress Block */}

            <div className="buttons-row">
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* Start - Send button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-primary-sm"
                >
                  Send
                </button>
                {/* End - Send button */}
                <input
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  ref={this.fileRef}
                  onChange={(e) => this.onFileChoose(e)}
                />
                <i
                  type="file"
                  className="bi bi-paperclip"
                  style={{
                    marginLeft: 10,
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    padding: 5,
                  }}
                  onClick={() => this.fileRef.current.click()}
                ></i>
              </div>
              <i
                className="bi bi-trash-fill"
                style={{
                  color: "#c6342c",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  padding: 5,
                  paddingRight: 0,
                }}
                onClick={this.clearState}
              ></i>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default FormEmail;

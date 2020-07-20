import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      front: false,
      stream: [],
    };
  }
  componentDidMount() {
    if (!navigator.getUserMedia) {
      alert("You need a browser that supports WebRTC");
      return;
    }
    navigator.mediaDevices.enumerateDevices().then((stream) => {
      // stream = stream.map((item) =>
      //   item.kind === "videoinput" ? item : false
      // );
      this.setState({
        stream,
      });
      console.log(stream);
    });
    this.getCamera(false, false);
  }
  getCamera(front, param = {}) {
    let obj = param
      ? { deviceId: param }
      : { facingMode: front ? "user" : "environment" };
    console.log(obj);
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: obj,
      })
      .then(function (stream) {
        const track = stream.getVideoTracks();
        console.log(stream, track);
        var video = document.querySelector("video");
        if ("srcObject" in video) {
          video.srcObject = stream;
        } else {
          video.src = window.URL.createObjectURL(stream);
        }
        video.onloadedmetadata = function (e) {
          video.play();
        };
      })
      .catch(function (err) {});
  }
  changeType() {
    this.setState(
      {
        front: !this.state.front,
      },
      () => {
        this.getCamera(this.state.front, false);
      }
    );
  }
  changeCamera(id) {
    let param = { exact: id };
    this.getCamera(null, param);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className="body">
          <video src=""></video>
          <span>
            {"<"}
            {this.state.front ? "user" : "environment"}
            {">"}
          </span>
          <h4>设备列表</h4>
          <ul>
            {this.state.stream.map((item, index) => (
              <li
                key={item.groupId + index}
                onClick={this.changeCamera.bind(this, item.deviceId)}
              >
                <b>{item.kind}</b>
                <br />
                {item.label}
              </li>
            ))}
          </ul>
          <div className="btn" onClick={this.changeType.bind(this)}>
            change camera type
          </div>
        </div>
      </div>
    );
  }
}

export default App;

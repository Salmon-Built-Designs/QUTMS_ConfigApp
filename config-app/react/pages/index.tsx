import { Card, Icon, Form, Input, Checkbox, Button, Divider } from "antd";
import { Component } from "react";
import { CardImgOverlay } from "reactstrap";
import "../css/login.css";

export default class App extends Component {
  render() {
    return (
      // <div>
      <div
        className="login-background"
        style={{ backgroundImage: "url(./images/Sam.jpg)" }}
      >
        <Card
          style={{
            width: 300,
            marginLeft: "12%",
            position: "absolute",
            height: "100vh",
            opacity: "0.88"
          }}
        >
          <img
            src="/images/qms_icon_2.png"
            style={{
              marginLeft: "50px",
              marginBottom: "25px",
              marginTop: "100%"
            }}
          />
          <Form>
            <Form.Item>
              <Input
                prefix={
                  <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Email Address"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{ marginLeft: "10px", marginRight: "45px" }}
              >
                Log in
              </Button>
              Or
              <a href="" style={{ marginLeft: "5px" }}>
                register now!
              </a>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

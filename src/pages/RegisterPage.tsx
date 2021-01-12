import React from "react";
import { Card, Form, Input, Button, Divider } from "antd";
import { Link } from "react-router-dom";

import { MailOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
// import { useTitle } from "./_helpers";

import logoSrc from "./images/wideLogo.png";
import landingBgSrc from "./images/landingBg.jpg";
import styles from "./styles/loginRegister.module.scss";

export default function RegisterPage() {
//   useTitle("QUTMS Register");

  return (
    <>
      <div
        className={styles.loginBackground}
        style={{ backgroundImage: `url(${landingBgSrc})` }}
      >
        <Card
          style={{
            width: 300,
            marginLeft: "12%",
            position: "absolute",
            height: "100vh",
            opacity: "0.88",
          }}
        >
          <img
            src={logoSrc}
            alt="configapp logo"
            style={{
              width: "80%",
              marginLeft: "10%",
              marginBottom: "25px",
              marginTop: "100%",
            }}
          />
          <Form>
            <Form.Item>
              <Input
                prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Email Address"
              />
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="First and Last Name"
              />
              <Input
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={`${styles.primaryColour} ${styles.loginFormButton}`}
                block
              >
                Register
              </Button>
              <Divider />
              Or
              <Link to="/login" style={{ marginLeft: "5px" }}>
                login
              </Link>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}  
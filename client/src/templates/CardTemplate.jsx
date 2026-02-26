/* eslint-disable import/first */
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
const { Header, Content, Sider } = Layout;
import "./CardTemplate.scss";
import { Route, useHistory } from "react-router-dom/cjs/react-router-dom";
import { useSelector } from "react-redux";

export default function CardTemplate(props) {
  const [collapsed, setCollapsed] = useState(
    window.innerWidth < 600 ? true : false
  );
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  const history = useHistory();
  const pathname = location.pathname;

  const getSelectedKey = () => {
    switch (true) {
      case pathname === "/card-hall":
        return ["navCardHall"];

      case pathname === "/card-management":
        return ["navManagement"];

      case pathname === "/card-application":
        return ["navApplication"];

      case pathname === "/card-transaction":
        return ["navTransaction"];

      default:
        return [];
    }
  };

  useEffect(() => {
    if (!isLogin) {
      history.push("/");
    }
  }, [isLogin]);

  if (!isLogin) {
    return null;
  }

  return (
    <div className="customLayoutAntd">
      <Layout style={{ height: "100vh" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={window.innerWidth < 600 ? 0 : 80}
          style={{ padding: window.innerWidth < 600 && "0" }}
        >
          <div
            className="logo"
            style={{ gap: !collapsed ? "8px" : "0" }}
            onClick={() => history.push("/")}
          >
            <svg
              width="43"
              height="47"
              viewBox="0 0 43 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.15869 10.3195L20.033 21.0934V0.0187988L16.1251 2.25742V14.4506L9.71692 10.4965L13.4095 8.16169V3.82292L2.15869 10.3195Z"
                fill="#F4E096"
              />
              <path
                d="M40.2798 36.3374L22.5554 25.6328V46.5689L26.4288 44.3341V32.2756L32.8369 36.2259L29.1444 38.5607V42.7648L40.2798 36.3374Z"
                fill="#F4E096"
              />
              <path
                d="M37.1642 8.43137L26.3211 14.5164V6.8428L30.4483 9.30451L34.4293 6.85434L22.5554 0V21.1054L40.6221 10.4315L37.1642 8.43137Z"
                fill="#F4E096"
              />
              <path
                d="M5.5697 38.2183L16.2666 32.2179V39.8954L12.1394 37.4337L8.30066 39.7954L20.0323 46.5689V25.6328L2.10791 36.222L5.5697 38.2183Z"
                fill="#F4E096"
              />
              <path
                d="M42.0914 13.0547V26.3172L38.395 24.1632V19.3782L34.2216 21.7322L31.4483 23.2939L38.395 27.3403L42.0914 29.4943V33.8523L27.6481 25.4363L23.9517 23.2823L26.2249 22.0015L27.7519 21.1399L30.5214 19.5782L38.395 15.1395L42.0914 13.0547Z"
                fill="#F4E096"
              />
              <path
                d="M0.5 33.8523V20.5898L4.19642 22.7438V27.5288L8.36979 25.1748L11.1431 23.6131L4.19642 19.5667L0.5 17.4127V13.0547L14.9433 21.4707L18.6398 23.6247L16.3665 24.9055L14.8395 25.7671L12.0701 27.3288L4.19642 31.7676L0.5 33.8523Z"
                fill="#F4E096"
              />
            </svg>

            <div
              className="brand"
              style={{
                visibility: !collapsed ? "visible" : "hidden",
                width: !collapsed ? "fit-content" : "0",
                opacity: !collapsed ? "1" : "0",
                overflowX: "hidden",
              }}
            >
              HEWE
            </div>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={getSelectedKey()}
            items={[
              {
                key: "navNorpayCard",
                icon: <VideoCameraOutlined />,
                label: "Norpay Card",
                children: [
                  {
                    key: "navCardHall",
                    label: `Card Hall`,
                  },
                  {
                    key: "navManagement",
                    label: `Card Management`,
                  },
                  {
                    key: "navApplication",
                    label: `Application record`,
                  },
                  {
                    key: "navTransaction",
                    label: `Transaction record`,
                  },
                ],
              },
            ]}
            onClick={(item) => {
              window.innerWidth <= 768 && setCollapsed(true);
              switch (item.key) {
                case "navCardHall":
                  history.push("/card-hall");
                  break;
                case "navManagement":
                  history.push("/card-management");
                  break;
                case "navApplication":
                  history.push("/card-application");
                  break;
                case "navTransaction":
                  history.push("/card-transaction");
                  break;
                case "navLogout":
                  // handleLogout(true);
                  break;
                default:
                  break;
              }
            }}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              padding: 0,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}

            <div
              onClick={() => history.push("/")}
              style={{ paddingRight: "16px" }}
            >
              <i class="fa-solid fa-house"></i>
            </div>
          </Header>
          <Content className="site-layout-background">
            <div
              style={{
                opacity: !collapsed && window.innerWidth < 600 ? "0" : "1",
              }}
            >
              <Route
                exact
                path={props.path}
                render={(propsRoute) => {
                  return <props.component {...propsRoute} />;
                }}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

import React from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Menu,
  useGetIdentity,
  useLogout,
  useMenu,
  useTitle,
} from "@pankod/refine";
import routerProvider from "@pankod/refine-react-router";
import { Header } from "antd/lib/layout/layout";
import "./styles.css";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import { useHistory } from "react-router-dom";

const { Link } = routerProvider;

export const CustomHeader: React.FC = () => {
  const { data: identity } =
    useGetIdentity<{ id: string; name: string; role: string }>();
  const { mutate: logout } = useLogout();
  const history = useHistory();
  const menu = (
    <Menu>
      <Menu.Item>
        <Button type="link" onClick={() => history.push("/profile")}>
          Profile
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="link" onClick={() => logout()}>
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <div>
        <span className="items p-2">
          <h2 className="mt-auto mx-5">{identity?.name}</h2>
          <Dropdown overlay={menu}>
            <Avatar size="large" icon={<UserOutlined />} />
          </Dropdown>
        </span>
      </div>
    </>
  );
};

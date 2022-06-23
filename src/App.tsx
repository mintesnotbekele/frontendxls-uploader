import React from "react";
import axios from "axios";
import { Refine, AuthProvider, AntdLayout } from "@pankod/refine";
import dataProvider from "@pankod/refine-simple-rest";
import routerProvider from "@pankod/refine-react-router";
import { UserList } from "./pages/users/list";
import { UserShow } from "./pages/users/show";
import { Profile } from "./pages/profile";
import { QuestionCreate, QuestionList, QuestionShow, QuestionEdit } from "./pages/questions";
import { SubjectList } from "./pages/subjects/list";
import { SubjectShow } from "./pages/subjects/show";
import { TOKEN_KEY, API_URL, USER_KEY } from "./constants";
import { stringify, parse } from "query-string";
import { Login } from "./pages/login";
import { CustomSider } from "./components/sider/";
import { CustomHeader } from "components/header";
import { login } from "./apis/login/login.api";
import {Dashboard} from "./pages/dashboard";
import {
  QuestionCircleOutlined,
  SnippetsOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ChangePassword } from "pages/password";
const { Link } = routerProvider;

const App: React.FC = () => {
  const axiosInstance = axios.create();
  const authProvider: AuthProvider = {
    login: async ({ phoneNumber, password }) => {
      const { data, status } = await login({ phoneNumber, password });
      if (status === 200) {
        localStorage.setItem(TOKEN_KEY, data.accessToken);
        localStorage.setItem(USER_KEY, stringify(data.user));

        // set header axios instance
        axiosInstance.defaults.headers.common = {
          Authorization: `Bearer ${data.jwt}`,
        };

        return Promise.resolve;
      }
      return Promise.reject;
    },
    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        axiosInstance.defaults.headers.common = {
          Authorization: `Bearer ${token}`,
        };
        return Promise.resolve();
      }

      return Promise.reject();
    },
    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const user = parse(localStorage.getItem(USER_KEY) ?? "{}");
      if (!token || !user) {
        return Promise.reject();
      }
      return Promise.resolve({
        id: user.id,
        name: `${user?.firstName} ${user?.lastName}`,
        avatar: `${user?.profilePicture}`,
      });
    },
  };

  return (
    <Refine
      authProvider={authProvider}
      dataProvider={dataProvider(API_URL, axiosInstance)}
      routerProvider={routerProvider}
      LoginPage={Login}
      Layout={({ children, Footer, OffLayoutArea }) => (
        <AntdLayout>
          <AntdLayout>
            <div className={"flex h-screen w-screen overflow-hidden"}>
              <CustomSider />

              <div className="h-full w-full">
                <AntdLayout.Content style={{minHeight: '100vh'}} className={"flex flex-col h-screen w-full overflow-hidden bg-white"}>
                  <CustomHeader />
                  <AntdLayout.Content className="p-3 pt-7 h-full w-full overflow-auto p-4 px-10">
                    {children}
                  </AntdLayout.Content>
                  <Footer />
                </AntdLayout.Content>
                <OffLayoutArea />
              </div>
            </div>
          </AntdLayout>
        </AntdLayout>
      )}
      Title={() => (
        <Link to="/" style={{ margin: "auto", marginRight: "10px" }}>
          <img
            className="m-auto my-4"
            src="/logo.svg"
            alt="Mk"
            style={{ width: "100px" }}
          />
        </Link>
      )}
      resources={[
        {
          name: "users",
          list: UserList,
          show: UserShow,
          icon: <UsergroupAddOutlined />
        },
        {
          name: "questions",
          list: QuestionList,
          create: QuestionCreate,
          edit: QuestionEdit,
          show: QuestionShow,
          icon: <QuestionCircleOutlined />,
        },
        {
          name: "subjects",
          list: SubjectList,
          show: SubjectShow,
          icon: <SnippetsOutlined />,
        },
        {
          name: "profile",
          list: Profile,
          icon: <UserOutlined />,
        },
        {
          name: "password",
          list: ChangePassword,
          icon: <UserOutlined />,
        },
      ]}
      DashboardPage={() => <Dashboard />}
    />
  );
};

export default App;

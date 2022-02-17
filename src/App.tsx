import React from "react";
import axios from "axios";
import { Refine, AuthProvider, AntdLayout } from "@pankod/refine";
import dataProvider from "@pankod/refine-simple-rest";
import routerProvider from "@pankod/refine-react-router";
import { UserList } from "./pages/users/list";
import { UserShow } from "./pages/users/show";
import { QuestionList, QuestionShow } from "./pages/questions";
import { SubjectList } from "./pages/subjects/list";
import { SubjectShow } from "./pages/subjects/show";
import { TOKEN_KEY, API_URL, USER_KEY } from "./constants";
import { stringify, parse } from "query-string";
import { Login } from "./pages/login";
import { CustomSider } from "./components/sider/";
import { CustomHeader } from "components/header";
import { login } from "./apis/login/login.api";
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
            <CustomSider />

            <AntdLayout.Content className="min-h-screen">
              <CustomHeader />
              <AntdLayout.Content className="p-3 h-full">
                {children}
              </AntdLayout.Content>
              <Footer />
            </AntdLayout.Content>
            <OffLayoutArea />
          </AntdLayout>
        </AntdLayout>
      )}
      Title={() => (
        <Link to="/" style={{ margin: "auto", marginRight: "10px" }}>
          <img
            className="m-auto"
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
        },
        {
          name: "questions",
          list: QuestionList,
          show: QuestionShow,
        },
        {
          name: "subjects",
          list: SubjectList,
          show: SubjectShow,
        },
      ]}
    />
  );
};

export default App;

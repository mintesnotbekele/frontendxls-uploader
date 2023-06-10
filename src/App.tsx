import React from "react";
import axios from "axios";
import { Refine, AntdLayout } from "@pankod/refine";
import dataProvider from "@pankod/refine-simple-rest";
import routerProvider from "@pankod/refine-react-router";
import { UploadCreate,} from "./pages/uploadxls";
import { CustomSider } from "./components/sider/";
import { CustomHeader } from "components/header";
import {
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { API_URL } from "./constants";
const { Link } = routerProvider;

const App: React.FC = () => {
  const axiosInstance = axios.create();


  return (
    <Refine
      
      dataProvider={dataProvider(API_URL, axiosInstance)}
      routerProvider={routerProvider}
      
      Layout={({ children, Footer, OffLayoutArea }) => (
        <AntdLayout>
          <AntdLayout>
            <div className={"flex h-screen w-screen overflow-hidden bg-gray-200"}>
              <CustomSider />

              <div className="h-full w-full overflow-hidden" style={{borderTopLeftRadius: '1.5em', borderBottomLeftRadius: '1.5em'}}>
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
         
        </Link>
      )}
      resources={[
        {
          name: "uploads",
          create: UploadCreate,
          icon: <QuestionCircleOutlined />,
        },
     
      ]}
      DashboardPage={() => <UploadCreate/>}
    />
  );
};

export default App;

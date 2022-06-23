import { CopyOutlined, DollarOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";
import {
  List,
  Table,
  Col,
  Row,
  Button,
  Form,
  Input,
  Tag,
  Create,
  Drawer,
  useDrawerForm,
  Spin,
  Card,
} from "@pankod/refine";
import PieChart from "charts/pie-chart";
import RadarChart from "charts/radar-chart";
import VerticalChart from "charts/vertical-chart";
import ExcelExport from "components/excel";
import { openNotification } from "components/feedback/notification";

import { useEffect, useState } from "react";
import { getAnalytics, getCounts } from "../../apis/analytics/analytics.api";
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);

const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;

export const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [analytics, setAnalytics] = useState<any>();
  const [counts, setCounts] = useState<any>();

  const icons:any = {
    users: <UserOutlined  style={{ fontSize: '2.5em', color: '#08c' }} />,
    questions: <FormOutlined  style={{ fontSize: '2.5em', color: '#08c' }} />,
    subjects: <CopyOutlined  style={{ fontSize: '2.5em', color: '#08c' }} />,
    subscriptions: <DollarOutlined  style={{ fontSize: '2.5em', color: '#08c' }} />,
  }

  useEffect(() => {
    getCountsData();
    getAnalyticsData();
  }, []);

  const getAnalyticsData = () => {
    setIsLoading(true);
    getAnalytics()
      .then((res: any) => {
        setAnalytics(res?.data);
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
  };

  const getCountsData = () => {
    setIsLoadingCounts(true);
    getCounts()
      .then((res: any) => {
        setCounts(res?.data);
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoadingCounts(false));
  };

  return (
    <>
      <Spin spinning={isLoading}>
        <ExcelExport analytics={analytics}/>
        <div className="flex flex-col">
          
          <div className="flex items-center justify-items-center mx-auto">

            <div className="mx-5 flex p-7 mb-5 flex-col self-start">
              {counts && Object.entries(counts).map((item:any) => 
                <div className="flex m-3 p-3 items-center shadow grow">
                  <span className="ml-5"> {icons[item[0]]} </span>
                  <div className="m-3 flex flex-col justify-center">
                    <div className="text-left font-bold text-gray-500 text-xl"> {item[1]} </div>
                    <div className="text-left text-gray-500"> {item[0].substring(0,1).toUpperCase() + item[0].substring(1).toLowerCase()} </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mx-5 flex p-7 mb-5 mx-5 w-1/3 shadow rounded-lg" style={{minWidth: '25vw'}}>
              <PieChart
                title="Users Registed"
                labels={
                  analytics?.users.map((item: any) => months[item.month - 1]) ||
                  []
                }
                data={analytics?.users.map((item: any) => item.count) || []}
                colors={analytics?.users.map(() => randomRGB()) || []}
              />
            </div>

            <div className="mx-5 flex p-7 mb-5 mx-5 w-1/3 shadow rounded-lg" style={{minWidth: '25vw'}}>
                <RadarChart
                  title="Payments Made"
                  labels={
                    analytics?.payments.map(
                      (item: any) => months[item.month - 1]
                    ) || []
                  }
                  data={analytics?.payments.map((item: any) => item.count) || []}
                />
            </div>

          </div>

          <div className="flex items-center justify-items-center mx-auto">

            <div className="mx-5 flex p-7 mb-16 mx-5 w-1/3 shadow rounded-lg" style={{minWidth:'35vw'}}>
              <VerticalChart
                title="Questions Added"
                labels={
                  analytics?.questions.map((item: any) => item?.year) || []
                }
                data={analytics?.questions.map((item: any) => item.count) || []}
              />
            </div>

            <div className="mx-5 flex p-7 mb-16 mx-5 w-1/3 shadow rounded-lg" style={{minWidth:'35vw'}}>
                <VerticalChart
                  title="Users Registed"
                  labels={
                    analytics?.users.map((item: any) => months[item.month - 1]) ||
                    []
                  }
                  data={analytics?.users.map((item: any) => item.count) || []}
                />
            </div>

          </div>

        </div>
      </Spin>
    </>
  );
};

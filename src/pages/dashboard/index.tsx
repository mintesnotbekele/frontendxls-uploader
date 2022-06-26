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
const colors = [ // Find proper color schemes
  '#8BB7A2',
  'rgb(67, 56, 202)',
  'rgb(37, 99, 235)',
  'rgb(165, 180, 252)',
  'rgb(59, 130, 246)',
  '#8BB7D2',
  '#8BB772',
  'rgb(55, 48, 163)',
  '#8BB795',
  'rgb(79, 70, 229)',
  '#8BB712',
  'rgb(30, 64, 175)',
];
const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);

const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;

export const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [analytics, setAnalytics] = useState<any>();
  const [counts, setCounts] = useState<any>();

  const icons:any = {
    users: <UserOutlined  style={{ fontSize: '2.5em', color: '#8BB7A2' }} />,
    questions: <FormOutlined  style={{ fontSize: '2.5em', color: '#8BB7A2' }} />,
    subjects: <CopyOutlined  style={{ fontSize: '2.5em', color: '#8BB7A2' }} />,
    subscriptions: <DollarOutlined  style={{ fontSize: '2.5em', color: '#8BB7A2' }} />,
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
          <style>
          {`
            .counter-card {
              // background-color: #FAFAFA;
              background-color: #08c;
            }
          `}
        </style>
        <ExcelExport analytics={analytics}/>
        <div className="flex flex-col">
          
          <div className="flex flex-wrap items-center justify-items-center mx-auto">

            <div className="mx-5 flex p-7 mb-5 mx-5 w-full md:w-1/4 shadow rounded-lg" style={{minWidth: '25vw'}}>
              <PieChart
                title="Users Registed"
                labels={
                  analytics?.users.map((item: any) => months[item.month - 1]) ||
                  []
                }
                data={analytics?.users.map((item: any) => item.count) || []}
                colors={colors}
              />
            </div>

            <div className="grid grid-flow-row p-7 m-auto">
              <p className="col-span-2 row-span-2 font-bold text-3xl text-gray-400 text-center"> Temariye </p>
              {counts && Object.entries(counts).map((item:any, idx:number) => 
                <div className="inline-flex m-3 p-3 cursor-default pr-16 items-center shadow counter-card rounded-2xl overflow-hidden relative scale-25" style={{minWidth: '175px'}}>
                  <span className="mx-4" style={{position: 'absolute', bottom: [0,3].includes(idx) ? '.5em':'2.85em', right: '-.15em', transform: [0,3].includes(idx) ? 'rotate(7deg)':'rotate(-5deg)' }}> {icons[item[0]]} </span>
                  <div className="m-3 flex flex-col justify-center text-gray-200">
                    <div className="text-left font-bold text-2xl"> {item[1]} </div>
                    <div className="text-left font-bold text-lg"> {item[0].substring(0,1).toUpperCase() + item[0].substring(1).toLowerCase()} </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mx-5 flex p-7 mb-5 mx-5 w-full md:w-1/4 shadow rounded-lg" style={{minWidth: '25vw'}}>
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

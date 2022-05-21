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
import { getAnalytics } from "../../apis/analytics/analytics.api";
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
  const [analytics, setAnalytics] = useState<any>();

  useEffect(() => {
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

  return (
    <>
      <Spin spinning={isLoading}>
        <ExcelExport analytics={analytics}/>
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Card>
              <PieChart
                title="Users Registed"
                labels={
                  analytics?.users.map((item: any) => months[item.month - 1]) ||
                  []
                }
                data={analytics?.users.map((item: any) => item.count) || []}
                colors={analytics?.users.map(() => randomRGB()) || []}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <RadarChart
                title="Payments Made"
                labels={
                  analytics?.payments.map(
                    (item: any) => months[item.month - 1]
                  ) || []
                }
                data={analytics?.payments.map((item: any) => item.count) || []}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <VerticalChart
                title="Users Registed"
                labels={
                  analytics?.users.map((item: any) => months[item.month - 1]) ||
                  []
                }
                data={analytics?.users.map((item: any) => item.count) || []}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <VerticalChart
                title="Questions Added"
                labels={
                  analytics?.questions.map((item: any) => item?.year) || []
                }
                data={analytics?.questions.map((item: any) => item.count) || []}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </>
  );
};

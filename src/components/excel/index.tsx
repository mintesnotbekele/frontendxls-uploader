import { Button } from "@pankod/refine";
import { Excel } from "antd-table-saveas-excel";

const monthlyColumns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "January",
    dataIndex: "1",
    key: "1",
  },
  {
    title: "February",
    dataIndex: "2",
    key: "2",
  },
  {
    title: "March",
    dataIndex: "3",
    key: "3",
  },
  {
    title: "April",
    dataIndex: "4",
    key: "4",
  },
  {
    title: "May",
    dataIndex: "5",
    key: "5",
  },
  {
    title: "June",
    dataIndex: "6",
    key: "6",
  },
  {
    title: "July",
    dataIndex: "7",
    key: "7",
  },
  {
    title: "August",
    dataIndex: "8",
    key: "8",
  },
  {
    title: "September",
    dataIndex: "9",
    key: "9",
  },
  {
    title: "October",
    dataIndex: "10",
    key: "10",
  },
  {
    title: "November",
    dataIndex: "11",
    key: "11",
  },
  {
    title: "December",
    dataIndex: "12",
    key: "12",
  },
];

export default function ExcelExport({ analytics }: any) {
  const capitalizeFirstLetter =(s: string)=> {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  const handleClick = () => {
    let user = analytics?.users.reduce(
      (acc: any, cur: any) => ({ ...acc, [cur.month]: cur.count }),
      {}
    );
    user.name = "User";
    let payment = analytics?.payments.reduce(
      (acc: any, cur: any) => ({ ...acc, [cur.month]: cur.count }),
      {}
    );
    payment.name = "Payment";
    let subject = analytics?.subjects.reduce(
      (acc: any, cur: any) => ({ ...acc, [cur.month]: cur.count }),
      {}
    );
    subject.name = "Subject";
    let dataSource1 = [user, payment, subject];

    let question = analytics?.questions.reduce(
      (acc: any, cur: any) => ({ ...acc, [cur.year]: cur.count }),
      {}
    );
    question.name = "Question";
    let dataSource2 = [question];
    let yearlyColumns = [ ...Object.keys(question).map((item: any) => ({ title: capitalizeFirstLetter(item), dataIndex: item, key: item }))].reverse();
    const excel = new Excel();
    excel
      .addSheet("Analytics")
      .addColumns(monthlyColumns)
      .addDataSource(dataSource1, {
        str2Percent: true,
      })
      .addSheet("Questions")
      .addColumns(yearlyColumns)
      .addDataSource(dataSource2, {
        str2Percent: true,
      })
      .saveAs("Analytics.xlsx");
  };
  return (
    <div className="flex justify-end mb-2">
      <Button onClick={handleClick}>Export</Button>
    </div>
  );
}

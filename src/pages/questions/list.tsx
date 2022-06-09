import { DeleteOutlined } from "@ant-design/icons";
import {
  List,
  Table,
  Col,
  Row,
  Tag,
  ShowButton,
  Button,
  Popconfirm,
  EditButton,
  Form,
  Icons,
  Input,
  Card,
  DatePicker,
  FormProps,
  useCustom,
  useApiUrl,
  Select,
  Spin,
} from "@pankod/refine";
import { getQuestions, deleteQuestion } from "apis/question/question";
import { openNotification } from "components/feedback/notification";
import { useEffect, useState } from "react";
const validationLabel = "Please insert a value to the input field";
const { RangePicker } = DatePicker;
const { Option } = Select;

const gradeNames = {
  grade_8: "Grade 8",
  grade_12_social: "Grade 12 Social",
  grade_12_natural: "Grade 12 Natural",
};

const getGradeLabel = (option: string) => {
  switch (option) {
    case "grade_8":
      return gradeNames.grade_8;
    case "grade_12_social":
      return gradeNames.grade_12_social;
    case "grade_12_natural":
      return gradeNames.grade_12_natural;
    default:
      return 'Please select grade.'
  }
};

const generateArrayOfYears = () => {
  let max = new Date().getFullYear();
  let min = max - 20;
  let years = [];

  for (var i = max; i >= min; i--) {
    years.push(`${i}`);
  }
  return years;
};

export const QuestionList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const apiUrl = useApiUrl();

  useEffect(() => {
    getQuestionData();
  }, []);

  const { data: subjectsData, isLoading: isLoadingSubjectsData } =
    useCustom<any>({
      url: `${apiUrl}/subject/getSubjects`,
      method: "get",
    });

  const { data: gradeEnumData, isLoading: isLoadingGradeEnum } = useCustom<any>(
    {
      url: `${apiUrl}/enum/getGrade`,
      method: "get",
    }
  );

  useEffect(() => {
    setSubjectFilter(subjectsData?.data[0]?.name);
    setGradeFilter(gradeEnumData?.data?.grades[0]);
    setYearFilter(generateArrayOfYears()[0]);
  }, [subjectsData, gradeEnumData]);

  const getQuestionData = () => {
    setIsLoading(true);
    getQuestions({year: yearFilter, subject: subjectFilter , grade: gradeFilter})
      .then((res: any) => {
        setQuestions(res?.data);
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
  };

  const _deleteQuestion = (id: string) => {
    let removeIndex = questions.map((item: any) => item.id).indexOf(id);
    setIsLoading(true);
    deleteQuestion(id)
      .then((res: any) => {
        const updatedQuestions = questions.filter(
          (item: any) => item?.id !== id
        );
        setQuestions(updatedQuestions);
        openNotification(`Deleted Successfully!`, "success");
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
  };

  const Filter: React.FC = () => {
    return (
      <Spin spinning={isLoadingGradeEnum || isLoadingSubjectsData || isLoading}>
        <div className="flex gap-3">
          <Select
            defaultValue={gradeFilter}
            onChange={(val) => setGradeFilter(val)}
          >
            {gradeEnumData?.data?.grades?.map((grade: any) => (
              <Option value={grade} key={grade}>
                {getGradeLabel(grade)}
              </Option>
            ))}
          </Select>
          <Select
            defaultValue={subjectFilter}
            onChange={(val) => setSubjectFilter(val)}
          >
            {subjectsData?.data?.map((subject: any) => (
              <Option value={subject?.name} key={subject?.name}>
                {subject?.name}
              </Option>
            ))}
          </Select>
          <Select
            defaultValue={yearFilter}
            onChange={(val) => setYearFilter(val)}
          >
            {generateArrayOfYears()?.map((year: any) => (
              <Option value={year} key={year}>
                {year}
              </Option>
            ))}
          </Select>
          <Button
            htmlType="submit"
            type="primary"
            onClick={() => getQuestionData()}
          >
            Search
          </Button>
        </div>
      </Spin>
    );
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Card title="Filters">
            <Filter />
          </Card>
        </Col>
        <Col span={24}>
          <List canCreate>
            <Table
              dataSource={questions}
              loading={isLoading}
              rowKey="id"
              scroll={{ x: "4000px" }}
            >
              <Table.Column
                dataIndex="metadata"
                title="Meta Data"
                render={(data) => {
                  return (
                    <div
                      style={{ maxWidth: "300px" }}
                      dangerouslySetInnerHTML={{
                        __html: data || "No Meta Data",
                      }}
                    ></div>
                  );
                }}
              />
              <Table.Column
                dataIndex="question"
                title="Question"
                render={(data) => {
                  return (
                    <div
                      style={{ maxWidth: "300px" }}
                      dangerouslySetInnerHTML={{
                        __html: data,
                      }}
                    ></div>
                  );
                }}
              />
              <Table.Column
                title="First option"
                render={(data) => {
                  return (
                    <div
                      style={{ maxWidth: "300px" }}
                      dangerouslySetInnerHTML={{
                        __html: data?.A.replace(
                          /(<? *script)/gi,
                          "illegalscript"
                        ),
                      }}
                    ></div>
                  );
                }}
              />
              <Table.Column
                title="Second option"
                render={(data) => {
                  return (
                    <div
                      style={{ maxWidth: "300px" }}
                      dangerouslySetInnerHTML={{
                        __html: data?.B.replace(
                          /(<? *script)/gi,
                          "illegalscript"
                        ),
                      }}
                    ></div>
                  );
                }}
              />
              <Table.Column
                title="Third option"
                render={(data) => {
                  return (
                    <div
                      style={{ maxWidth: "300px" }}
                      dangerouslySetInnerHTML={{
                        __html: data?.C.replace(
                          /(<? *script)/gi,
                          "illegalscript"
                        ),
                      }}
                    ></div>
                  );
                }}
              />
              <Table.Column
                title="Fourth option"
                render={(data) => {
                  return (
                    <div
                      style={{ maxWidth: "300px" }}
                      dangerouslySetInnerHTML={{
                        __html: data?.D.replace(
                          /(<? *script)/gi,
                          "illegalscript"
                        ),
                      }}
                    ></div>
                  );
                }}
              />
              <Table.Column
                title="Actions"
                render={(question) => {
                  return (
                    <div className="flex gap-1 items-center">
                      <ShowButton
                        type="link"
                        size="middle"
                        hideText
                        recordItemId={question?.id}
                      />
                      <EditButton
                        type="link"
                        size="middle"
                        hideText
                        recordItemId={question?.id}
                      />
                      <Popconfirm
                        title="Are you sure to delete this question?"
                        onConfirm={() => _deleteQuestion(question?.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined
                          type="link"
                          style={{ color: "red" }}
                        ></DeleteOutlined>
                      </Popconfirm>
                    </div>
                  );
                }}
              />
            </Table>
          </List>
        </Col>
      </Row>
    </>
  );
};

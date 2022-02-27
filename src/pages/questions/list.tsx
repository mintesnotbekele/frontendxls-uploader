import {
  List,
  Table,
  Icons,
  Col,
  Row,
  FormProps,
  Button,
  Form,
  DatePicker,
  Input,
  useCustom,
  useApiUrl,
  Tag,
  useDrawerForm,
  Drawer,
  Create,
  Select,
  Tabs,
  Divider,
  Collapse,
  Spin
} from "@pankod/refine";
import { getQuestions } from "apis/question/question";
import { openNotification } from "components/feedback/notification";
import { useEffect, useState } from "react";

const answerNames = {
  first_option: "First Option",
  second_option: "Second Option",
  third_option: "Third Option",
  fourth_option: "Fourth Option",
};

const gradeNames = {
  grade_8: "Grade 8",
  grade_12_social: "Grade 12 Social",
  grade_12_natural: "Grade 12 Natural",
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const { Panel } = Collapse;

const validationLabel = "Please insert a value to the input field";

const getAnswersLabel = (option: string) => {
  switch (option) {
    case "first_option":
      return answerNames.first_option;
    case "second_option":
      return answerNames.second_option;
    case "third_option":
      return answerNames.third_option;
    case "fourth_option":
      return answerNames.fourth_option;
  }
};
const getGradeLabel = (option: string) => {
  switch (option) {
    case "grade_8":
      return gradeNames.grade_8;
    case "grade_12_social":
      return gradeNames.grade_12_social;
    case "grade_12_natural":
      return gradeNames.grade_12_natural;
  }
};
const initFormData = {
  grade: "grade_8",
  question: "",
  firstOption: "",
  secondOption: "",
  thirdOption: "",
  fourthOption: "",
  answer: "",
};

export const QuestionList: React.FC = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

    useEffect(() => {
      getQuestionData();
    }, []);
  
    const getQuestionData = () => {
      setIsLoading(true);
      getQuestions()
        .then((res: any) => {
          setQuestions(res?.data);
        })
        .catch((e: any) => {
          openNotification(`${e?.data?.message}`, "error");
        })
        .finally(() => setIsLoading(false));
    };

  return (
    <>
      <Row>
        <Col span={24}>
          <List
            canCreate
          >
            <Table dataSource={questions} loading={isLoading} rowKey="id">
              <Table.Column dataIndex="question" title="Question" />
              <Table.Column
                title="First option"
                render={(data) => {
                  return data?.answer === "first_option" ? (
                    <Tag color="success">{data?.firstOption}</Tag>
                  ) : (
                    data?.firstOption
                  );
                }}
              />
              <Table.Column
                title="Second option"
                render={(data) => {
                  return data?.answer === "second_option" ? (
                    <Tag color="success">{data?.secondOption}</Tag>
                  ) : (
                    data?.secondOption
                  );
                }}
              />
              <Table.Column
                title="Third option"
                render={(data) => {
                  return data?.answer === "third_option" ? (
                    <Tag color="success">{data?.thirdOption}</Tag>
                  ) : (
                    data?.thirdOption
                  );
                }}
              />
              <Table.Column
                title="Fourth option"
                render={(data) => {
                  return data?.answer === "fourth_option" ? (
                    <Tag color="success">{data?.fourthOption}</Tag>
                  ) : (
                    data?.fourthOption
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

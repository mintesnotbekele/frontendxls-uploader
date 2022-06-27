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
  Spin,
  useCreateForm,
  Icon,
  Upload,
  useShow,
  Edit,
  Card,
} from "@pankod/refine";
import { updateQuestion } from "apis/question/question";
import { openNotification } from "components/feedback/notification";
import Papa from "papaparse";
import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import TextEditor from "../../components/text-editor";

const answerNames = {
  first_option: "A",
  second_option: "B",
  third_option: "C",
  fourth_option: "D",
};

const gradeNames = {
  grade_8: "Grade 8",
  grade_12_social: "Grade 12 Social",
  grade_12_natural: "Grade 12 Natural",
};

const { Panel } = Collapse;

const validationLabel = "Please insert a value to the input field";

const getAnswersLabel = (option: string) => {
  switch (option) {
    case "A":
      return answerNames.first_option;
    case "B":
      return answerNames.second_option;
    case "C":
      return answerNames.third_option;
    case "D":
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
  number: "",
  question: "",
  A: "",
  B: "",
  C: "",
  D: "",
  answer: "",
};

export const QuestionEdit: React.FC = () => {
  const [formLoading, setFormLoading] = useState(false);

  const history = useHistory();
  const apiUrl = useApiUrl();

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

  const { data: answerEnumData, isLoading: isLoadingEnum } = useCustom<any>({
    url: `${apiUrl}/enum/getAnswer`,
    method: "get",
  });

  const { formProps, saveButtonProps } = useDrawerForm({
    action: "edit",
    resource: "question/getQuestion",
    successNotification: { message: "Created successfully!" },
  });

  const submitForm = (formData: any) => {
    setFormLoading(true);
    updateQuestion(formData)
      .then((res: any) => {
        history.push("/questions");
        openNotification("Question has been updated successfully!", "success");
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setFormLoading(false));
  };

  const _buildFormInputItem = (
    key: string,
    name: any,
    placeholder: string = "",
    type: string = "text"
  ) => {
    return (
      <Form.Item
        labelCol={{ offset: 0 }}
        key={name + key}
        name={name}
        rules={[
          {
            required: true,
            message: validationLabel,
          },
        ]}
      >
        <Input type={type} placeholder={placeholder} />
      </Form.Item>
    );
  };
  const _buildFormTextEditor = (
    key: string,
    name: any,
    placeholder: string = "",
    required: boolean = true
  ) => {
    return (
      <Form.Item
        labelCol={{ offset: 0 }}
        key={name + key}
        name={name}
        rules={[
          {
            required: required,
            message: validationLabel,
          },
        ]}
      >
        <TextEditor
          placeholder={placeholder}
          onChange={(val: any) => console.log(val)}
          value={formProps.form.getFieldValue(name)}
        />
      </Form.Item>
    );
  };

  const _buildFormSelectionItem = ({
    key,
    name,
    items,
    callback,
    placeholder,
  }: any) => {
    return (
      <Form.Item
        key={name + key}
        name={name}
        initialValue={items && items[0]}
        rules={[
          {
            required: true,
            message: validationLabel,
          },
        ]}
      >
        {items && (
          <Select
            inputValue={items[0]}
            options={items?.map((val: any) => ({
              label: callback ? callback(val) : val,
              value: val,
            }))}
          />
        )}
      </Form.Item>
    );
  };

  return (
    <>
      <Spin spinning={formLoading}>
        <Row>
          <Col span={24}>
            <Card style={{ margin: "auto" }}>
              <Edit
                saveButtonProps={saveButtonProps}
                resource="question/getQuestion"
              >
                <Form
                  layout="vertical"
                  {...formProps}
                  name="form"
                  initialValues={{
                    number: "",
                    question: "",
                    A: "",
                    B: "",
                    C: "",
                    D: "",
                  }}
                  onFinish={submitForm}
                >
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      {_buildFormTextEditor(
                        "1",
                        "metadata",
                        "Meta Data",
                        false
                      )}
                    </Col>
                    <Col span={12}>
                      {_buildFormTextEditor("2", "number", "Number")}
                    </Col>
                    <Col span={12}>
                      {_buildFormTextEditor("2", "question", "Question")}
                    </Col>
                    <Col span={12}>
                      {_buildFormTextEditor("3", "A", "First Option")}
                    </Col>
                    <Col span={12}>
                      {_buildFormTextEditor("4", "B", "Second Option")}
                    </Col>
                    <Col span={12}>
                      {_buildFormTextEditor("5", "C", "Third Option")}
                    </Col>
                    <Col span={12}>
                      {_buildFormTextEditor("6", "D", "Fourth Option")}
                    </Col>
                    <Col span={12}>
                      {_buildFormSelectionItem({
                        key: "7",
                        name: "answer",
                        items: answerEnumData?.data?.answers,
                        placeholder: "Answer",
                        callback: getAnswersLabel,
                      })}
                    </Col>
                    <Col span={12}>
                      {_buildFormTextEditor(
                        "8",
                        "description",
                        "Description",
                        false
                      )}
                    </Col>
                    <Col span={12}>
                      {_buildFormSelectionItem({
                        key: "9",
                        name: "grade",
                        items: gradeEnumData?.data?.grades,
                        placeholder: "Grade",
                        callback: getGradeLabel,
                      })}
                    </Col>
                    <Col span={12}>
                      {_buildFormSelectionItem({
                        key: "10",
                        name: "subject",
                        items:
                          subjectsData?.data?.map((item: any) => item.name) ??
                          [],
                        placeholder: "Subject",
                      })}
                    </Col>
                    <Col span={12}>
                      {_buildFormInputItem("11", "year", "Year", "number")}
                    </Col>
                  </Row>
                </Form>
              </Edit>
            </Card>
          </Col>
        </Row>
      </Spin>
    </>
  );
};

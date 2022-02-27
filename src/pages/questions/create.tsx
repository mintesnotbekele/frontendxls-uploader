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
} from "@pankod/refine";
import { createQuestion } from "apis/question/question";
import { openNotification } from "components/feedback/notification";
import { useState } from "react";
import { useHistory } from "react-router-dom";

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

export const QuestionCreate: React.FC = () => {
  const [formLoading, setFormLoading] = useState(false);
  const history = useHistory();
  const apiUrl = useApiUrl();

  const { data, isLoading } = useCustom<any>({
    url: `${apiUrl}/question/getQuestions`,
    method: "get",
  });

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
    action: "create",
    successNotification: { message: "Created successfully!" },
  });

  const submitForm = (formData: any) => {
    setFormLoading(true);
    createQuestion(formData)
      .then((res: any) => {
        history.push("/questions");
        openNotification("Questions has been added successfully!", "success");
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
        labelCol={{offset: 0}}
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
            placeholder={placeholder}
            defaultValue={items[0]}
            options={items?.map((val: any) => ({
              label: callback ? callback(val) : val,
              value: val,
            }))}
            loading={isLoadingEnum}
          />
        )}
      </Form.Item>
    );
  };

  return (
    <>
      <Spin spinning={formLoading}>
        <Create saveButtonProps={saveButtonProps}>
          <Form
            layout="vertical"
            {...formProps}
            name="form"
            {...formItemLayoutWithOutLabel}
            initialValues={{
              questions: [
                {
                  question: "",
                  firstOption: "",
                  secondOption: "",
                  thirdOption: "",
                },
              ],
            }}
            onFinish={submitForm}
          >
            <Form.List name="questions">
              {(fields, { add, remove }) => {
                return (
                  <Table dataSource={fields} loading={isLoading} rowKey="id" scroll={{ x: 2000 }}>
                    <Table.Column
                      title="Question"
                      render={(field) => {
                        const name = [field.name, "question"];
                        return _buildFormInputItem(
                          field.index,
                          name,
                          "Question"
                        );
                      }}
                    />
                    <Table.Column
                      title="First option"
                      render={(field) => {
                        const name = [field.name, "firstOption"];
                        return _buildFormInputItem(
                          field.index,
                          name,
                          "First Option"
                        );
                      }}
                    />
                    <Table.Column
                      title="Second option"
                      render={(field) => {
                        const name = [field.name, "secondOption"];
                        return _buildFormInputItem(
                          field.index,
                          name,
                          "Second Option"
                        );
                      }}
                    />
                    <Table.Column
                      title="Third option"
                      render={(field) => {
                        const name = [field.name, "thirdOption"];
                        return _buildFormInputItem(
                          field.index,
                          name,
                          "Third Option"
                        );
                      }}
                    />
                    <Table.Column
                      title="Fourth option"
                      render={(field) => {
                        const name = [field.name, "fourthOption"];
                        return _buildFormInputItem(
                          field.index,
                          name,
                          "Fourth Option"
                        );
                      }}
                    />

                    <Table.Column
                      title="Answer"
                      render={(field) => {
                        const name = [field.name, "answer"];
                        return _buildFormSelectionItem({
                          key: field.index,
                          name: name,
                          items: answerEnumData?.data?.answers,
                          placeholder: "Answer",
                          callback: getAnswersLabel,
                        });
                      }}
                    />
                    <Table.Column
                      title="Grade"
                      render={(field) => {
                        const name = [field.name, "grade"];
                        return _buildFormSelectionItem({
                          key: field.index,
                          name: name,
                          items: gradeEnumData?.data?.grades,
                          placeholder: "Grade",
                          callback: getGradeLabel,
                        });
                      }}
                    />

                    <Table.Column
                      title="Subject"
                      render={(field) => {
                        const name = [field.name, "subject"];
                        return _buildFormSelectionItem({
                          key: field.index,
                          name: name,
                          items:
                            subjectsData?.data?.map((item: any) => item.name) ??
                            [],
                          placeholder: "Subject",
                        });
                      }}
                    />
                    <Table.Column
                      title="Year"
                      render={(field) => {
                        const name = [field.name, "year"];
                        return _buildFormInputItem(field.index, name, "Year", "number");
                      }}
                    />

                    <Table.Column
                      title={
                        <div className="flex gap-2 justify-center">
                          <span className="m-auto">Action</span>
                          <Button
                            onClick={() => {
                              add();
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      }
                      render={(field: any) => {
                        return (
                          <Form.Item>
                            <div className="flex gap-2 flex-row">
                              {fields?.length > 1 ? (
                                <Button
                                  danger
                                  onClick={() => {
                                    remove(field.key);
                                  }}
                                >
                                  Remove
                                </Button>
                              ) : null}
                            </div>
                          </Form.Item>
                        );
                      }}
                    />
                  </Table>
                );
              }}
            </Form.List>
          </Form>
        </Create>
      </Spin>
    </>
  );
};

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
} from "@pankod/refine";
import { useForm } from "antd/lib/form/Form";
import { createQuestion } from "apis/question/question";
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
  question: "",
  A: "",
  B: "",
  C: "",
  D: "",
  answer: "",
};

export const QuestionCreate: React.FC = () => {
  const [formItem] = useForm();
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
            defaultValue={items[0]}
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
        <Create saveButtonProps={saveButtonProps}>
          <div className="flex justify-end my-4">
            <Upload
              accept=".csv,.xlsx,.xls"
              showUploadList={false}
              beforeUpload={(file: any) => {
                Papa.parse(file, {
                  header: true,
                  worker: true,
                  complete: function (results: any) {
                    const questions = results?.data.map((val: any) => ({
                      ...val,
                      question: val?.question?.includes("\>")? val.question : `<p>${val.question}</p>`,
                      A: val?.A?.includes("\>")? val.A : `<p>${val.A}</p>`,
                      B: val?.B?.includes("\>")? val.B : `<p>${val.B}</p>`,
                      C: val?.C?.includes("\>")? val.C : `<p>${val.C}</p>`,
                      D: val?.D?.includes("\>")? val.D : `<p>${val.D}</p>`,
                      description: val?.description?.includes("\>")? val.description : `<p>${val.description}</p>`,
                      metadata: val?.metadata?.includes("\>")? val.metadata : `<p>${val.metadata}</p>`,
                    }));
                    formItem.setFieldsValue({ questions });
                  },
                });

                // Prevent upload
                return false;
              }}
            >
              <Button>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>
          </div>
          <Form
            layout="vertical"
            {...formProps}
            name="form"
            {...formItemLayoutWithOutLabel}
            initialValues={{
              questions: [
                {
                  question: "",
                  A: "",
                  B: "",
                  C: "",
                  D: "",
                },
              ],
            }}
            form={formItem}
            onFinish={submitForm}
          >
            <Form.List name="questions">
              {(fields, { add, remove }) => {
                return (
                  <Table
                    dataSource={fields}
                    loading={isLoading}
                    rowKey="id"
                    scroll={{ x: "4000px" }}
                  >
                    <Table.Column
                      title="Meta Data"
                      render={(field) => {
                        const name = [field.name, "metadata"];
                        return _buildFormTextEditor(
                          field.index,
                          name,
                          "Meta Data",
                          false
                        );
                      }}
                    />
                    <Table.Column
                      title="Question"
                      render={(field) => {
                        const name = [field.name, "question"];
                        return _buildFormTextEditor(
                          field.index,
                          name,
                          "Question"
                        );
                      }}
                    />
                    <Table.Column
                      title="First option"
                      render={(field) => {
                        const name = [field.name, "A"];
                        return _buildFormTextEditor(
                          field.index,
                          name,
                          "First Option"
                        );
                      }}
                    />
                    <Table.Column
                      title="Second option"
                      render={(field) => {
                        const name = [field.name, "B"];
                        return _buildFormTextEditor(
                          field.index,
                          name,
                          "Second Option"
                        );
                      }}
                    />
                    <Table.Column
                      title="Third option"
                      render={(field) => {
                        const name = [field.name, "C"];
                        return _buildFormTextEditor(
                          field.index,
                          name,
                          "Third Option"
                        );
                      }}
                    />
                    <Table.Column
                      title="Fourth option"
                      render={(field) => {
                        const name = [field.name, "D"];
                        return _buildFormTextEditor(
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
                      title="Description"
                      render={(field) => {
                        const name = [field.name, "description"];
                        return _buildFormTextEditor(
                          field.index,
                          name,
                          "Description",
                          false
                        );
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
                        return _buildFormInputItem(
                          field.index,
                          name,
                          "Year",
                          "number"
                        );
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

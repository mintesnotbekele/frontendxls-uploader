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
import * as XLSX from 'xlsx';
import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import TextEditor from "../../components/text-editor";
import { createSubject } from "../../apis/subject/subject.api";

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
  question: "",
  A: "",
  B: "",
  C: "",
  D: "",
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
          value = {formProps.form.getFieldValue(name)}
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

  const _buildFormSelectionItemForSubjects = ({
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
        initialValue={items && items[0]?.id}
        rules={[
          {
            required: true,
            message: validationLabel,
          },
        ]}
      >
        {items && (
          <Select
            inputValue={items[0]?.id}
            options={items?.map((item: any) => ({
              label: callback ? callback(item.name) : item.name,
              value: item.id,
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
          <div className={'inline-grid'}>
            <div className="w-full flex justify-end my-4">
              <Upload
                accept=".csv,.xlsx,.xls"
                showUploadList={false}
                beforeUpload={(file: any) => {
                  if(file.type?.includes('csv')) {
                    Papa.parse(file, {
                      header: true,
                      worker: true,
                      complete: function (results: any) {
                        const questions = results?.data.map((val: any) => ({
                          ...val,
                          question: val?.question?.includes("\>")? val.question : val.question && `<p>${val.question}</p>`,
                          A: val?.A?.includes("\>")? val.A : val.A && `<p>${val.A}</p>`,
                          B: val?.B?.includes("\>")? val.B : val.B && `<p>${val.B}</p>`,
                          C: val?.C?.includes("\>")? val.C : val.C && `<p>${val.C}</p>`,
                          D: val?.D?.includes("\>")? val.D : val.D && `<p>${val.D}</p>`,
                          description: val?.description?.includes("\>")? val.description : val.description && `<p>${val.description}</p>`,
                          metadata: val?.metadata?.includes("\>")? val?.metadata : val.metadata && `<p>${val.metadata}</p>`,
                        }));
                        formProps.form.setFieldsValue({ questions });
                      },
                    });
                  } else if(file.type?.includes('spreadsheet')) {
                    //f = file
                    var name = file.name;
                    const reader = new FileReader();
                    reader.onload = (evt) => { // evt = on_file_select event
                        // Parse data
                        const bstr = evt.target?.result;
                        const wb = XLSX.read(bstr, {type:'binary'});
                        
                        // Get first worksheet
                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];
                        
                        // Convert sheet to json array
                        const data = XLSX.utils.sheet_to_json(ws, {});
                        
                        // Extract required info from json array
                        const questions:any = [];
                        data.forEach(async (item:any) => {
                          if(item.subject && !subjectsData?.data?.map((x:any) => x.name?.toString().toLowerCase()).includes(item.subject?.toLowerCase()) ) {
                            // Create the subject because it doesn't exist
                            const response = await createSubject({name: toSubjectCase(item.subject)});
                            // console.log('Create subject response: ', response);
                            item.subject = response?.data?.id;
                          } else {
                            item.subject = subjectsData?.data?.find((x:any) => x.name?.toString().toLowerCase() == item.subject?.toLowerCase())?.id;
                          }

                          console.log(item);

                          questions.push({
                            ...item,
                            question: item?.question?.includes("\>")? item.question : item.question && `<p>${item.question}</p>`,
                            A: item?.A?.toString().includes("\>")? item.A : item.A && `<p>${item.A}</p>`,
                            B: item?.B?.toString().includes("\>")? item.B : item.B && `<p>${item.B}</p>`,
                            C: item?.C?.toString().includes("\>")? item.C : item.C && `<p>${item.C}</p>`,
                            D: item?.D?.toString().includes("\>")? item.D : item.D && `<p>${item.D}</p>`,
                            description: item?.description?.includes("\>")? item.description : item.description && `<p>${item.description}</p>`,
                            metadata: item?.metadata?.includes("\>")? item?.metadata : item.metadata && `<p>${item.metadata}</p>`,
                          });
                        });
                        formProps.form.setFieldsValue({ questions });
                    };
                    reader.readAsBinaryString(file);
                  }
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
              className="w-full overflow-auto"
              layout="vertical"
              {...formProps}
              name="form"
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
                      key="questions"
                    >
                      <Table.Column
                        title="Meta Data"
                        key={"metadata"}
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
                        key={"question"}
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
                        key={"A"}
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
                        key={"B"}
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
                        key={"C"}
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
                        key={"D"}
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
                        key={"answer"}
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
                        key={"description"}
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
                        key={"grade"}
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
                        key={"subject"}
                        render={(field) => {
                          const name = [field.name, "subject"];
                          return _buildFormSelectionItemForSubjects({
                            key: field.index,
                            name: name,
                            items:
                              subjectsData?.data ?? [],
                            placeholder: "Subject",
                          });
                        }}
                      />
                      <Table.Column
                        title="Year"
                        key={"year"}
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
                        key={"action"}
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
          </div>
        </Create>
      </Spin>
    </>
  );
};

// Generic string formatter for subject names
const toSubjectCase = (str: String) => {
  return (str.substring(0,1).toUpperCase()+str.substring(1).toLowerCase()).trim();
}
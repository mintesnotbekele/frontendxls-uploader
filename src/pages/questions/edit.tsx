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
    formData.id = history.location.pathname.split('/').pop();
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
  const Option =Select;
  const unitOptions = ["1","2"," 3","4","5","6","7","8","9","10","11","12","13",];
  const sections = ["911","1012"];
  const _buildUnitFormInputItem = (
    key: string,
    name: any,
    unit: any,
    placeholder: string = "",
    type: string = "text"
  ) => {
    return (
      <><Form.Item
        labelCol={{ offset: 0 }}
        key={name + key}
        name={name}
        required={['unit'].includes(unit)}
       
      >
         <Select>
          
         {unitOptions.map((item,index)=>{
         return <Option key={index} value={item}>{item}</Option>
     })}
        </Select>
      </Form.Item>
      </>
      
    );
  };


  const _buildSectionFormInputItem = (
    key: string,
    name: any,
    unit: any,
    placeholder: string = "",
    type: string = "text"
  ) => {
    return (
      <><Form.Item
        labelCol={{ offset: 0 }}
        key={name + key}
        name={name}
      >
        <Select>
        {unitOptions.map((item,index)=>{
         return <Option key={index} value={item}>{item}</Option>
     })}
        </Select>
      </Form.Item>
      </>
      
    );
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
              key: item.id
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
                pageHeaderProps={{title: 'Edit Question'}}
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
                  <div className="flex flex-col items-start">
                    <div className="mx-5">
                      <p className="text-gray-400 text-sm font-bold pl-2">Number</p>
                      {_buildFormInputItem("12", "number", "Number", "number")}
                    </div>

                    
                    <div className="flex flex-wrap">
                      <div className="mx-5">
                        <p className="text-gray-400 text-sm font-bold pl-2">Metadata</p>
                        {_buildFormTextEditor(
                          "1",
                          "metadata",
                          "Meta Data",
                          false
                        )}                      
                      </div>

                      <div className="mx-5">
                        <p className="text-gray-400 text-sm font-bold pl-2">Question</p>
                        {_buildFormTextEditor("2", "question", "Question")}
                      </div>

                      <div className="mx-5">
                        <p className="text-gray-400 text-sm font-bold pl-2">Description</p>
                        {_buildFormTextEditor(
                          "8",
                          "description",
                          "Description",
                          false
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap">
                      <div className="mx-5">
                        <p className="text-gray-400 text-sm font-bold pl-2">First Option</p>
                        {_buildFormTextEditor("3", "A", "First Option")}
                      </div>
                      <div className="mx-5">
                        <p className="text-gray-400 text-sm font-bold pl-2">Second Option</p>
                        {_buildFormTextEditor("4", "B", "Second Option")}
                      </div>
                      <div className="mx-5">
                        <p className="text-gray-400 text-sm font-bold pl-2">Third Option</p>
                        {_buildFormTextEditor("5", "C", "Third Option")}
                      </div>
                      <div className="mx-5">
                        <p className="text-gray-400 text-sm font-bold pl-2">Fourth Option</p>
                        {_buildFormTextEditor("6", "D", "Fourth Option")}
                      </div>
                    </div>

                    <div className="flex flex-wrap">
                      <div className="mx-5">
                        <p className="text-gray-400 text-sm font-bold pl-2">Answer</p>
                        {_buildFormSelectionItem({
                          key: "7",
                          name: "answer",
                          items: answerEnumData?.data?.answers,
                          placeholder: "Answer",
                          callback: getAnswersLabel,
                        })}
                      </div>

                      <div className="mx-5">
                        <p className="text-gray-400 text-sm font-bold pl-2">Grade</p>
                        {_buildFormSelectionItem({
                          key: "9",
                          name: "grade",
                          items: gradeEnumData?.data?.grades,
                          placeholder: "Grade",
                          callback: getGradeLabel,
                        })}
                      </div>
                      <div className="mx-5">
                        <p className="text-gray-400 text-sm font-bold pl-2">Subject</p>
                        {_buildFormSelectionItemForSubjects({
                          key: "10",
                          name: "subject",
                          items: subjectsData?.data ?? [],
                          placeholder: "Subject",
                        })}
                      </div>
                      <div className="mx-5">
                        <p className="text-gray-400 text-sm font-bold pl-2">Year</p>
                        {_buildFormInputItem("11", "year", "Year", "number")}
                      </div>
                      <div className="mx-5">
                        <p className="text-gray-400 text-sm font-bold pl-2">Unit</p>
                        { _buildUnitFormInputItem("11", "unit", "unit", "number")}
                      </div>
                      <div className="mx-5">
                        <p className="text-gray-400 text-sm font-bold pl-2">Section</p>
                        { _buildSectionFormInputItem("11", "section", "section", "number")}
                      </div>
                    </div>
                  </div>
                </Form>
              </Edit>
            </Card>
          </Col>
        </Row>
      </Spin>
    </>
  );
};

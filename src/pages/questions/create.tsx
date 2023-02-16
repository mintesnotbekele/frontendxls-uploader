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
import { useEffect, useRef, useState } from "react";
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
  number: "",
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



  const { data: subjectsData, isLoading } =
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
    console.log("ufg");
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
    unit: any,
    placeholder: string = "",
    type: string = "text"
  ) => {
    return (
      <><Form.Item
        labelCol={{ offset: 0 }}
        key={name + key}
        name={name}
        required={['number'].includes(name)}
        rules={[
          {
            required: true,
            message: validationLabel,
          },
        ]}
      >
        <Input type={type} placeholder={placeholder} />
      </Form.Item>
      </>
      
    );
  };

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
        rules={[
          {
            required: true,
            message: validationLabel,
          },
        ]}
      >
        <Input type={type} placeholder={placeholder} />
      </Form.Item>
      </>
      
    );
  };
  const Option = Select;
  const _buildSectionFormInputItem = (
    key: string,
    name: any,
    unit: any,
    placeholder: string = "Section",
    type: string = "text"
  ) => {
    return (
      <><Form.Item
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
        <Select>
          <Option value="911">
            9-11
          </Option>
          <Option value="1012">
            10-11
          </Option>
        </Select>
      </Form.Item>
      </>
      
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
          onChange={(val: any) => null}
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
        initialValue={null}
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
            dropdownStyle={{minWidth: '5em'}}
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
        initialValue={null}
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
            dropdownStyle={{minWidth: '5em'}}
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
                          number: val?.number,
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
                    setFormLoading(true);
                    const reader = new FileReader();
                    reader.onload = (evt) => { // evt = on_file_select event
                        // Parse data
                        const bstr = evt.target?.result;
                        const wb = XLSX.read(bstr, {type:'binary'});
                        
                        // Get first worksheet
                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];

                        // Convert sheet to html
                        const htmlData = XLSX.utils.sheet_to_html(ws, {});                        

                        /** NARRATION:
                         * - Parse the html data
                         * - Get col id prefixes form header row items
                         * - Store the prefixes on a map : colIDs
                         * - Loop over rows
                         * - add questions to list based on id-keys
                         */

                        const tmp = document.createElement('html');
                        tmp.innerHTML = htmlData;
                        let colIDs:any = {};
                        tmp.querySelector('tr')?.querySelectorAll('td').forEach((td:any) => {
                          let fieldName = td?.innerText.toString().trim();
                          if (fieldName == 'number') {
                            if(!colIDs['number'])
                              colIDs['number'] = td.id.substring(0, (td.id.length-1))
                          }else if (fieldName == 'unit') {
                            if(!colIDs['unit'])
                              colIDs['unit'] = td.id.substring(0, (td.id.length-1))
                          } else if (fieldName == 'question') {
                            if(!colIDs['question'])
                              colIDs['question'] = td.id.substring(0, (td.id.length-1))
                          } else if (fieldName == 'A') {
                            if(!colIDs['A'])
                              colIDs['A'] = td.id.substring(0, (td.id.length-1))
                          } else if (fieldName == 'B') {
                            if(!colIDs['B'])
                              colIDs['B'] = td.id.substring(0, (td.id.length-1))
                          } else if (fieldName == 'C') {
                            if(!colIDs['C'])
                              colIDs['C'] = td.id.substring(0, (td.id.length-1))
                          } else if (fieldName == 'D') {
                            if(!colIDs['D'])
                              colIDs['D'] = td.id.substring(0, (td.id.length-1))
                          } else if (fieldName == 'description') {
                            if(!colIDs['description'])
                              colIDs['description'] = td.id.substring(0, (td.id.length-1))
                          } else if (fieldName == 'metadata') {
                            if(!colIDs['metadata'])
                              colIDs['metadata'] = td.id.substring(0, (td.id.length-1))
                          } else if (fieldName == 'answer') {
                            if(!colIDs['answer'])
                              colIDs['answer'] = td.id.substring(0, (td.id.length-1))
                          } else if (fieldName == 'subject') {
                            if(!colIDs['subject'])
                              colIDs['subject'] = td.id.substring(0, (td.id.length-1))
                          } else if (fieldName == 'year') {
                            if(!colIDs['year'])
                              colIDs['year'] = td.id.substring(0, (td.id.length-1))
                          } else if (fieldName == 'grade') {
                            if(!colIDs['grade'])
                              colIDs['grade'] = td.id.substring(0, (td.id.length-1))
                          }
                        });

                        const questions:any = [];
                        let existingSubjects = subjectsData?.data?.map((x:any) => x.name?.toString().toLowerCase());
                        let createList:any = [];
                        // let newSubject 
                        tmp.querySelectorAll('tr').forEach(async (row:any, idx:number) => {
                          if(idx == 0)
                            return;
                          else if(!row.querySelector(`#${colIDs['question']+(idx+1)}`)?.innerText.trim().length)
                            return;

                          // Get subject and check/create it if its new
                          let subject = row.querySelector(`#${colIDs['subject']+(idx+1)}`)?.innerText.trim();
                          let grade = row.querySelector(`#${colIDs['grade']+(idx+1)}`)?.innerText.trim();

                          if(subject.length && subjectsData?.data?.findIndex((x:any) => x.grade.toString().trim() == grade.toString().trim() && x.name?.toString().toLowerCase().trim() == subject?.toLowerCase().trim()) == -1 && !createList.map((x:any) => x.subject).includes(toSubjectCase(subject)) ) {
                            // Add subject to create list
                            createList.push({
                              subject: toSubjectCase(subject),
                              grade: grade.toString().trim()
                            });
                          } else if(subject.length) {
                            subject = subjectsData?.data?.find((x:any) => x.grade.toString().trim() == grade.toString().trim() && x.name?.toString().toLowerCase().trim() == subject?.toLowerCase().trim())?.id;
                          } else {
                            subject = null;
                          }

                          let question:any = {};
                          Object.keys(colIDs).forEach((key:string)=>{
                            question[key] = row.querySelector(`#${colIDs[key]+(idx+1)}`)?.innerHTML;
                            if(key == 'number')
                              question[key] = Number.parseInt(question[key]);
                            else if(key == 'answer' && !['A', 'B', 'C', 'D'].includes(question[key]))
                              question[key] = null;
                            else if(['grade', 'subject'].includes(key) )
                              question[key] = question[key].toString().trim();
                          });
                          question['subject'] = subject;

                          questions.push(question);
                        });

                        // Create missing subjects
                        let parallelTasks:any = [];
                        createList.forEach((item:any) => {
                          parallelTasks.push(createSubject({
                            name: toSubjectCase(item.subject),
                            grade: item.grade,
                          }));
                        });
                        Promise.all(parallelTasks).then((res:any) => {
                          res.forEach((response:any) => {
                            subjectsData?.data.push(response?.data);

                            let matchingQuestions = questions.filter((x:any) => toSubjectCase(x.subject) == response?.data.name);
                            matchingQuestions.forEach((quest:any) => {
                              quest.subject = response?.data.id;
                            });
                          });

                          formProps.form.setFieldsValue({ questions });
                          setFormLoading(false);
                        }).catch(err => {
                          console.log(err);
                          setFormLoading(false);
                        });
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
                    number: "",
                    unit: "",
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
                        title="Number"
                        key={"number"}
                        render={(field) => {
                          const name = [field.name, "number"];
                          return _buildFormInputItem(
                            field.index,
                            name,
                            "number"
                          );
                        }}
                      />
                        <Table.Column
                        title="Unit"
                        key={"unit"}
                        render={(field) => {
                          const name = [field.name, "unit"];
                          return _buildUnitFormInputItem(
                            field.index,
                            name,
                            "unit"
                          );
                        }}
                      />
                       <Table.Column
                        title="Section"
                        key={"section"}
                        render={(field) => {
                          const name = [field.name, "section"];
                          return _buildSectionFormInputItem(
                            field.index,
                            name,
                            "section"
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
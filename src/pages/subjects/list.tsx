import { EditOutlined } from "@ant-design/icons";
import { List, Table,message as alerts, Col, Row, Button, Tag, Switch, ShowButton, Card, Select, Spin, useCustom, useApiUrl, Input, Form, Create, Drawer, useDrawerForm } from "@pankod/refine";
import { openNotification } from "components/feedback/notification";
import TextEditor from "components/text-editor-image";

import { useEffect, useState } from "react";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  toggleSubjectStatus,
  updateSubject,
} from "../../apis/subject/subject.api";

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
  }
};

export const SubjectList: React.FC = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [updated, setUpdated] = useState(false);
  const apiUrl = useApiUrl();
  const { data: gradeEnumData, isLoading: isLoadingGradeEnum } = useCustom<any>(
    {
      url: `${apiUrl}/enum/getGrade`,
      method: "get",
    }
  );
  const {
    formProps,
    drawerProps: createDrawerProps,
    show: createDrawerShow,
    close: createDrawerclose,
    saveButtonProps,
  } = useDrawerForm({
    action: "create",
    successNotification: { message: "Created successfully!" },
  });
  useEffect(() => {
    getSubjectsData();
  }, [updated]);

  const getSubjectsData = () => {
    setIsLoading(true);
    getSubjects()
      .then((res: any) => {
        setSubjects(res?.data);
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
  };

  const submitForm = (formData: any) => {
    setFormLoading(true);
    createSubject(formData)
      .then((res: any) => {
        createDrawerclose();
        setIsUpdate(false);
        getSubjectsData();
        openNotification("Subject has been created successfully!", "success");
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setFormLoading(false));
  };

  const editForm = (formData: any) => {
    setFormLoading(true);
    updateSubject({...formData, id: updateId})
      .then((res: any) => {
        createDrawerclose();
        setIsUpdate(false);
        getSubjectsData();
        openNotification("Subject has been updated successfully!", "success");
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setFormLoading(false));
  };

  const _toggleSubjectStatus = (id: string) => {
    setIsLoading(true);
    toggleSubjectStatus(id)
      .then((res: any) => {
        getSubjectsData();
        openNotification("Subject status has been updated!", "success");
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
  };
  function handleDeleteSubject(id: any): void {
    deleteSubject(id).then((res: any)=>{
      if(res.data.message == "successfully payed")
      {
       alerts.success('subscription successfully payed');
       setUpdated(!updated);
      }else{
       alerts.error('there is some error conatct your administrator');
      }
    })
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <List
            canCreate
            createButtonProps={{
              onClick: () => {
                setIsUpdate(false);
                createDrawerShow();
              },
            }}
          >
            <Table dataSource={subjects} loading={isLoading} rowKey="id">
              <Table.Column dataIndex="id" title="ID" />
              <Table.Column dataIndex="name" title="Subject name" />
              <Table.Column title="Grade" render={(subject) => {
                  return (
                    getGradeLabel(subject.grade)
                  );
                }} />
              <Table.Column dataIndex="quantity" title="Questions" />
              <Table.Column
                title="Is Active"
                render={(subject) => {
                  return (
                    <Switch
                      checked={subject?.isActive}
                      onClick={() => _toggleSubjectStatus(subject.id)}
                    ></Switch>
                  );
                }}
              />
              <Table.Column
                title="Actions"
                align="right"
                render={(subject) => {
               

                  return (
                    <div className="flex gap-1 items-center justify-end">
                      <ShowButton
                        type="link"
                        title=""
                        size="middle"
                        hideText
                        resource={subject}
                        recordItemId={subject?.id}
                      />
                      <Button
                        type="link"
                        size="middle"
                        onClick={() => {
                          setUpdateId(subject?.id);
                          formProps.form.setFieldsValue(subject);
                          setIsUpdate(true);
                          createDrawerShow();
                        }}
                      >
                        <Button onClick={()=>handleDeleteSubject(subject)}>delete</Button>
                        <EditOutlined />
                      </Button>
                    </div>
                  );
                }}
              />
            </Table>
          </List>
        </Col>
      </Row>
      <Drawer {...createDrawerProps}>
        <Spin spinning={formLoading}>
          <Create
            saveButtonProps={saveButtonProps}
            title="Create or update subject"
          >
            <Form
              {...formProps}
              name="form"
              onFinish={isUpdate ? editForm : submitForm}
            >
              <Form.Item
                name={["name"]}
                label="Subject Name"
                rules={[
                  {
                    required: true,
                    message: "Please insert subject name",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name={"grade"}
                initialValue={null}
                label="Grade"
                rules={[
                  {
                    required: true,
                    message: "Please choose grade",
                  },
                ]}
              >
                <Select
                  placeholder={"Grade"}
                  options={gradeEnumData?.data?.grades?.map((val: any) => ({
                    label: getGradeLabel(val),
                    value: val,
                  }))}
                />
              </Form.Item>
              
              <Form.Item
                name={["duration"]}
                label="Duration"
                rules={[
                  {
                    required: true,
                    message: "Please insert Duration",
                  },
                ]}
              >
                <Input type={'number'} />
              </Form.Item>
              
              <Form.Item
                name={["quantity"]}
                label="Quantity"
                rules={[
                  {
                    required: true,
                    message: "Please insert Duration",
                  },
                ]}
              >
                <Input type={'number'} />
              </Form.Item>

              <Form.Item
                labelCol={{ offset: 0 }}
                name={["img"]}
                label="Icon"
              >
                <TextEditor
                  placeholder={'Icon'}
                  onChange={(val: any) => null}
                />
              </Form.Item>
            </Form>
          </Create>
        </Spin>
      </Drawer>
    </>
  );
};

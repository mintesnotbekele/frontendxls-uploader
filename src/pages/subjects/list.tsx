import { EditOutlined } from "@ant-design/icons";
import {
  List,
  Table,
  Col,
  Row,
  Button,
  Form,
  Input,
  Tag,
  Create,
  Drawer,
  useDrawerForm,
  Spin,
  Switch,
  ShowButton,
  EditButton,
  Edit,
} from "@pankod/refine";
import { openNotification } from "components/feedback/notification";

import { useEffect, useState } from "react";
import {
  createSubject,
  getSubjects,
  toggleSubjectStatus,
  updateSubject,
} from "../../apis/subject/subject.api";

export const SubjectList: React.FC = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState("");

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
  }, []);

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
            </Form>
          </Create>
        </Spin>
      </Drawer>
    </>
  );
};

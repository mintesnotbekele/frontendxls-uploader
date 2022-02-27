import {
  List,
  Table,
  useTable,
  Icons,
  Col,
  Card,
  Row,
  FormProps,
  Button,
  Form,
  DatePicker,
  Input,
  HttpError,
  CrudFilters,
  useCustom,
  useApiUrl,
  Tag,
  Create,
  Drawer,
  Divider,
  useDrawerForm,
  Spin,
} from "@pankod/refine";
import { openNotification } from "components/feedback/notification";

import { useEffect, useState } from "react";
import {
  createSubject,
  getSubjects,
  toggleSubjectStatus,
} from "../../apis/subject/subject.api";

interface PostUsersResponse {
  users: any[];
}

const { RangePicker } = DatePicker;
export const SubjectList: React.FC = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
        getSubjectsData();
        openNotification("Subject has been created successfully!", "success");
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
                createDrawerShow();
              },
            }}
          >
            <Table dataSource={subjects} loading={isLoading} rowKey="id">
              <Table.Column dataIndex="name" title="Subject name" />
              <Table.Column
                dataIndex="isActive"
                title="Is Active"
                render={(isActive) => {
                  return (
                    <Tag color={isActive ? "success" : "danger"}>
                      {isActive ? "Active" : "Deactivated"}
                    </Tag>
                  );
                }}
              />
              <Table.Column
                title="Actions"
                render={(subject) => {
                  return (
                    <Button
                      onClick={() => _toggleSubjectStatus(subject.id)}
                      color="success"
                    >
                      {subject?.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  );
                }}
              />
            </Table>
          </List>
        </Col>
      </Row>
      <Drawer {...createDrawerProps}>
        <Spin spinning={formLoading}>
          <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} name="form" onFinish={submitForm}>
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

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
} from "@pankod/refine";
import { useState } from "react";

const answerNames = {
  first_option: "First Option",
  second_option: "Second Option",
  third_option: "Third Option",
  fourth_option: "Fourth Option",
};

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
const initFormData = {
  grade: "grade_8",
  question: "",
  firstOption: "",
  secondOption: "",
  thirdOption: "",
  fourthOption: "",
  answer: "",
};

const { RangePicker } = DatePicker;
export const QuestionList: React.FC = () => {
  const [activeKey, setActiveKey] = useState(0);
  const [formDatas, setFormDatas] = useState([initFormData]);

  const apiUrl = useApiUrl();
  const answers = {};

  const { data, isLoading } = useCustom<any>({
    url: `${apiUrl}/question/getQuestions`,
    method: "get",
  });

  const { data: answerEnumData, isLoading: isLoadingEnum } = useCustom<any>({
    url: `${apiUrl}/enum/getAnswer`,
    method: "get",
  });

  const submitForm = (formData: any) => {};
  const editTab = (targetKey: any, action: any) => {
    if (action === "add") {
      const newFormDatas = [...formDatas];
      newFormDatas.push(initFormData);
      setFormDatas(newFormDatas);
      setActiveKey(activeKey + 1);
    } else {
      const cIndex = parseInt(targetKey);
      const newFormDatas = [...formDatas];
      newFormDatas.splice(cIndex, 1);
      setFormDatas(newFormDatas);
      setActiveKey(cIndex - 1);
    }
  };
  const changeTab = (targetKey: any) => {
    const cIndex = parseInt(targetKey);

    setActiveKey(cIndex);
  };

  const Filter: React.FC<{ formProps: FormProps }> = ({ formProps }) => {
    return (
      <Form layout="vertical" {...formProps} className="flex justify-end gap-4">
        <Form.Item name="q">
          <Input placeholder="Name" prefix={<Icons.SearchOutlined />} />
        </Form.Item>

        <Form.Item name="createdAt">
          <RangePicker />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Search
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const {
    formProps: createFormProps,
    drawerProps: createDrawerProps,
    show: createDrawerShow,
    saveButtonProps: createSaveButtonProps,
  } = useDrawerForm({
    action: "create",
    successNotification: { message: "Created successfully!" },
  });

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
            <Table dataSource={data?.data} loading={isLoading} rowKey="id">
              <Table.Column dataIndex="id" title="Id" />
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
      <Drawer {...createDrawerProps} width={'50%'}>
        <Create saveButtonProps={createSaveButtonProps}>
          
            <Tabs
              type="editable-card"
              onEdit={editTab}
              activeKey={`${activeKey}`}
              onChange={changeTab}
            >
              {formDatas.map((pane: any, index: number) => (
                <Tabs.TabPane
                  tab={"Question " + (index + 1)}
                  key={index}
                  closable={formDatas.length > 1}
                >
                  <Form {...createFormProps} onFinish={submitForm} layout="vertical">
                  <Form.Item
                    label="Question"
                    name="question"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="First option"
                    name="firstOption"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Second option"
                    name="secondOption"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Third option"
                    name="thirdOption"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Fourth Option"
                    name="fourthOption"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Answer"
                    name="answer"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      options={answerEnumData?.data?.answers?.map(
                        (val: any) => ({
                          label: getAnswersLabel(val),
                          value: val,
                        })
                      )}
                      loading={isLoadingEnum}
                    />
                  </Form.Item>
                  </Form>
                </Tabs.TabPane>
              ))}
            </Tabs>
          
        </Create>
      </Drawer>
    </>
  );
};

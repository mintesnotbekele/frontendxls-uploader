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
} from "@pankod/refine";

interface PostUsersResponse {
  users: any[];
}

const { RangePicker } = DatePicker;
export const QuestionList: React.FC = () => {
  const apiUrl = useApiUrl();
  const answers = {};

  const { data, isLoading } = useCustom<any>({
    url: `${apiUrl}/question/getQuestions`,
    method: "get",
  });

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

  return (
    <Row>
      {/* <Col span={24}>
        <Card>
          <Filter formProps={searchFormProps} />
        </Card>
      </Col> */}
      <Col span={24}>
        <List>
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
  );
};

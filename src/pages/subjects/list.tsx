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
export const SubjectList: React.FC = () => {
  const apiUrl = useApiUrl();
  const answers = {};

  const { data, isLoading } = useCustom<any>({
    url: `${apiUrl}/subject/getSubjects`,
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
            <Table.Column dataIndex="name" title="Subject name" />
            <Table.Column
              dataIndex="isActive"
              title="Is Active"
              render={(isActive) => {
                return <Tag color={isActive?"success":'danger'}>{isActive? 'Active': 'Deactivated'}</Tag>
              }}
            />
          </Table>
        </List>
      </Col>
    </Row>
  );
};

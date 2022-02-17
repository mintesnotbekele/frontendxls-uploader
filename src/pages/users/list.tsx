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
export const UserList: React.FC = () => {
  const apiUrl = useApiUrl();

  const { data, isLoading } = useCustom<any>({
    url: `${apiUrl}/users/getUsers`,
    method: "get",
  });
  // const { tableProps, sorter, filters, searchFormProps } = useTable<
  //   IUser,
  //   HttpError,
  //   IUserFilterVariables
  // >({
  //   onSearch: (params) => {
  //     const filters: CrudFilters = [];
  //     const { q, createdAt } = params;

  //     filters.push(
  //       {
  //         field: "firstName",
  //         operator: "contains",
  //         value: q,
  //       },

  //       {
  //         field: "createdAt",
  //         operator: "gte",
  //         value: createdAt ? createdAt[0].toISOString() : undefined,
  //       },
  //       {
  //         field: "createdAt",
  //         operator: "lte",
  //         value: createdAt ? createdAt[1].toISOString() : undefined,
  //       }
  //     );

  //     return filters;
  //   },
  // });

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
          <Table dataSource={data?.data?.users} loading={isLoading} rowKey="id">
            <Table.Column dataIndex="firstName" title="First Name"/>
            <Table.Column dataIndex="lastName" title="Last Name" />
            <Table.Column dataIndex="gender" title="Gender" />
            <Table.Column dataIndex="phoneNumber" title="Phone Number" />
            <Table.Column
              dataIndex="roles"
              title="Roles"
              render={(roles) => {
                return roles?.map((role: any) => <Tag color="success">{role?.name}</Tag> );
              }}
            />
          </Table>
        </List>
      </Col>
    </Row>
  );
};

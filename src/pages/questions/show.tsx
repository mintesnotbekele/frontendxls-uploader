import {
  Show,
  useShow,
  Typography,
  Tag,
  useOne,
  Row,
  Col,
  Descriptions,
  Badge,
  Checkbox,
  Timeline,
  Table,
} from "@pankod/refine";

const { Title, Text } = Typography;

export const QuestionShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Row gutter={24} className="flex justify-end flex-wrap">
        <Col>
          <Title level={5}>Address</Title>
          <Text>{`${record?.address?.houseNumber ?? ""}, ${
            record?.address?.woredaOrKebele ?? ""
          }, ${record?.address?.subCity ?? ""}, ${
            record?.address?.city ?? ""
          }`}</Text>
        </Col>
        <Col>
          <Title level={5}>Department</Title>
          <Text>{record?.department?.name}</Text>
        </Col>
      </Row>
      <Descriptions
        title={`${record?.firstName} ${record?.middleName ?? ""} ${
          record?.lastName
        } (${record?.role?.name})`}
        layout="vertical"
        bordered
      >
        <Descriptions.Item span={2} label="Email">
          {record?.email}
        </Descriptions.Item>
        <Descriptions.Item label="Phone Number">
          {record?.phoneNumber}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Checkbox checked={!record?.blocked}>
            {record?.blocked ? "Blocked" : "Active"}
          </Checkbox>
        </Descriptions.Item>

        <Descriptions.Item label="Gender">
          <Tag color="success">{record?.gender}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Birth Date">
          {record?.birthDate}
        </Descriptions.Item>

        {record?.educationStatus && (
          <Descriptions.Item span={3} label="Education Status">
            <Table
              bordered
              pagination={false}
              dataSource={record?.educationStatus}
              rowKey="id"
            >
              <Table.Column dataIndex="department" title="Department" />
              <Table.Column
                dataIndex="graduationDate"
                title="Graduation Date"
              />
              <Table.Column dataIndex="level" title="Level" />
            </Table>
          </Descriptions.Item>
        )}
        {record?.christianityName && (
          <Descriptions.Item span={2} label="Christianity Name">
            {record?.christianityName}
          </Descriptions.Item>
        )}
        {record?.church && (
          <Descriptions.Item label="Church">{record?.church}</Descriptions.Item>
        )}
        {record?.salary && (
          <Descriptions.Item span={2} label="Salary">
            {record?.salary} {record?.currency}
          </Descriptions.Item>
        )}
        {record?.maritalStatus && (
          <Descriptions.Item label="Marital Status">
            {record?.maritalStatus}
          </Descriptions.Item>
        )}
        {record?.detail && (
          <Descriptions.Item span={3} label="Detail">
            {record?.detail}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Show>
  );
};

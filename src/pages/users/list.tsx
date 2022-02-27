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
import { toggleUserStatus, getUsers } from "apis/users/users.api";
import { openNotification } from "components/feedback/notification";
import { useEffect, useState } from "react";

interface PostUsersResponse {
  users: any[];
}

const { RangePicker } = DatePicker;
export const UserList: React.FC = () => {
  const apiUrl = useApiUrl();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUsersData();
  }, []);

  const getUsersData = () => {
    setIsLoading(true);
    getUsers()
      .then((res: any) => {
        setUsers(res?.data?.users);
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
  };

  const _toggleUserStatus = (id: string) => {
    setIsLoading(true);
    toggleUserStatus(id)
      .then((res: any) => {
        getUsersData();
        openNotification("User status has been updated successfully!", "success");
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
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
          <Table dataSource={users} loading={isLoading} rowKey="id">
            <Table.Column dataIndex="firstName" title="First Name" />
            <Table.Column dataIndex="lastName" title="Last Name" />
            <Table.Column dataIndex="gender" title="Gender" />
            <Table.Column dataIndex="phoneNumber" title="Phone Number" />
            <Table.Column
              dataIndex="roles"
              title="Roles"
              render={(roles) => {
                return roles?.map((role: any) => (
                  <Tag color="success">{role?.name}</Tag>
                ));
              }}
            />
            <Table.Column
              title="Actions"
              render={(user) => {
                return user?.roles?.find(
                  (role: any) => role.name === "admin"
                ) ? null : (
                  <Button
                    onClick={() => _toggleUserStatus(user.id)}
                    color="success"
                  >
                    {user?.isActive ? "Deactivate" : "Activate"}
                  </Button>
                );
              }}
            />
          </Table>
        </List>
      </Col>
    </Row>
  );
};

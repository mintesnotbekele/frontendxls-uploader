import { List, Table, Col, Row, Button, Tag, Switch, ShowButton } from "@pankod/refine";
import { toggleUserStatus, getUsers } from "apis/users/users.api";
import { openNotification } from "components/feedback/notification";
import { useEffect, useState } from "react";

export const UserList: React.FC = () => {
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
        openNotification(
          "User status has been updated successfully!",
          "success"
        );
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
              dataIndex='hasActiveSubscription'
              title="Subscription"
              render={(hasActiveSubscription:boolean, obj:any) => {
                return (hasActiveSubscription != null) ? <Tag color={hasActiveSubscription ? 'success':'red'} className='text-center'>
                  <span className="text-sm">
                    {new Date(obj.subscriptionExpiresAt).toLocaleDateString()}
                    <br />
                    {new Date(obj.subscriptionExpiresAt).toLocaleTimeString()}
                  </span>
                </Tag> : '';
              }}
            />
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
                  <div className="flex gap-1 items-center">
                    <Switch
                      checked={user?.isActive}
                      onClick={() => _toggleUserStatus(user.id)}
                    ></Switch>
                    <ShowButton type="link" size="middle" hideText recordItemId={user?.id}/>
                  </div>
                );
              }}
            />
          </Table>
        </List>
      </Col>
    </Row>
  );
};

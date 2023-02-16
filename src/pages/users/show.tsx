import { UserOutlined } from "@ant-design/icons";
import {
  Show,
  Typography,
  Descriptions,
  useCustom,
  useApiUrl,
  useShow,
  Avatar,
} from "@pankod/refine";

const { Title, Text } = Typography;
const getGenderLabel = (option: string) => {
  switch (option) {
    case "male":
      return "Male";
    case "female":
      return "Female";
    default:
      return "Male";
  }
};

export const UserShow = () => {
  const { queryResult } = useShow({
    resource: "users/getUser",
    errorNotification: { message: "Error getting data" },
  });
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading} resource="users/getUser" title="Show user info" >
      <div className="mb-2">
        <Avatar
          src={`${record?.profilePicture}`}
          size={64}
          icon={<UserOutlined />}
        />
      </div>
      <Title level={5}>Id</Title>
      <Text>{record?.id}</Text>

      <Title level={5}>Name</Title>
      <Text>
        {record?.firstName} {record?.lastName}
      </Text>

      <Title level={5}>Phone Number</Title>
      <Text>{record?.phoneNumber}</Text>

      <Title level={5}>Gender</Title>
      <Text>{getGenderLabel(record?.gender)}</Text>
    </Show>
  );
};

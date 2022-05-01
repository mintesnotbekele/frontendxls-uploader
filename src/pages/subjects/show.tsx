import {
  Show,
  Typography,
  useApiUrl,
  useCustom,
  useShow,
} from "@pankod/refine";

const { Title, Text } = Typography;

export const SubjectShow = () => {
  const { queryResult } = useShow({
    resource: "subject/getSubject",
    errorNotification: { message: "Error getting data" },
  });
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <h1>{record?.id}</h1>
      <h1>{record?.name}</h1>
    </Show>
  );
};

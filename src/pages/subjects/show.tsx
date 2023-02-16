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
      <h1>{(record?.quantity ? record?.quantity:0) + ' Questions'}</h1>
      <h1>{(record?.duration ? record?.duration:0) + ' Minutes'}</h1>
      <div
        style={{ maxWidth: "300px" }}
        dangerouslySetInnerHTML={{
          __html: record?.img?.replace(
            /(<? *script)/gi,
            "illegalscript"
          ),
        }}
      ></div>
    </Show>
  );
};

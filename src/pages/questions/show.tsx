import { Show, useShow, Typography, Checkbox } from "@pankod/refine";

const { Title, Text } = Typography;

export const QuestionShow = () => {
  const { queryResult } = useShow({
    resource: "question/getQuestion",
    errorNotification: { message: "Error getting data" },
  });
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <div
        dangerouslySetInnerHTML={{
          __html: record?.metadata?.replace(/(<? *script)/gi, "illegalscript"),
        }}
      ></div>
      <div
        dangerouslySetInnerHTML={{
          __html: record?.description?.replace(
            /(<? *script)/gi,
            "illegalscript"
          ),
        }}
      ></div>
      <div
        dangerouslySetInnerHTML={{
          __html: record?.question?.replace(/(<? *script)/gi, "illegalscript"),
        }}
      ></div>
      <div className="mx-5">
        <div className="flex gap-2">
          <Title level={5}>
            <Checkbox checked={record?.answer === "A"}>A.</Checkbox>
          </Title>
          <div
            dangerouslySetInnerHTML={{
              __html: record?.A?.replace(/(<? *script)/gi, "illegalscript"),
            }}
          ></div>
        </div>
        <div className="flex gap-2">
          <Title level={5}>
            <Checkbox checked={record?.answer === "B"}>B.</Checkbox>
          </Title>
          <div
            dangerouslySetInnerHTML={{
              __html: record?.B?.replace(/(<? *script)/gi, "illegalscript"),
            }}
          ></div>
        </div>
        <div className="flex gap-2">
          <Title level={5}>
            <Checkbox checked={record?.answer === "C"}>C.</Checkbox>
          </Title>
          <div
            dangerouslySetInnerHTML={{
              __html: record?.C?.replace(/(<? *script)/gi, "illegalscript"),
            }}
          ></div>
        </div>
        <div className="flex gap-2">
          <Title level={5}>
            <Checkbox checked={record?.answer === "D"}>D.</Checkbox>
          </Title>
          <div
            dangerouslySetInnerHTML={{
              __html: record?.D?.replace(/(<? *script)/gi, "illegalscript"),
            }}
          ></div>
        </div>
      </div>
    </Show>
  );
};

import { DeleteOutlined } from "@ant-design/icons";
import {
  List,
  Table,
  Col,
  Row,
  Tag,
  ShowButton,
  Button,
  Popconfirm,
  EditButton,
} from "@pankod/refine";
import { getQuestions, deleteQuestion } from "apis/question/question";
import { openNotification } from "components/feedback/notification";
import { useEffect, useState } from "react";

export const QuestionList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getQuestionData();
  }, []);

  const getQuestionData = () => {
    setIsLoading(true);
    getQuestions()
      .then((res: any) => {
        setQuestions(res?.data);
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
  };

  const _deleteQuestion = (id: string) => {
    let removeIndex = questions.map((item: any) => item.id).indexOf(id);
    setIsLoading(true);
    deleteQuestion(id)
      .then((res: any) => {
        const updatedQuestions = questions.filter(
          (item: any) => item?.id !== id
        );
        setQuestions(updatedQuestions);
        openNotification(`Deleted Successfully!`, "success");
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <List canCreate>
            <Table
              dataSource={questions}
              loading={isLoading}
              rowKey="id"
              scroll={{ x: "4000px" }}
            >
              <Table.Column
                dataIndex="metadata"
                title="Meta Data"
                render={(data) => {
                  return (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data || "No Meta Data",
                      }}
                    ></div>
                  );
                }}
              />
              <Table.Column
                dataIndex="question"
                title="Question"
                render={(data) => {
                  return (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data,
                      }}
                    ></div>
                  );
                }}
              />
              <Table.Column
                title="First option"
                render={(data) => {
                  return (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data?.A.replace(
                          /(<? *script)/gi,
                          "illegalscript"
                        ),
                      }}
                    ></div>
                  );
                }}
              />
              <Table.Column
                title="Second option"
                render={(data) => {
                  return (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data?.B.replace(
                          /(<? *script)/gi,
                          "illegalscript"
                        ),
                      }}
                    ></div>
                  );
                }}
              />
              <Table.Column
                title="Third option"
                render={(data) => {
                  return (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data?.C.replace(
                          /(<? *script)/gi,
                          "illegalscript"
                        ),
                      }}
                    ></div>
                  );
                }}
              />
              <Table.Column
                title="Fourth option"
                render={(data) => {
                  return (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data?.D.replace(
                          /(<? *script)/gi,
                          "illegalscript"
                        ),
                      }}
                    ></div>
                  );
                }}
              />
              <Table.Column
                title="Actions"
                render={(question) => {
                  return (
                    <div className="flex gap-1 items-center">
                      <ShowButton
                        type="link"
                        size="middle"
                        hideText
                        recordItemId={question?.id}
                      />
                      <EditButton
                        type="link"
                        size="middle"
                        hideText
                        recordItemId={question?.id}
                      />
                      <Popconfirm
                        title="Are you sure to delete this question?"
                        onConfirm={() => _deleteQuestion(question?.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined
                          type="link"
                          style={{ color: "red" }}
                        ></DeleteOutlined>
                      </Popconfirm>
                    </div>
                  );
                }}
              />
            </Table>
          </List>
        </Col>
      </Row>
    </>
  );
};

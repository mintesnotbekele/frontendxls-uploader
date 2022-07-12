import { DeleteOutlined, OrderedListOutlined, PlusOutlined, PlusSquareOutlined, TableOutlined } from "@ant-design/icons";
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
  Form,
  Icons,
  Input,
  Card,
  DatePicker,
  FormProps,
  useCustom,
  useApiUrl,
  Select,
  Spin,
  Typography, 
  Checkbox,
} from "@pankod/refine";
import { Pagination } from "antd";
import { getQuestions, deleteQuestion } from "apis/question/question";
import { openNotification } from "components/feedback/notification";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
const validationLabel = "Please insert a value to the input field";
const { RangePicker } = DatePicker;
const { Option } = Select;

const { Title, Text } = Typography;

const gradeNames = {
  grade_8: "Grade 8",
  grade_12_social: "Grade 12 Social",
  grade_12_natural: "Grade 12 Natural",
};

const getGradeLabel = (option: string) => {
  switch (option) {
    case "grade_8":
      return gradeNames.grade_8;
    case "grade_12_social":
      return gradeNames.grade_12_social;
    case "grade_12_natural":
      return gradeNames.grade_12_natural;
    default:
      return 'Please select grade.'
  }
};

const generateArrayOfYears = () => {
  let max = new Date().getFullYear();
  let min = max - 20;
  let years = [];

  for (var i = max; i >= min; i--) {
    years.push(`${i}`);
  }
  return years;
};

export const QuestionList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState();
  const [yearFilter, setYearFilter] = useState();
  const [gradeFilter, setGradeFilter] = useState();
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [view, setView] = useState(1);
  const history = useHistory();
  const apiUrl = useApiUrl();
  var limit = 10;
  var offset = 0;

  useEffect(() => {
    limit = 10;
    offset = 0;
    getQuestionData();
  }, []);

  const { data: subjectsData, isLoading: isLoadingSubjectsData } =
    useCustom<any>({
      url: `${apiUrl}/subject/getSubjects`,
      method: "get",
    });

  const { data: gradeEnumData, isLoading: isLoadingGradeEnum } = useCustom<any>(
    {
      url: `${apiUrl}/enum/getGrade`,
      method: "get",
    }
  );

  const changePageProps = (page:number, pageSize:number) => {
    limit = pageSize;
    offset = page * limit - limit;
    getQuestionData();
  }

  const getQuestionData = () => {
    setIsLoading(true);
    getQuestions({year: yearFilter, subject: subjectFilter , grade: gradeFilter, offset, limit})
    .then((res: any) => {
      setCurrent(res.data.metadata.offset/res.data.metadata.limit + 1);
      setTotal(res?.data?.metadata.total);
      setQuestions(res?.data.questions);
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

  const Filter: React.FC = () => {
    return (
      <Spin spinning={isLoadingGradeEnum || isLoadingSubjectsData || isLoading}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Select
              style={{minWidth: '7em'}}
              allowClear
              value={gradeFilter}
              placeholder={'Grade'}
              onChange={(val:any) => setGradeFilter(val)}
            >
              {gradeEnumData?.data?.grades?.map((grade: any) => (
                <Option value={grade} key={grade}>
                  {getGradeLabel(grade)}
                </Option>
              ))}
            </Select>
            <Select
              style={{minWidth: '7em'}}
              allowClear
              value={subjectFilter}
              placeholder={'Subject'}
              onChange={(val:any) => setSubjectFilter(val)}
            >
              {subjectsData?.data?.map((subject: any) => {
                return <Option value={subject?.id} key={subject?.id}>
                {subject?.name}
              </Option>
              })}
            </Select>
            <Select
              style={{minWidth: '7em'}}
              allowClear
              value={yearFilter}
              placeholder={'Year'}
              onChange={(val:any) => setYearFilter(val)}
            >
              {generateArrayOfYears()?.map((year: any) => (
                <Option value={year} key={year}>
                  {year}
                </Option>
              ))}
            </Select>
            <Button
              htmlType="submit"
              type="primary"
              onClick={() => getQuestionData()}
            >
              Search
            </Button>

            {view == 2 && <OrderedListOutlined className="ml-5" style={{color: '#0007', fontSize: '2.25em'}} onClick={()=>{setView(1)}} />}
            {view == 1 && <TableOutlined className="ml-5" style={{color: '#0007', fontSize: '2.25em'}} onClick={()=>{setView(2)}} />}
            <span className="ml-5 flex items-center text-gray-700 text-base"> Total: {total} </span>
          </div>
          <div 
            style={{transform: 'scale(.9)'}}
            className="flex items-center text-base text-gray-700 border-2 border-gray-700 pl-3 py-1 cursor-pointer ml-auto mr-4" 
            onClick={()=>{history.push("/questions/create");}}>
              Create
              <PlusOutlined className="mx-2 font-bold" style={{color: '#000'}}/>
          </div>
        </div>
      </Spin>
    );
  };

  return (
    <>
      <div className="inline-grid w-full">
          <Card title="Filters" style={{marginBottom: '2em'}}>
            <Filter />
          </Card>
          {(view == 2) && 
            <div className="w-full overflow-auto flex flex-col pb-16">
              <Table
                dataSource={questions}
                pagination={false}
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
                        style={{ maxWidth: "300px" }}
                        dangerouslySetInnerHTML={{
                          __html: data ? (data?.length < 150  ? data:data.substring(0, 150)+'...') : 'No metadata',
                        }}
                      ></div>
                    );
                  }}
                />
                <Table.Column
                  dataIndex="number"
                  title="Number"
                  render={(data) => {
                    return (
                      <div
                        style={{ maxWidth: "300px" }}
                        dangerouslySetInnerHTML={{
                          __html: data,
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
                        style={{ maxWidth: "300px" }}
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
                        style={{ maxWidth: "300px" }}
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
                        style={{ maxWidth: "300px" }}
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
                        style={{ maxWidth: "300px" }}
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
                        style={{ maxWidth: "300px" }}
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
              {total ? <Pagination className="self-end" defaultCurrent={1} current={current} total={total} onChange={changePageProps} /> : ''}
          </div>}
          {(view == 1) && 
          <Spin spinning={isLoadingGradeEnum || isLoadingSubjectsData || isLoading}>
            <div className="flex flex-col pb-16">
              {questions.map((record:any) => {
                return <div key={record.id} className="border-b-2 pb-5 mb-8">
                  {/* Metadata */}
                  <div
                    className="text-gray-500 mb-5"
                    dangerouslySetInnerHTML={{
                      __html: record?.metadata?.replace(/(<? *script)/gi, "illegalscript"),
                    }}
                  ></div>
                  {/* Question */}
                  <div className="flex justify-between items-start">
                    <div className="flex">
                      <strong className="mr-3"> {record.number + '.)'} </strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: record?.question?.replace(/(<? *script)/gi, "illegalscript"),
                        }}
                      ></div>
                    </div>
                    <div className="flex gap-1 items-center">
                      <ShowButton
                        type="link"
                        size="middle"
                        hideText
                        recordItemId={record?.id}
                      />
                      <EditButton
                        type="link"
                        size="middle"
                        hideText
                        recordItemId={record?.id}
                      />
                      <Popconfirm
                        title="Are you sure to delete this question?"
                        onConfirm={() => _deleteQuestion(record?.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined
                          type="link"
                          style={{ color: "red" }}
                        ></DeleteOutlined>
                      </Popconfirm>
                    </div>
                  </div>
                  {/* Description */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: record?.description?.replace(
                        /(<? *script)/gi,
                        "illegalscript"
                      ),
                    }}
                  ></div>
                  {/* Answers */}
                  <div className="mx-5">
                    <div className="flex gap-2">
                      <Title level={5}>
                        <Checkbox disabled checked={record?.answer === "A"}>A.</Checkbox>
                      </Title>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: record?.A?.replace(/(<? *script)/gi, "illegalscript"),
                        }}
                      ></div>
                    </div>
                    <div className="flex gap-2">
                      <Title level={5}>
                        <Checkbox disabled checked={record?.answer === "B"}>B.</Checkbox>
                      </Title>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: record?.B?.replace(/(<? *script)/gi, "illegalscript"),
                        }}
                      ></div>
                    </div>
                    <div className="flex gap-2">
                      <Title level={5}>
                        <Checkbox disabled checked={record?.answer === "C"}>C.</Checkbox>
                      </Title>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: record?.C?.replace(/(<? *script)/gi, "illegalscript"),
                        }}
                      ></div>
                    </div>
                    <div className="flex gap-2">
                      <Title level={5}>
                        <Checkbox disabled checked={record?.answer === "D"}>D.</Checkbox>
                      </Title>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: record?.D?.replace(/(<? *script)/gi, "illegalscript"),
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              })}
              {total ? <Pagination className="self-end" defaultCurrent={1} current={current} total={total} onChange={changePageProps} /> : ''}
            </div>
          </Spin>}
      </div>
    </>
  );
};

import { OrderedListOutlined, PlusOutlined, TableOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  useCustom,
  useApiUrl,
  Select,
  Spin,
  Table,
} from "@pankod/refine";
import { getStudies, deleteStudy } from "apis/study/study";
import { openNotification } from "components/feedback/notification";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const { Option } = Select;

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

export const StudyList: React.FC = () => {
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
  const columns = [
    {
      title: 'grade',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: 'year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    
  ];
  useEffect(() => {
    limit = 10;
    offset = 0;
    getStudiesData();
  }, []);

  useEffect(()=>{
    if(gradeFilter != subjectsData?.data.find((x:any) => x.id == subjectFilter)?.grade)
      setSubjectFilter(undefined);
  }, [gradeFilter]);

  useEffect(()=>{
    if(!gradeFilter)
      setGradeFilter(subjectsData?.data.find((x:any) => x.id == subjectFilter)?.grade);
  }, [subjectFilter])

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
    getStudiesData();
  }

  const getStudiesData = () => {
    setIsLoading(true);
    getStudies({year: yearFilter, subject: subjectFilter , grade: gradeFilter, offset, limit})
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
    deleteStudy(id)
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
              {subjectsData?.data?.filter((x:any) => (gradeFilter ? x.grade==gradeFilter:x)).map((subject: any) => {
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
              onClick={() => getStudiesData()}
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
            onClick={()=>{history.push("/study/create");}}>
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
          <Table
                dataSource={questions}
                pagination={false}
                loading={isLoading}
                rowKey="id"
                
                columns={columns}
                >
 

              </Table>
      </div>
    </>
  );
};

import {
  Form,
  Input,
  useCustom,
  useApiUrl,
  useDrawerForm,
  Create,
  Collapse,
  Spin,
  Upload,
  Select,
} from "@pankod/refine";
import { createStudy } from "apis/study/study";
import { openNotification } from "components/feedback/notification";
import { useState } from "react";
import { useHistory } from "react-router-dom";




const { Panel } = Collapse;
const { Option } = Select;


export const StudyCreate: React.FC = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [gradeFilter, setGradeFilter] = useState();
  const history = useHistory();
  const apiUrl = useApiUrl();
  const gradeNames = {
    grade_8: "Grade 8",
    grade_12_social: "Grade 12 Social",
    grade_12_natural: "Grade 12 Natural",
  };
  const [subjectFilter, setSubjectFilter] = useState();
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

  const { data, isLoading } = useCustom<any>({
    url: `${apiUrl}/study/getStudies`,
    method: "get",
  });

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

  const { data: answerEnumData, isLoading: isLoadingEnum } = useCustom<any>({
    url: `${apiUrl}/enum/getAnswer`,
    method: "get",
  });

  const { formProps, saveButtonProps } = useDrawerForm({
    action: "create",
    successNotification: { message: "Created successfully!" },
  });
  function getBase64(file : any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  const submitForm = async (formData: any) => {
    
    var myfile = await getBase64(defaultFileList[0].originFileObj);
    formData.description = myfile;
    setFormLoading(true);
    createStudy(formData)
      .then(() => {
        history.push("/study");
        openNotification("study note has been added successfully!", "success");
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setFormLoading(false));
  };
  const uploadImage = async (options: any) => {
    const { onSuccess } = options;

    onSuccess('OK');
  };
 
  const [defaultFileList, setDefaultFileList] = useState<any[]>([]);
 
  const handleOnChange = ({ fileList} : any) => {
    setDefaultFileList(fileList);
  };




  return (
    <>
      <Spin spinning={formLoading}>
        <Create saveButtonProps={saveButtonProps}>
          <div className={'inline-grid'}>
            
            <Form
              className="w-full overflow-auto"
              layout="vertical"
              {...formProps}
              name="form"
            
              onFinish={submitForm}
            >
               <Form.Item
                name={["grade"]}
                label="grade"
                rules={[
                  {
                    required: true,
                    message: "Please insert grade name",
                  },
                ]}
              >
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
              </Form.Item>
              <Form.Item
                name={["year"]}
                label="year"
                rules={[
                  {
                    required: true,
                    message: "Please insert year",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={["subject"]}
                label="subject"
                rules={[
                  {
                    required: true,
                    message: "Please insert subject",
                  },
                ]}
              >
                <Select
              style={{minWidth: '7em'}}
              allowClear
              value={subjectFilter}
              placeholder={'Subject'}
              onChange={(val:any) => setSubjectFilter(val)}
            >
              {subjectsData?.data?.filter((x:any) => (gradeFilter ? x.grade==gradeFilter:x)).map((subject: any) => {
                return <Option value={subject?.name} key={subject?.id}>
                {subject?.name}
              </Option>
              })}
            </Select>
              </Form.Item>
              <Form.Item
                name={["title"]}
                label="title"
                rules={[
                  {
                    required: true,
                    message: "Please insert title",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={["description"]}
                label="description"
                rules={[
                  {
                    required: true,
                    message: "Please insert description",
                  },
                ]}
              >
                <Upload
                      accept="application/pdf"
                      customRequest={uploadImage}
                      onChange={handleOnChange}
                      listType="picture-card"
                      defaultFileList={defaultFileList}
                      className="image-upload-grid"
                    >
                      {defaultFileList.length >= 1 ? null : (
                        <div>Upload Your Image</div>
                      )}
                    </Upload>
              </Form.Item>
              <Form.Item
                name={["unit"]}
                label="unit"
                rules={[
                  {
                    required: true,
                    message: "Please insert unit",
                  },
                ]}
              >
                <Input />
              </Form.Item>

            </Form>
          </div>
        </Create>
      </Spin>
    </>
  );
};


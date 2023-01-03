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
} from "@pankod/refine";
import { createStudy } from "apis/study/study";
import { openNotification } from "components/feedback/notification";
import { useState } from "react";
import { useHistory } from "react-router-dom";




const { Panel } = Collapse;



export const StudyCreate: React.FC = () => {
  const [formLoading, setFormLoading] = useState(false);

  const history = useHistory();
  const apiUrl = useApiUrl();

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
                <Input />
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
                <Input />
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


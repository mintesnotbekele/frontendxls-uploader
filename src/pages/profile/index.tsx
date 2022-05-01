import { CloseOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Spin,
  Upload,
  useApiUrl,
  useCustom,
} from "@pankod/refine";
import { openNotification } from "components/feedback/notification";
import { API_URL, TOKEN_KEY, USER_KEY } from "../../constants";

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../apis/users/users.api";
const validationLabel = "Please insert a value to the input field";
export const Profile: React.FC = () => {
  const [profileDetail, setProfileDetail] = useState({
    firstName: null,
    lastName: null,
    phoneNumber: null,
    gender: null,
    profilePicture: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = useApiUrl();
  const [isEditing, setIsEditing] = useState(false);

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

  const { data: genderEnumData } = useCustom<any>({
    url: `${apiUrl}/enum/getGender`,
    method: "get",
  });

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = () => {
    // const userData = JSON.parse(localStorage.getItem(USER_KEY) || "{}");
    // setProfileDetail(userData);

    setIsLoading(true);
    getProfile()
      .then((res: any) => {
        setProfileDetail(res?.data);
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
  };

  const submitForm = (formData: any) => {
    setIsLoading(true);
    updateProfile(formData)
      .then((res: any) => {
        openNotification(`Data updated successfully!`, "success");
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
  };

  const _buildFormInputItem = (
    key: string,
    name: any,
    defaultValue: any,
    placeholder: string = "",
    disabled: boolean = false
  ) => {
    return (
      <Form.Item
        key={name + key}
        name={name}
        initialValue={defaultValue}
        rules={[
          {
            required: true,
            message: validationLabel,
          },
        ]}
      >
        <Input disabled={disabled || !isEditing} placeholder={placeholder} />
      </Form.Item>
    );
  };

  const _buildFormSelectionItem = ({
    key,
    name,
    defaultValue,
    items,
    callback,
    placeholder,
  }: any) => {
    return (
      <Form.Item
        key={name + key}
        name={name}
        rules={[
          {
            required: true,
            message: validationLabel,
          },
        ]}
      >
        {defaultValue && items && (
          <Select
            disabled={!isEditing}
            defaultValue={defaultValue}
            options={items?.map((val: any) => ({
              label: callback ? callback(val) : val,
              value: val,
            }))}
          />
        )}
      </Form.Item>
    );
  };

  return (
    <>
      <Spin spinning={isLoading}>
        <Row>
          <Col span={24}>
            <Card className="md:w-1/2" style={{ margin: "auto" }}>
              <div className="flex justify-between">
                <div className="mb-4">
                  <Upload
                    {...{
                      name: "file",
                      action: `${API_URL}/users/updateProfilePicture`,
                      headers: {
                        authorization:
                          `Bearer ${localStorage.getItem(TOKEN_KEY)}` || "",
                      },
                      onChange(info: any) {
                        if (info.file.status !== "uploading") {
                          console.log(info.file, info.fileList);
                        }
                        if (info.file.status === "done") {
                          setProfileDetail({
                            ...profileDetail,
                            profilePicture: info.file.response.profilePicture,
                          });
                          message.success(
                            `${info.file.name} file uploaded successfully`
                          );
                        } else if (info.file.status === "error") {
                          message.error(
                            `${info.file.name} file upload failed.`
                          );
                        }
                      },
                    }}
                  >
                    <Avatar
                      src={`${profileDetail?.profilePicture}`}
                      size={64}
                      icon={<UserOutlined />}
                    />
                  </Upload>
                </div>
                <div className="mb-4 ">
                  {!isEditing ? (
                    <Button type="link" onClick={() => setIsEditing(true)}>
                      <EditOutlined />
                    </Button>
                  ) : (
                    <Button type="link" onClick={() => setIsEditing(false)}>
                      <CloseOutlined />
                    </Button>
                  )}
                </div>
              </div>
              {profileDetail && (
                <Form layout="vertical" name="form" onFinish={submitForm}>
                  {profileDetail?.firstName &&
                    _buildFormInputItem(
                      "firstName",
                      "firstName",
                      profileDetail?.firstName,
                      "John"
                    )}
                  {profileDetail?.lastName &&
                    _buildFormInputItem(
                      "lastName",
                      "lastName",
                      profileDetail?.lastName,
                      "Doe"
                    )}
                  {profileDetail?.phoneNumber &&
                    _buildFormInputItem(
                      "phoneNumber",
                      "phoneNumber",
                      profileDetail?.phoneNumber,
                      "+2519825765",
                      true
                    )}
                  {genderEnumData?.data?.genders &&
                    _buildFormSelectionItem({
                      key: "gender",
                      name: "gender",
                      defaultValue: profileDetail?.gender,
                      items: genderEnumData?.data?.genders ?? [],
                      placeholder: "Gender",
                      callback: getGenderLabel,
                    })}
                  <div className="flex justify-end ml-auto">
                    {isEditing ? (
                      <Button htmlType="submit" type="primary">
                        Submit
                      </Button>
                    ) : null}
                  </div>
                </Form>
              )}
            </Card>
          </Col>
        </Row>
      </Spin>
    </>
  );
};

import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  useApiUrl,
  useCustom,
} from "@pankod/refine";
import { openNotification } from "components/feedback/notification";

import { useEffect, useState } from "react";
import { getProfile } from "../../apis/users/users.api";
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

  const getGenderLabel = (option: string) => {
    switch (option) {
      case "male":
        return "Male";
      case "female":
        return "Female";
    }
  };

  const { data: genderEnumData, isLoading: isLoadingEnum } = useCustom<any>({
    url: `${apiUrl}/enum/getGender`,
    method: "get",
  });

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = () => {
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

  const submitForm = (formData: any) => {};

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
        <Input disabled={disabled} placeholder={placeholder} />
      </Form.Item>
    );
  };

  const _buildFormSelectionItem = ({
    key,
    name,
    items,
    callback,
    placeholder,
  }: any) => {
    return (
      <Form.Item
        key={name + key}
        name={name}
        initialValue={items && items[0]}
        rules={[
          {
            required: true,
            message: validationLabel,
          },
        ]}
      >
        {items && (
          <Select
            placeholder={placeholder}
            defaultValue={items && items[0]}
            options={items?.map((val: any) => ({
              label: callback ? callback(val) : val,
              value: val,
            }))}
            loading={isLoadingEnum}
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
            <Card className="md:w-1/2">
              <div className="mb-4">
                <Avatar
                  src={profileDetail?.profilePicture}
                  size="large"
                  icon={<UserOutlined />}
                />
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
                      items: genderEnumData?.data?.genders ?? [],
                      placeholder: "Gender",
                      callback: getGenderLabel,
                    })}
                  <div className="flex justify-end ml-auto">
                    <Button>
                      <input type="submit" value="Submit" />
                    </Button>
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

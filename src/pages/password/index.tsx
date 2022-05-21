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
export const ChangePassword: React.FC = () => {
  const [security, setSecurity] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = useApiUrl();

  const changePassword = (formData: any) => {};

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

  return (
    <>
      <Spin spinning={isLoading}>
        <Row>
          <Col span={24}>
            <Card className="md:w-1/2" style={{ margin: "auto" }}>
              {security && (
                <Form layout="vertical" name="form" onFinish={changePassword}>
                  {_buildFormInputItem(
                    "oldPassword",
                    "oldPassword",
                    security?.oldPassword,
                    "Old Password",
                  )}
                  {_buildFormInputItem(
                    "newPassword",
                    "newPassword",
                    security?.newPassword,
                    "New Password",
                  )}
                  {_buildFormInputItem(
                    "confirmNewPassword",
                    "confirmNewPassword",
                    security?.confirmNewPassword,
                    "Confirm New Password",
                  )}
                  <div className="flex justify-end ml-auto">
                    <Button htmlType="submit" type="primary">
                      Submit
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

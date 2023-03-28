import { useDrawerForm } from "@pankod/refine";
import { Button, Card, Form, Input } from "antd"
import { useState } from "react";
import {createNotification} from "apis/notification/notification";
import { useHistory } from "react-router-dom";
import { openNotification } from "components/feedback/notification";
export const NotificationCreate: React.FC = () => {
    const [formLoading, setFormLoading] = useState(false);
    const { formProps, saveButtonProps } = useDrawerForm({
        action: "create",
        successNotification: { message: "Created successfully!" },
      });
    const history = useHistory();
      const submitForm = async (formData: any) => {
    
    
   
        setFormLoading(true);
        createNotification(formData)
          .then(() => {
            history.push("/notification");
            openNotification("notification has been added successfully!", "success");
          })
          .catch((e: any) => {
            openNotification(`${e?.data?.message}`, "error");
          })
          .finally(() => setFormLoading(false));
      };

    return(
        <>
         <Card title="add Notifications" style={{marginBottom: '2em'}}>
         <Form
              className="w-full overflow-auto"
              layout="vertical"
              {...formProps}
              name="form"
            
              onFinish={submitForm}
            >
            <Form.Item
            name="title"
            label="title"
            >
                <Input/>
            </Form.Item>

            <Form.Item
            name="body"
            label="body"
            >
                <Input/>
            </Form.Item>
            <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  block
                  
                >
                  add Notification
                </Button>
            </Form>
          </Card> 
        </>
    )
}
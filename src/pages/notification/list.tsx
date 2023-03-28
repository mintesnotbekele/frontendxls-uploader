import { useEffect, useState } from "react";
import { getNotification, deleteNotification } from "apis/notification/notification";
import { openNotification } from "components/feedback/notification";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Popconfirm, Spin, Table } from "antd";
import { useHistory } from "react-router-dom";


export const NotificationList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState([]);
  

  const _deleteNotification = (id: string) => {
    
   
    setIsLoading(true);
    deleteNotification(id)
      .then((res: any) => {
        const updatedNotification = notification.filter(
          (item: any) => item?.id !== id
        );
        setNotification(updatedNotification);
        openNotification(`Deleted Successfully!`, "success");
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
  };

  const columns = [
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'body',
      dataIndex: 'body',
      key: 'body',
    },
    {
      title: "action",
      render : (notification: any) => {
        return (
          <div className="flex gap-1 items-center">
            <Popconfirm
              title="Are you sure to delete this question?"
              onConfirm={() => _deleteNotification(notification?.id)}
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
      }
    }
    
  ];
  const history = useHistory();
  const getNotificationData = () =>{
    setIsLoading(true);
    getNotification({})
    .then((res: any) => {
      setNotification(res.data);
    })
    .catch((e: any) => {
      openNotification(`${e?.data?.message}`, "error");
    })
    .finally(() => setIsLoading(false));
  }
  useEffect(() => {
    getNotificationData();
  }, []);
  const Filter: React.FC = () => {
    return (
      <Spin spinning={   isLoading}>
        <div className="flex justify-between items-center">
         
          <div 
            style={{transform: 'scale(.9)'}}
            className="flex items-center text-base text-gray-700 border-2 border-gray-700 pl-3 py-1 cursor-pointer ml-auto mr-4" 
            onClick={()=>{history.push("/notification/create");}}>
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
          <Card title="Notifications" style={{marginBottom: '2em'}}>
             <Filter /> 
          </Card> 
          <Table
                dataSource={notification}
                pagination={false}
                loading={isLoading}
                rowKey="id"
                columns={columns}
                >
              </Table>
      </div>
        </>)
}



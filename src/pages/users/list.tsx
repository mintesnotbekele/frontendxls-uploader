import { OrderedListOutlined, TableOutlined } from "@ant-design/icons";
import { List, Table,message as alerts, Col, Row, Button, Tag, Switch, ShowButton, Card, Select, Spin, useCustom, useApiUrl, Input, Form } from "@pankod/refine";
import { Pagination } from "antd";
import { toggleUserStatus, getUsers, passPayment } from "apis/users/users.api";
import { openNotification } from "components/feedback/notification";
import { ChangeEvent, useEffect, useState } from "react";
import { printTable } from "./exportPDF";


const { Option } = Select;


export const UserList: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gradeFilter, setGradeFilter] = useState();
  const [message, setMessage] = useState('');
  const [current, setCurrent] = useState(1);
  const [updated, setUpdated] = useState(false);
  
  var limit = 10;
  const [total, setTotal] = useState(0);
  var offset = 0;
  const [phone, setPhone] = useState("");
  const [activateSearch,  setActivateSearch] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [view, setView] = useState(1);
  const apiUrl = useApiUrl();
  const gradeNames = {
    grade_8: "Grade 8",
    grade_12_social: "Grade 12 Social",
    grade_12_natural: "Grade 12 Natural",
  };
  const changePageProps = (page:number, pageSize:number) => {
    limit = pageSize;
    offset = page * limit - limit;
    getUsersData();
  }
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
  const { data: gradeEnumData, isLoading: isLoadingGradeEnum } = useCustom<any>(
    {
      url: `${apiUrl}/enum/getGrade`,
      method: "get",
    }
    );



    const Filter: React.FC = () => {
      
      const searchform = (formData: any) => {
        setFirstName(formData.firstName);
        setPhone(formData.phoneNumber);
        setUpdated(!updated);
      }
     

      function onChangeTitle(val: string) {
        setFirstName(val);
        console.log(val);
      }

      return (<>
        
        <Spin spinning={isLoadingGradeEnum || isLoading}>
        <Form
           name="search"
           onFinish={searchform}
         >
         
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
            <Select 
          value="export options"
          onChange={(val:any) => {
            
            handleExportChange(val);
          }}
         >
             <Option value="all">Export all Users</Option>
             <Option value="subs">Export Subscribers</Option>
         </Select>
              <Select
                 
                style={{minWidth: '15em'}}
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
              <Form.Item name="firstName">
              <Input type="text" name="name" placeholder="First Name" />
              </Form.Item>
              <Form.Item name="phoneNumber">
              <Input type="text" name="phone" placeholder="Phone Number" />
              </Form.Item>
              <Button
                htmlType="submit"
                type="primary"
              
              >
                Search
              </Button>
            
            </div>
          </div>
          </Form>
        </Spin>
        </>
      );
    };
  useEffect(() => {
    getUsersData();
  }, [updated]);

 const handlePaymentPass=(passId: any)=>{
  
  passPayment(passId)
  .then((res: any) => {
   if(res.data.message == "successfully payed")
   {
    alerts.success('subscription successfully payed');
    setUpdated(!updated);
   }else{
    console.log(res)
   }
   
  }) 
 }

  const getUsersData = () => {
    setIsLoading(true);
    getUsers({phoneNumber: phone, firstName: firstName, grade: gradeFilter, offset, limit})
      .then((res: any) => {
        setCurrent(res.data.metadata.offset/res.data.metadata.limit + 1);
        setTotal(res?.data?.metadata.total);
        setUsers(res?.data?.users);
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
  };

  const getAllUsersData = () => {
    setIsLoading(true);
    getUsers({phoneNumber: phone, firstName: firstName, grade: gradeFilter, offset: 0, limit: 9999999})
      .then((res: any) => {
        setCurrent(res.data.metadata.offset/res.data.metadata.limit + 1);
        setTotal(res?.data?.metadata.total);
        setUsers(res?.data?.users);
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
  
  };

  const _toggleUserStatus = (id: string) => {
    setIsLoading(true);
    toggleUserStatus(id)
      .then(() => {
        getUsersData();
        openNotification(
          "User status has been updated successfully!",
          "success"
        );
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setIsLoading(false));
  };

  function handleExportChange(val: any) {
    getAllUsersData();
    if(isLoading == false){
    if(val == "all")
     printTable(users);
    else if(val == "subs"){
       const newval = users.filter(function(user: any) {
        return user?.hasActiveSubscription == true 
    });
      printTable(newval);  
    }}
  }

  return (
    <Row>
      <Col span={24}>
        <Card>
       
        
          <Filter /> 
        </Card>
      </Col>
      <Col span={24}>
        <List>
          <Table  pagination={false} dataSource={users} loading={isLoading} rowKey="id">
   
            
            <Table.Column dataIndex="firstName" title="First Name" />
            <Table.Column dataIndex="lastName" title="Last Name" />
            <Table.Column dataIndex="gender" title="Gender" />
            <Table.Column dataIndex="phoneNumber" title="Phone Number" />
            <Table.Column dataIndex="region" title="Region" />
            <Table.Column
              dataIndex='hasActiveSubscription'
              title="Subscription start"
              render={(hasActiveSubscription:boolean, obj:any) => {
                  return <Tag color={hasActiveSubscription ? 'success':'red'} className='text-center mx-1'>
                  <span className="text-sm">
                    
                    {new Date(obj.subscriptionStartsAt).toLocaleDateString()}
                    <br />
                    {new Date(obj.subscriptionStartsAt).toLocaleTimeString()}
                  </span>
                </Tag>;
              }}
            />
            <Table.Column
              dataIndex='hasActiveSubscription'
              title="Subscription end"
              render={(hasActiveSubscription:boolean, obj:any) => {
                return<Tag color={hasActiveSubscription ? 'success':'red'} className='text-center'>
                  
                  <span className="text-sm">
                    {new Date(obj.subscriptionExpiresAt).toLocaleDateString()}
                    <br />
                    {new Date(obj.subscriptionExpiresAt).toLocaleTimeString()}
                  </span>
                </Tag> ;
              }}
            />
            <Table.Column
              dataIndex="roles"
              title="Roles"
              render={(roles) => {
                return roles?.map((role: any) => (
                  <Tag color="success">{role?.name}</Tag>
                ));
              }}
            />
            
            <Table.Column
              title="Actions"
              render={(user) => {
                return user?.roles?.find(
                  (role: any) => role.name === "admin"
                ) ?    <Button onClick={()=>handlePaymentPass(user.id)}>pay</Button> : (
                  <div className="flex gap-1 items-center">
                    <Switch
                      checked={user?.isActive}
                      onClick={() => _toggleUserStatus(user.id)}
                    ></Switch>
                    <ShowButton type="link" size="middle" hideText recordItemId={user?.id}/>
                    <Button onClick={()=>handlePaymentPass(user.id)}>pay</Button>
                  </div>
                );
              }}
            />
          </Table>
          {total ? <Pagination className="self-end" defaultCurrent={1} current={current} total={total} onChange={changePageProps} /> : ''}
        </List>
      </Col>
    </Row>
  );
};

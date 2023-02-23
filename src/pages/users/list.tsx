import { OrderedListOutlined, TableOutlined } from "@ant-design/icons";
import { List, Table, Col, Row, Button, Tag, Switch, ShowButton, Card, Select, Spin, useCustom, useApiUrl, Input, Form } from "@pankod/refine";
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

  const [updated, setUpdated] = useState(message);


  const [phone, setPhone] = useState("");
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [view, setView] = useState(1);
  const apiUrl = useApiUrl();
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
  const { data: gradeEnumData, isLoading: isLoadingGradeEnum } = useCustom<any>(
    {
      url: `${apiUrl}/enum/getGrade`,
      method: "get",
    }
    );
    const Filter: React.FC = () => {
      function searchUsers(formData: any): void {
        console.log(formData);
        if((formData.name == undefined || formData.name == '') && (formData.grade == undefined ||  formData.grade == '') && (formData.phone == undefined || formData.phone == '')  ){
        getUsersData();
      }
        else if((formData.name != undefined || formData.name != '') && (formData.grade == undefined || formData.grade == '' ) && (formData.phone == undefined || formData.phone == ''))
        {
        
        setUsers(
          users.filter(function (el: any) {
            console.log(el);
            return el.firstName == formData.name;
               })
        );
      }
      else if((formData.name == undefined || formData.name == '') && (formData.grade != undefined ||formData.grade != '') && (formData.phone == undefined||formData.phone == ''))
      {
        setUsers(
          users.filter(function (el: any) {
            return el.grade == formData.grade;
               })
        );
      }
      else if((formData.name == undefined || formData.name == '')&& (formData.grade == undefined ||formData.grade == '') && (formData.phone != undefined||formData.phone != ''))
      
      {
        setUsers(
          users.filter(function (el: any) {
            return  el.phoneNumber == formData.phone;
               })
        );
      }


      else if((formData.name != undefined ||formData.name != '') && (formData.grade != undefined ||formData.grade != '') && (formData.phone == undefined || formData.phone == ''))
      {
        setUsers(
          users.filter(function (el: any) {
            return el.phoneNumber == formData.phone &&  el.firstName == formData.name;
               })
        );
      }
      else if((formData.name == undefined || formData.name == '') && (formData.grade != undefined || formData.grade != '') && (formData.phone != undefined || formData.phone != ''))
      {
        setUsers(
          users.filter(function (el: any) {
            return el.phoneNumber == formData.phone && el.grade == formData.grade;
               })
            );
        }
      else if((formData.name == undefined || formData.name == '') && (formData.grade != undefined || formData.grade != '') && (formData.phone != undefined || formData.phone != ''))
        {
          setUsers(
            users.filter(function (el: any) {
              return el.phoneNumber == formData.phone && el.grade == formData.grade;
                 })
              );
          }
      else if((formData.name != undefined || formData.name != '') && (formData.grade != undefined || formData.grade != '') && (formData.phone != undefined || formData.phone != ''))
      {
        setUsers(
          users.filter(function (el: any) {
            return el.phoneNumber == formData.phone && el.grade == formData.grade && el.firstName == formData.name;  
               })
            );
        }
       
      }
      const searchform = (formData: any) => {
        searchUsers(formData);
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
         <Form.Item
           name="grade"
          >
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
              </Form.Item>
              <Form.Item
              name="name"
              >
              <Input type="text" name="name" placeholder="First Name" />
              </Form.Item>
              <Form.Item
              name="phone"
              >
              <Input type="text" name="phone" placeholder="Phone Number"/>
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
  }, []);

 const handlePaymentPass=(passId: string)=>{
  
  passPayment(passId)
  .then(() => {
    console.log("paid")
  })
 }

  const getUsersData = () => {
    setIsLoading(true);
    getUsers()
      .then((res: any) => {
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
    if(val == "all")
     printTable(users);
    else if(val == "subs"){
       const newval = users.filter(function(user: any) {
        return user?.hasActiveSubscription == true 
    });
      printTable(newval);  
    }
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
          <Table dataSource={users} loading={isLoading} rowKey="id">
            <Table.Column dataIndex="firstName" title="First Name" />
            <Table.Column dataIndex="lastName" title="Last Name" />
            <Table.Column dataIndex="gender" title="Gender" />
            <Table.Column dataIndex="phoneNumber" title="Phone Number" />
            <Table.Column
              dataIndex='hasActiveSubscription'
              title="Subscription start"
              render={(hasActiveSubscription:boolean, obj:any) => {
                  return (hasActiveSubscription != null) ? <Tag color={hasActiveSubscription ? 'success':'red'} className='text-center mx-1'>
                  <span className="text-sm">
                    {new Date(obj.subscriptionStartsAt).toLocaleDateString()}
                    <br />
                    {new Date(obj.subscriptionStartsAt).toLocaleTimeString()}
                  </span>
                </Tag> : '';
              }}
            />
            <Table.Column
              dataIndex='hasActiveSubscription'
              title="Subscription end"
              render={(hasActiveSubscription:boolean, obj:any) => {
                return (hasActiveSubscription != null) ? <Tag color={hasActiveSubscription ? 'success':'red'} className='text-center'>
                  <span className="text-sm">
                    {new Date(obj.subscriptionExpiresAt).toLocaleDateString()}
                    <br />
                    {new Date(obj.subscriptionExpiresAt).toLocaleTimeString()}
                  </span>
                </Tag> : '';
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
                ) ? <Button onClick={()=>handlePaymentPass(user.id)}>pay</Button> : (
                  <div className="flex gap-1 items-center">
                    <Switch
                      checked={user?.isActive}
                      onClick={() => _toggleUserStatus(user.id)}
                    ></Switch>
                    <ShowButton type="link" size="middle" hideText recordItemId={user?.id}/>
                    <Button>pay</Button>
                  </div>
                );
              }}
            />
          </Table>
        </List>
      </Col>
    </Row>
  );
};

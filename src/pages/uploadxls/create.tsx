import {
  Table,
  Button,
  Form,
  Input,
  useDrawerForm,
  Create,
  Spin,
  Icon,
  Upload,
} from "@pankod/refine";

import * as XLSX from 'xlsx';
import { useState } from "react";
import { createUploadedEntries } from "apis/upload/upload";
import { openNotification } from "components/feedback/notification";
import { useHistory } from "react-router-dom";

export const UploadCreate: React.FC = () => {
  const [formLoading, setFormLoading] = useState(false);

 const history = useHistory(); 


  const [isLoading, setIsLoading] = useState(false);
  const { formProps, saveButtonProps } = useDrawerForm({
    action: "create",
    successNotification: { message: "Created successfully!" },
  });

  const submitForm = (formData: any) => {
    setFormLoading(true);
    createUploadedEntries(formData)
      .then(() => {
        history.push("/");
        openNotification("entries has been added successfully!", "success");
      })
      .catch((e: any) => {
        openNotification(`${e?.data?.message}`, "error");
      })
      .finally(() => setFormLoading(false));
  };


  const _buildFormInputItem = (
    key: string,
    name: any,
    
    placeholder: string = "",
    type: string = "text"
  ) => {
    return (
      <><Form.Item
        labelCol={{ offset: 0 }}
        key={name + key}
        name={name}

      >
        <Input type={type} placeholder={placeholder} />
      </Form.Item>
      </>
      
    );
  };

  const uploadxlx:any = [];



  return (
    <>
      <Spin spinning={formLoading}>
        <Create saveButtonProps={saveButtonProps}>
          <div className={'inline-grid'}>
            <div className="w-full flex justify-end my-4">
              <Upload
                accept=".csv,.xlsx,.xls"
                showUploadList={false}
                beforeUpload={(file: any) => {
                 if(file.type?.includes('spreadsheet')) {
                    setFormLoading(true);
                    const reader = new FileReader();
                    reader.onload = (evt) => { // evt = on_file_select event
                        // Parse data
                        const bstr = evt.target?.result;
                        const wb = XLSX.read(bstr, {type:'binary'});
                        
                        // Get first worksheet
                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];

                        // Convert sheet to html
                        const htmlData = XLSX.utils.sheet_to_html(ws, {});                        
                    
                        /** NARRATION:
                         * - Parse the html data
                         * - Get col id prefixes form header row items
                         * - Store the prefixes on a map : colIDs
                         * - Loop over rows
                         * - add questions to list based on id-keys
                         */

                        const tmp = document.createElement('html');
                        tmp.innerHTML = htmlData;
                        let colIDs:any = {};
                        tmp.querySelector('tr')?.querySelectorAll('td').forEach((td:any) => {
                          let fieldName = td?.innerText.toString().trim();
                          
                          
                          if (fieldName == 'Item No') {
                            if(!colIDs['ItemNo'])
                              colIDs['ItemNo'] = td.id.substring(0, (td.id.length-1))
                          }else if (fieldName == 'Description') {
                            if(!colIDs['Description'])
                              colIDs['Description'] = td.id.substring(0, (td.id.length-1))
                          }else if (fieldName == 'Unit') {
                            if(!colIDs['Unit'])
                              colIDs['Unit'] = td.id.substring(0, (td.id.length-1))
                          } else if (fieldName == 'Qty') {
                            if(!colIDs['Qty'])
                              colIDs['Qty'] = td.id.substring(0, (td.id.length-1))
                          } else if (fieldName == 'Rate') {
                            if(!colIDs['Rate'])
                              colIDs['Rate'] = td.id.substring(0, (td.id.length-1))
                          } else if (fieldName == 'Amount') {
                            if(!colIDs['Amount'])
                              colIDs['Amount'] = td.id.substring(0, (td.id.length-1))
                          } 
                        });

                        tmp.querySelectorAll('tr').forEach(async (row:any, idx:number) => {
                          let entries:any = {};
                          Object.keys(colIDs).forEach((key:string)=>{
                            
                            entries[key] = row.querySelector(`#${colIDs[key]+(idx+1)}`)?.innerHTML;
                            
                           
                          });
                          uploadxlx.push(entries);
                        });
                        
                        formProps.form.setFieldsValue({ uploadxlx });
                        setFormLoading(false);
                       
                    };
                    reader.readAsBinaryString(file);
                  }
                  // Prevent upload
                  return false;
                }}
              >
                <Button>
                  <Icon type="upload" /> Click to Upload
                </Button>
              </Upload>
            </div>
            <Form
              className="w-full overflow-auto"
              layout="vertical"
              {...formProps}
              name="form"
              onFinish={submitForm}
            >
              <Form.List name="uploadxlx">
                {(fields, { add, remove }) => {
                  return (
                    <Table
                      dataSource={fields}
                      loading={isLoading}
                      rowKey="id"
                      scroll={{ x: "1500px" }}
                      key="uploadxlx"
                    >
                      <Table.Column
                        title="ItemNo"
                        key={"itemno"}
                        render={(field) => {
                          const name = [field.name, "ItemNo"];
                          return _buildFormInputItem(
                            field.index,
                            name,
                            "ItemNO"
                            
                          );
                        }}
                      />
                      <Table.Column
                        title="Description"
                        key={"Description"}
                        render={(field) => {
                          const name = [field.name, "Description"];
                          return _buildFormInputItem(
                            field.index,
                            name,
                            "Description"
                          );
                        }}
                      />
                     <Table.Column
                        title="Rate"
                        key={"Rate"}
                        render={(field) => {
                          const name = [field.name, "Rate"];
                          return _buildFormInputItem(
                            field.index,
                            name,
                            "Rate"
                          );
                        }}
                      />
                       <Table.Column
                        title="Qty"
                        key={"qty"}
                        render={(field) => {
                          const name = [field.name, "Qty"];
                          return _buildFormInputItem(
                            field.index,
                            name,
                            "qty"
                          );
                        }}
                      />
                      
                      <Table.Column
                        title="Amount"
                        key={"Amount"}
                        render={(field) => {
                          const name = [field.name, "Amount"];
                          return _buildFormInputItem(
                            field.index,
                            name,
                            "Amount"
                          );
                        }}
                      />
                
                      <Table.Column
                        key={"action"}
                        title={
                          <div className="flex gap-2 justify-center">
                            <span className="m-auto">Action</span>
                            <Button
                              onClick={() => {
                                add();
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        }
                        render={(field: any) => {
                          return (
                            <Form.Item>
                              <div className="flex gap-2 flex-row">
                                {fields?.length > 1 ? (
                                  <Button
                                    danger
                                    onClick={() => {
                                      remove(field.key);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                ) : null}
                              </div>
                            </Form.Item>
                          );
                        }}
                      />
                    </Table>
                  );
                }}
              </Form.List>
            </Form>
          </div>
        </Create>
      </Spin>
    </>
  );
};

// Generic string formatter for subject names

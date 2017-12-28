import React from 'react';
import { Modal, Form, Input, Row, Col, Select } from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;

const CreateRole = Form.create()(
    (props) => {
        const { visible, onCancel, onCreate, form, roleData, title, departmentData, checkedRoleInfor, okText, disable } = props;
        const { getFieldDecorator } = form;
        // let roleChildren = [];
        // roleData.forEach(function (item, index) {
        //     roleChildren.push(<Option value={item} key={index}>{item}</Option>);
        // });
        //
        // let departmentChildren = [];
        // departmentData.forEach(function (item, index) {
        //     departmentChildren.push(<Option value={item} key={index}>{item}</Option>);
        // });
        const getPermissionInRole = (permission) => {
            let permissionArr = [];
            if(permission !== undefined) {
                for(let item of permission) {
                    if(item.indexOf('1') !== -1) {
                        permissionArr.push({
                            key:"1",
                            label:'管理权限 '
                        });
                    }else if(item.indexOf('2') !== -1) {
                        permissionArr.push({
                            key:"2",
                            label:'审核权限 '
                        });
                    }else if(item.indexOf('3') !== -1) {
                        permissionArr.push({
                            key:"3",
                            label:'日志权限 '
                        });
                    }
                }
            }
            return permissionArr;
        };
        return (
            <Modal
                visible={visible}
                title={title}
                okText={okText}
                onCancel={onCancel}
                onOk={onCreate}
                style={{ top: 5 }}
            >
                <Form layout="vertical">

                    <FormItem label="角色代码">
                        {getFieldDecorator('role_code', {
                            initialValue:checkedRoleInfor !== undefined ? checkedRoleInfor['role_code'] : '',
                            rules: [{ required: true, message: '请输入角色代码!' }],
                        })(
                            <Input disabled={disable} />
                        )}
                    </FormItem>

                    <FormItem label="角色名称">
                        {getFieldDecorator('role_name', {
                            initialValue:checkedRoleInfor !== undefined ? checkedRoleInfor['role_name'] : '',
                            rules: [{ required: true, message: '请输入角色名称!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="角色权限">
                        {getFieldDecorator('permission', {
                            initialValue:checkedRoleInfor !== undefined ? getPermissionInRole(checkedRoleInfor['permission']) : '选择部门',
                            rules: [{ required: true, message: '请选择角色权限!' }],
                        })(
                            <Select
                                mode="tags"
                                labelInValue
                                placeholder="选择角色权限"
                            >
                                {/*{departmentChildren}*/}
                                <Option value="1">管理权限</Option>
                                <Option value="2">审核权限</Option>
                                <Option value="3">日志权限</Option>
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);

export default CreateRole;

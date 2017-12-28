
import React from 'react';
import { Modal, Form, Input, Row, Col, Select } from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;

const CreateRole = Form.create()(
    (props) => {
        const { visible, onCancel, onCreate, form, roleData, title, departmentData, checkedDepartmentInfor, okText, disable } = props;
        const { getFieldDecorator } = form;
        // let roleChildren = [];
        // roleData.forEach(function (item, index) {
        //     roleChildren.push(<Option value={item} key={index}>{item}</Option>);
        // });
        //
        let departmentChildren = [];
        departmentChildren.push(<Option value="无" key="0">无</Option>);
        departmentData.forEach(function (item, index) {
            departmentChildren.push(<Option value={item} key={index + 1}>{item}</Option>);
        });
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

                    <FormItem label="部门代码">
                        {getFieldDecorator('department_code', {
                            initialValue:checkedDepartmentInfor !== undefined ? checkedDepartmentInfor['department_code'] : '',
                            rules: [{ required: true, message: '请输入部门代码!' }],
                        })(
                            <Input disabled={disable} />
                        )}
                    </FormItem>

                    <FormItem label="部门名称">
                        {getFieldDecorator('department_name', {
                            initialValue:checkedDepartmentInfor !== undefined ? checkedDepartmentInfor['department_name'] : '',
                            rules: [{ required: true, message: '请输入部门名称!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="父部门">
                        {getFieldDecorator('parent_name', {
                            initialValue:checkedDepartmentInfor !== undefined ? checkedDepartmentInfor['parent_name'] : '',
                            rules: [{ required: true, message: '请选择父部门名称!' }],
                        })(
                            <Select
                                placeholder="选择父部门"
                            >
                                {departmentChildren}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="联系电话">
                        {getFieldDecorator('department_tel',  {
                            initialValue:checkedDepartmentInfor !== undefined ? checkedDepartmentInfor['department_tel'] : '',
                            rules: [
                                { required: true, message: '请输入正确的电话!', pattern: new RegExp('^1[3,4,5,7,8]\\d{9}$') }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);

export default CreateRole;

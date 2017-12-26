import React from 'react';
import { Modal, Form, Input, Row, Col, Select } from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;

const CreateUser = Form.create()(
    (props) => {
        const { visible, onCancel, onCreate, form, roleData, title, departmentData, checkedUserInfor, okText, disable } = props;
        const { getFieldDecorator } = form;
        let roleChildren = [];
        roleData.forEach(function (item, index) {
            roleChildren.push(<Option value={item} key={index}>{item}</Option>);
        });

        let departmentChildren = [];
        departmentData.forEach(function (item, index) {
            departmentChildren.push(<Option value={item} key={index}>{item}</Option>);
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
                    <Row gutter={16}>
                        <Col span={12}>
                            <FormItem label="员工代码">
                                {getFieldDecorator('staff_code', {
                                    initialValue:checkedUserInfor !== undefined ? checkedUserInfor['staff_code'] : '',
                                    rules: [{ required: true, message: '请输入员工代码!' }],
                                })(
                                    <Input disabled={disable} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="姓名">
                                {getFieldDecorator('username', {
                                    initialValue:checkedUserInfor !== undefined ? checkedUserInfor['username'] : '',
                                    rules: [{ required: true, message: '请输入姓名!' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <FormItem label="所属部门">
                                {getFieldDecorator('department_name', {
                                    initialValue:checkedUserInfor !== undefined ? checkedUserInfor['department_name'] : '选择部门',
                                    rules: [{ required: true, message: '请选择部门!' }],
                                })(
                                    <Select
                                        placeholder="选择部门"
                                    >
                                        {departmentChildren}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="学历">
                                {getFieldDecorator('education', {
                                    initialValue:checkedUserInfor !== undefined ? checkedUserInfor['education'] : '选择学历',
                                })(
                                    <Select
                                        placeholder="选择学历"
                                    >
                                        <Option value="大学">大学</Option>
                                        <Option value="专科">专科</Option>
                                        <Option value="高中">高中</Option>
                                        <Option value="其他">其他</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <FormItem label="专业">
                                {getFieldDecorator('major', {
                                    initialValue:checkedUserInfor !== undefined ? checkedUserInfor['major'] : '',
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="年龄">
                                {getFieldDecorator('age', {
                                    initialValue:checkedUserInfor !== undefined ? checkedUserInfor['age'] : '',
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <FormItem label="邮箱">
                                {getFieldDecorator('email', {
                                    initialValue:checkedUserInfor !== undefined ? checkedUserInfor['email'] : '',
                                    rules: [{
                                        type: 'email', message: '请输入有效的邮箱地址',
                                    }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="角色">
                                {getFieldDecorator('role_name', {
                                    initialValue:checkedUserInfor !== undefined ? checkedUserInfor['role_name'] : '选择角色',
                                    rules: [{ required: true, message: '请选择角色类型!' }],
                                })(
                                    <Select
                                        placeholder="选择角色"
                                    >
                                        {roleChildren}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="住址">
                        {getFieldDecorator('address', {
                            initialValue:checkedUserInfor !== undefined ? checkedUserInfor['address'] : '',
                        })(<Input type="textarea" />)}
                    </FormItem>

                </Form>
            </Modal>
        );
    }
);

export default CreateUser;

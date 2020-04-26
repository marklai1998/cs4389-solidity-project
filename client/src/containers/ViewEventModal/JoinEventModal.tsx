import React, { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
import { Store } from 'antd/lib/form/interface'

export type HandleJoinCallback = (info: {
  firstName: string
  lastName: string
  email: string
}) => void

type Props = {
  visible: boolean
  closeModal: () => void
  handleJoin: HandleJoinCallback
}

export const JoinEventModal = ({ visible, closeModal, handleJoin }: Props) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!visible) form.resetFields()
  }, [form, visible])

  const handleSubmit = ({ firstName, lastName, email }: Store) => {
    handleJoin({ firstName, lastName, email })
    closeModal()
  }

  return (
    <Modal
      title='Join Event'
      visible={visible}
      onOk={() => form.submit()}
      onCancel={closeModal}
      forceRender
    >
      <Form
        {...{
          labelCol: { span: 5 },
          wrapperCol: { span: 18 },
        }}
        onFinish={handleSubmit}
        form={form}
      >
        <Form.Item
          label='First Name'
          name='firstName'
          rules={[{ required: true, message: 'Please input first name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Last Name'
          name='lastName'
          rules={[{ required: true, message: 'Please input last name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Email'
          name='email'
          rules={[{ required: true, message: 'Please input email' }]}
        >
          <Input type='email' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, DatePicker, InputNumber } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useEvent } from '../../hooks/useEvent'
import { v4 as uuid } from 'uuid'
import { useWeb3 } from '../../hooks/useWeb3'
import { Store } from 'antd/lib/form/interface'
import moment from 'moment'

export const CreateEventModal = () => {
  const { createEvent } = useEvent()
  const { selectedAccount } = useWeb3()
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (!modalVisible) form.resetFields()
  }, [form, modalVisible])

  const handleSubmit = ({
    name,
    description,
    headcount,
    fee,
    date,
    dueDate,
  }: Store) => {
    if (!selectedAccount) return
    createEvent({
      id: uuid(),
      name,
      description,
      date: date.toISOString(),
      dueDate: dueDate.toISOString(),
      headcount,
      fee,
    })
    setModalVisible(false)
  }

  return (
    <>
      <Button
        icon={<PlusOutlined />}
        type='primary'
        onClick={() => setModalVisible(true)}
      >
        Create Event
      </Button>
      <Modal
        title='Create Event'
        visible={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
        forceRender
      >
        <Form
          {...{
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
          }}
          onFinish={handleSubmit}
          form={form}
          initialValues={{ headcount: 1, fee: 0 }}
        >
          <Form.Item
            label='Name'
            name='name'
            rules={[{ required: true, message: 'Please input event name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Description'
            name='description'
            rules={[
              { required: true, message: 'Please input event description' },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label='Date'
            name='date'
            rules={[{ required: true, message: 'Please input event date' }]}
          >
            <DatePicker
              showTime
              disabledDate={(date) => date.isSameOrBefore(moment())}
            />
          </Form.Item>
          <Form.Item label='Due Date' noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const eventDate = getFieldValue('date')
              return (
                <Form.Item
                  label='Due Date'
                  name='dueDate'
                  rules={[
                    { required: true, message: 'Please input event due date' },
                  ]}
                  shouldUpdate
                >
                  <DatePicker
                    showTime
                    disabled={!eventDate}
                    disabledDate={(date) =>
                      !date.isBetween(moment(), eventDate)
                    }
                  />
                </Form.Item>
              )
            }}
          </Form.Item>
          <Form.Item
            label='Headcount'
            name='headcount'
            rules={[
              { required: true, message: 'Please input event headcount' },
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            label='Fee'
            name='fee'
            rules={[{ required: true, message: 'Please input event fee' }]}
          >
            <InputNumber
              min={0}
              formatter={(value) => `${value} wei`}
              parser={(value) => (value || '').replace(' wei', '')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

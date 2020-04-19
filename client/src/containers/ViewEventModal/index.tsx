import React from 'react'
import { Modal } from 'antd'
import { useEvent } from '../../hooks/useEvent'

import * as R from 'ramda'
import moment from 'moment'

export const ViewEventModal = () => {
  const { selectedEvent, resetSelectedEvent, joinEvent } = useEvent()

  const handleJoinEvent = () => {
    if (!selectedEvent) return
    joinEvent(selectedEvent.id)
  }

  if (!selectedEvent) return <></>
  const canJoin = moment(selectedEvent.dueDate).isAfter(moment())
  return (
    <Modal
      title={selectedEvent.name}
      visible={!R.isNil(selectedEvent)}
      onCancel={() => resetSelectedEvent()}
      onOk={handleJoinEvent}
      okText='Join Event'
      okButtonProps={{ disabled: !canJoin }}
    >
      <h2>Description</h2>
      {selectedEvent.description}
      <h2>Date</h2>
      {selectedEvent.startDate} - {selectedEvent.endDate}
      <h2>Due Date</h2>
      {selectedEvent.dueDate}
      <h2>Headcount</h2>
      {selectedEvent.headcount}
      <h2>Fee</h2>
      {selectedEvent.fee} Wei
      <h2>Joined</h2>
      {selectedEvent.joined.length}
    </Modal>
  )
}

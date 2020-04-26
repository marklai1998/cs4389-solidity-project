import React, { useState, useEffect } from 'react'
import { Modal, Button, message, Divider } from 'antd'
import { useEvent, EventListItem } from '../../hooks/useEvent'

import * as R from 'ramda'
import moment from 'moment'
import { useInterval } from 'react-use'
import { JoinEventModal, HandleJoinCallback } from './JoinEventModal'
import { useWeb3 } from '../../hooks/useWeb3'
import { Attendee } from '../../types/Attendee'
import styled from 'styled-components'

export const ViewEventModal = () => {
  const { selectedAccount } = useWeb3()
  const {
    selectedEventId,
    setSelectedEventId,
    getEvent,
    joinEvent,
    claimEvent,
    leaveEvent,
    getEventAttendeeList,
  } = useEvent()

  const [eventDetail, setEventDetail] = useState<EventListItem | null>(null)
  const [attendeeList, setAttendeeList] = useState<Attendee[]>([])
  const [joinEventModalVisible, setJoinEventModalVisible] = useState(false)

  const refreshEventDetail = async () => {
    if (!selectedEventId) return
    const result = await getEvent(selectedEventId)
    setEventDetail(result)

    if (result && result.event.organizer === selectedAccount) {
      const result = await getEventAttendeeList(selectedEventId)
      setAttendeeList(result)
    }
  }

  useInterval(
    refreshEventDetail,
    selectedEventId ? 5000 : null // 5s
  )

  useEffect(() => {
    if (selectedEventId) {
      refreshEventDetail()
    } else {
      setEventDetail(null)
      setAttendeeList([])
    }
    return () => {
      setEventDetail(null)
      setAttendeeList([])
    }
  }, [selectedEventId])

  if (!selectedEventId || !eventDetail) return <></>
  const { event, attendees, isInTheEvent } = eventDetail

  const handleJoinEvent: HandleJoinCallback = ({
    firstName,
    lastName,
    email,
  }) => {
    Modal.confirm({
      title: `Do you want to pay ${event.fee} wai to join this event?`,
      onOk: async () => {
        const result = await joinEvent(eventDetail.event.id, {
          firstName,
          lastName,
          email,
        })
        if (result) {
          message.success('Join successfully')
        } else {
          message.success('Join failed')
        }
        setJoinEventModalVisible(false)
        refreshEventDetail()
      },
      onCancel() {
        setJoinEventModalVisible(false)
        refreshEventDetail()
      },
    })
  }

  const handleClaimEvent = () => {
    Modal.confirm({
      title: `Do you Want to claim all attendee fee?`,
      content: 'No one will be able to join event after you claim the fee.',
      onOk: async () => {
        const result = await claimEvent(eventDetail.event.id)
        if (result) {
          message.success('Claim successfully')
        } else {
          message.success('Claim failed')
        }
        refreshEventDetail()
      },
      onCancel() {
        refreshEventDetail()
      },
    })
  }

  const handleLeaveEvent = () => {
    Modal.confirm({
      title: `Do you Want to leave the event?`,
      content: 'Event fee will refund to your account.',
      onOk: async () => {
        const result = await leaveEvent(eventDetail.event.id)
        if (result) {
          message.success('Leave successfully')
        } else {
          message.success('Leave failed')
        }
        refreshEventDetail()
      },
      onCancel() {
        refreshEventDetail()
      },
    })
  }

  const isOwner = event.organizer === selectedAccount
  const canClaim = isOwner && !event.claimed

  const isLocked = event.claimed
  const isDue = moment(event.dueDate).isSameOrBefore(moment())
  const isEnd = moment(event.startDate).isSameOrBefore(moment())
  const canJoin =
    !isInTheEvent && !isDue && !isEnd && !isLocked && event.headcount > 0
  const canLeave = isInTheEvent && !isDue && !isEnd && !isLocked

  return (
    <>
      <Modal
        title={event.name}
        visible={!R.isNil(eventDetail)}
        onCancel={() => setSelectedEventId(null)}
        footer={
          <>
            {isOwner ? (
              <Button
                type='danger'
                disabled={!canClaim}
                onClick={handleClaimEvent}
              >
                Claim Event Fee
              </Button>
            ) : isInTheEvent ? (
              <Button
                type='danger'
                disabled={!canLeave}
                onClick={handleLeaveEvent}
              >
                Leave Event
              </Button>
            ) : (
              <Button
                type='primary'
                disabled={!canJoin}
                onClick={() => {
                  setJoinEventModalVisible(true)
                }}
              >
                Join Event
              </Button>
            )}
          </>
        }
      >
        <JoinEventModal
          visible={joinEventModalVisible}
          closeModal={() => {
            setJoinEventModalVisible(false)
          }}
          handleJoin={handleJoinEvent}
        />
        <h2>Description</h2>
        {event.description}
        <h2>Date</h2>
        {event.startDate}
        <h2>Due Date</h2>
        {event.dueDate}
        <h2>Headcount</h2>
        {event.headcount}
        <h2>Fee</h2>
        {event.fee} Wei
        <h2>Joined</h2>
        {attendees}
        {!R.isEmpty(attendeeList) && (
          <>
            <Divider />
            <h2>Attendee List</h2>
            {attendeeList.map(({ buyer, firstName, lastName, email }) => (
              <AttendeeItem>
                <div>Address: {buyer}</div>
                <div>First Name: {firstName}</div>
                <div>Last Name: {lastName}</div>
                <div>Email: {email}</div>
              </AttendeeItem>
            ))}
          </>
        )}
      </Modal>
    </>
  )
}

const AttendeeItem = styled.div`
  margin-bottom: 8px;
`

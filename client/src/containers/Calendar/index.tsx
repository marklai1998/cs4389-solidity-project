import React from 'react'
import styled from 'styled-components'
import { Button, Calendar as AntdCalendar } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Scrollbars } from 'react-custom-scrollbars'
import moment from 'moment'
import { useEvent } from '../../hooks/useEvent'
import * as R from 'ramda'
import { CreateEventModal } from '../CreateEventModal'

export const Calendar = () => {
  const { events } = useEvent()

  const dateCellRender = (value: moment.Moment) => {
    const items = R.filter(({ startDate, endDate }) => {
      const startMoment = moment(startDate)
      const endMoment = moment(endDate)
      const year = value.year()
      const dayOfYear = value.dayOfYear()
      return (
        startMoment.dayOfYear() <= dayOfYear &&
        endMoment.dayOfYear() >= dayOfYear &&
        startMoment.year() <= year &&
        endMoment.year() >= year
      )
    }, events)
    return (
      <>
        {items.map(({ id, name }) => (
          <EventItem key={id}>{name}</EventItem>
        ))}
      </>
    )
  }

  return (
    <Wrapper>
      <NameWrapper>
        <h2>Calendar</h2>
        <CreateEventModal />
      </NameWrapper>
      <CalendarWrapper>
        <Scrollbars universal>
          <AntdCalendar dateCellRender={dateCellRender} />
        </Scrollbars>
      </CalendarWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: auto;
`

const NameWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const CalendarWrapper = styled.div`
  width: 100%;
  height: 100%;

  & .ant-picker-calendar {
    background: #242426;
    border-radius: 2px;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  & .ant-picker-panel {
    background-color: #242426;
    border-radius: 2px;
  }
`

const EventItem = styled.div`
  font-size: 12px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

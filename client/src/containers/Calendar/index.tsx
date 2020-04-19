import React from 'react'
import styled from 'styled-components'
import { Calendar as AntdCalendar, Dropdown, Menu } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import moment from 'moment'
import { useEvent } from '../../hooks/useEvent'
import * as R from 'ramda'
import { CreateEventModal } from '../CreateEventModal'

export const Calendar = () => {
  const { events, viewEvent } = useEvent()

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
    return R.isEmpty(items) ? (
      <></>
    ) : (
      <Dropdown
        overlay={
          <Menu>
            {items.map(({ name, id }) => (
              <Menu.Item
                key={id}
                onClick={() => {
                  viewEvent(id)
                }}
              >
                {name}
              </Menu.Item>
            ))}
          </Menu>
        }
      >
        <CalendarItem>
          {items.length} {`Event${items.length > 1 ? 's' : ''}`}
        </CalendarItem>
      </Dropdown>
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

const CalendarItem = styled.div`
  width: 100%;
  height: 100%;
`

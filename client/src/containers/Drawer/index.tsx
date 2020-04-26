import React, { useState } from 'react'
import { useEvent, EventListItem } from '../../hooks/useEvent'
import styled from 'styled-components'
import { Item } from './Item'
import { Scrollbars } from 'react-custom-scrollbars'
import { Button, Dropdown, Select } from 'antd'
import { UpOutlined, DownOutlined } from '@ant-design/icons'
import * as R from 'ramda'
import moment from 'moment'
import { useWeb3 } from '../../hooks/useWeb3'

enum sortType {
  ASC = 'ASC',
  DESC = 'DESC',
}

enum listType {
  UP_COMING = 'UP_COMING',
  MY_EVENT = 'MY_EVENT',
}

export const Drawer = () => {
  const { selectedAccount } = useWeb3()
  const { events } = useEvent()
  const [sortBy, setSortBy] = useState(sortType.ASC)
  const [selectedListType, setSelectedListType] = useState(listType.UP_COMING)

  const eventList =
    selectedListType === listType.UP_COMING
      ? events
      : R.filter(
          ({ event: { organizer } }) => organizer === selectedAccount,
          events
        )

  const sortedEvents = R.compose<
    EventListItem[],
    EventListItem[],
    EventListItem[]
  >(
    R.sort(
      ({ event: { startDate: startA } }, { event: { startDate: startB } }) => {
        const momentA = moment(startA)
        const result =
          sortBy === sortType.ASC
            ? momentA.isAfter(startB)
            : momentA.isBefore(startB)

        return result ? 1 : -1
      }
    ),
    R.reject(({ event: { startDate } }) => moment(startDate).isBefore(moment()))
  )(eventList)

  return (
    <Wrapper>
      <h2>Events</h2>
      <Select value={selectedListType} onChange={setSelectedListType}>
        <Select.Option value={listType.UP_COMING}>Up Coming</Select.Option>
        <Select.Option value={listType.MY_EVENT}>My Event</Select.Option>
      </Select>
      <StyledButton
        icon={sortBy === sortType.ASC ? <UpOutlined /> : <DownOutlined />}
        type='primary'
        onClick={() => {
          setSortBy((prev) =>
            prev === sortType.ASC ? sortType.DESC : sortType.ASC
          )
        }}
      >
        Sort by time
      </StyledButton>
      <Scrollbars universal>
        {sortedEvents.map((item) => (
          <Item {...item} key={item.event.id} />
        ))}
      </Scrollbars>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 250px;
  flex-shrink: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
`

const StyledButton = styled(Button)`
  margin-top: 4px;
`

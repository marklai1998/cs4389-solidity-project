import React, { useState } from 'react'
import { useEvent, Event } from '../../hooks/useEvent'
import styled from 'styled-components'
import { Item } from './Item'
import { Scrollbars } from 'react-custom-scrollbars'
import { Button } from 'antd'
import { UpOutlined, DownOutlined } from '@ant-design/icons'
import * as R from 'ramda'
import moment from 'moment'

enum sortType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const Drawer = () => {
  const { events } = useEvent()
  const [sortBy, setSortBy] = useState(sortType.ASC)

  const sortedEvents = R.compose<Event[], Event[], Event[]>(
    R.sort(({ start: startA }, { start: startB }) => {
      const momentA = moment(startA)
      const result =
        sortBy === sortType.ASC
          ? momentA.isAfter(startB)
          : momentA.isBefore(startB)

      return result ? 1 : -1
    }),
    R.reject(({ end }) => moment(end).isBefore(moment()))
  )(events)

  return (
    <Wrapper>
      <h2>Upcoming Events</h2>
      <Button
        icon={sortBy === sortType.ASC ? <UpOutlined /> : <DownOutlined />}
        type='primary'
        onClick={() => {
          setSortBy((prev) =>
            prev === sortType.ASC ? sortType.DESC : sortType.ASC
          )
        }}
      >
        Sort by time
      </Button>
      <Scrollbars universal>
        {sortedEvents.map((event) => (
          <Item {...event} key={event.id} />
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

import React from 'react'
import { Event } from '../../hooks/useEvent'
import styled from 'styled-components'
import moment from 'moment'
import { CalendarOutlined, UserOutlined } from '@ant-design/icons'

export const Item = ({ name, start, joined }: Event) => (
  <Wrapper>
    <Name>{name}</Name>
    <DetailWrapper>
      <div>
        <CalendarOutlined /> {moment(start).fromNow()}
      </div>
      <div>
        <UserOutlined /> {joined.length}
      </div>
    </DetailWrapper>
  </Wrapper>
)

const Wrapper = styled.div`
  background-color: #242426;
  border-radius: 2px;
  margin: 4px 0;
  padding: 8px;
`

const Name = styled.div`
  font-size: 16px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const DetailWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
`

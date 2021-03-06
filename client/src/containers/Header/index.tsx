import React from 'react'
import styled from 'styled-components'
import { CalendarOutlined } from '@ant-design/icons'
import { AccountSelector } from './AccountSelector'

export const Header = () => (
  <Wrapper>
    <LogoWrapper>
      <Icon />
      <Name>Ethent</Name>
    </LogoWrapper>
    <AccountSelectorWrapper>
      <AccountSelector />
    </AccountSelectorWrapper>
  </Wrapper>
)

const Wrapper = styled.div`
  height: 40px;
  background-color: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(5px);
  padding: 0 16px;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
`

const Icon = styled(CalendarOutlined)`
  font-size: 20px;
  padding: 12px 0;
`

const Name = styled.span`
  font-size: 20px;
  margin-left: 8px;
`

const LogoWrapper = styled.div`
  flex-shrink: 0;
`

const AccountSelectorWrapper = styled.div`
  width: 100%;
  text-align: right;
  overflow: hidden;
`

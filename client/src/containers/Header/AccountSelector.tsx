import React from 'react'
import { useWeb3 } from '../../hooks/useWeb3'
import { Dropdown, Menu } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import * as R from 'ramda'

export const AccountSelector = () => {
  const { accounts, selectedAccount, setSelectedAccount } = useWeb3()
  return (
    <div>
      <Dropdown
        overlay={
          <Menu>
            {(accounts || []).map((account) => (
              <Menu.Item
                onClick={() => {
                  setSelectedAccount(account)
                }}
                disabled={selectedAccount === account}
              >
                {account}
              </Menu.Item>
            ))}
          </Menu>
        }
      >
        <Button>
          {selectedAccount ? (
            <>
              Using: {R.takeLast(5, selectedAccount)} <DownOutlined />
            </>
          ) : (
            <>Logging in</>
          )}
        </Button>
      </Dropdown>
    </div>
  )
}

const Button = styled.span`
  cursor: pointer;

  width: 100%;
`

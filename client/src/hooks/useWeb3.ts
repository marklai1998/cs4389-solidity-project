import constate from 'constate'
import { useState, useEffect } from 'react'
import Web3 from 'web3'
import getWeb3 from '../utils/getWeb3'
import * as R from 'ramda'

export const [UseWeb3Provider, useWeb3] = constate(() => {
  const [web3Instance, setWeb3Instance] = useState<Web3 | null>(null)
  const [accounts, setAccounts] = useState<string[] | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3 = await getWeb3()
        setWeb3Instance(web3)
      } catch (error) {
        alert('Failed to load web3. Check console for details.')
        console.error(error)
      }
    }
    initWeb3()
  }, [])

  useEffect(() => {
    const initAccount = async () => {
      if (!web3Instance) return
      try {
        const accounts = await web3Instance.eth.getAccounts()
        setAccounts(accounts)
      } catch (error) {
        alert('Failed to load accounts. Check console for details.')
        console.error(error)
      }
    }
    initAccount()
  }, [web3Instance])

  useEffect(() => {
    if (!accounts) {
      setSelectedAccount(null)
      return
    }
    if (!selectedAccount || !R.contains(selectedAccount, accounts)) {
      const account = R.head(accounts)
      if (!account) {
        setSelectedAccount(null)
        return
      }
      setSelectedAccount(account)
    }
  }, [accounts, selectedAccount])

  return {
    web3: web3Instance,
    accounts,
    selectedAccount,
    setSelectedAccount,
  }
})

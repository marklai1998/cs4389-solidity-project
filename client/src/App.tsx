import React from 'react'
import 'antd/dist/antd.dark.css'
import { useWeb3, UseWeb3Provider } from './hooks/useWeb3'
import { Button } from 'antd'
import {
  useSimpleStorage,
  UseSimpleStorageProvider,
} from './hooks/useSimpleStorage'
import { Loading } from './components/Loading'

const App = () => {
  const { web3, accounts } = useWeb3()
  const { storageValue, runExample } = useSimpleStorage()

  const loading = !web3 || !accounts
  return loading ? (
    <Loading />
  ) : (
    <>
      <Button onClick={runExample}>
        {storageValue || 'click to set storage value'}
      </Button>
    </>
  )
}

export default () => (
  <UseWeb3Provider>
    <UseSimpleStorageProvider>
      <App />
    </UseSimpleStorageProvider>
  </UseWeb3Provider>
)

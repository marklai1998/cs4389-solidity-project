import React from 'react'
import 'antd/dist/antd.dark.css'
import { useWeb3, UseWeb3Provider } from './hooks/useWeb3'

import { Loading } from './components/Loading'
import styled, { createGlobalStyle } from 'styled-components'
import background from './assets/background.jpg'
import { Header } from './containers/Header'
import { Drawer } from './containers/Drawer'
import { Calendar } from './containers/Calendar'
import { UseEventProvider } from './hooks/useEvent'
import { ViewEventModal } from './containers/ViewEventModal'

const App = () => {
  const { web3, accounts } = useWeb3()

  const loading = !web3 || !accounts
  return (
    <Wrapper>
      <GlobalStyle />
      {loading ? (
        <Loading />
      ) : (
        <>
          <ViewEventModal />
          <Header />
          <Column>
            <Drawer />
            <Calendar />
          </Column>
        </>
      )}
    </Wrapper>
  )
}

export default () => (
  <UseWeb3Provider>
    <UseEventProvider>
      <App />
    </UseEventProvider>
  </UseWeb3Provider>
)

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;

  background: url(${background});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`

const Column = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
`

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Rajdhani', sans-serif;
  }
`

import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { UseWeb3Provider } from './hooks/useWeb3'

const rootEle = document.getElementById('root')
if (rootEle)
  render(
    <UseWeb3Provider>
      <App />
    </UseWeb3Provider>,
    rootEle
  )

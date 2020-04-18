import React from 'react'
import { render } from 'react-dom'
import App from './App'

const rootEle = document.getElementById('root')
if (rootEle) render(<App />, rootEle)

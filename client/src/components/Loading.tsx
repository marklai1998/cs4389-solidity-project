import React from 'react'
import loadingSpinner from '../assets/colored.svg'
import styled from 'styled-components'

export const Loading = () => (
  <Wrapper>
    <LoadingSpinner src={loadingSpinner} alt='loading' />
  </Wrapper>
)

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  vertical-align: middle;
  justify-content: center;
`

const LoadingSpinner = styled.img`
  width: 100px;
`

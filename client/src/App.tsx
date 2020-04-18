import React, { useState, useEffect } from 'react'
import SimpleStorageContract from './contracts/SimpleStorage.json'
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import 'antd/dist/antd.css'
import { useWeb3 } from './hooks/useWeb3'

const App = () => {
  const { web3, accounts } = useWeb3()

  const [storageValue, setStorageValue] = useState(0)
  const [
    simpleStorageContract,
    setSimpleStorageContract,
  ] = useState<Contract | null>(null)

  useEffect(() => {
    const initSimpleStorageContract = async () => {
      if (!web3) return
      try {
        // Get the contract instance.
        const networkId = await web3.eth.net.getId()
        const deployedNetwork = (SimpleStorageContract as any).networks[
          networkId
        ]
        const instance = new web3.eth.Contract(
          SimpleStorageContract.abi as AbiItem[],
          deployedNetwork && deployedNetwork.address
        )
        setSimpleStorageContract(instance)
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(`Failed to load accounts or contract. Check console for details.`)
        console.error(error)
      }
    }
    initSimpleStorageContract()
  }, [web3, accounts])

  useEffect(() => {
    const runExample = async () => {
      if (!accounts || !simpleStorageContract) return

      // Stores a given value, 5 by default.
      await simpleStorageContract.methods.set(10).send({ from: accounts[0] })

      // Get the value from the contract to prove it worked.
      const response = await simpleStorageContract.methods.get().call()

      // Update state with the result.
      setStorageValue(response)
    }
    runExample()
  }, [accounts, simpleStorageContract])

  return web3 && accounts && simpleStorageContract ? (
    <div className='pp'>
      <h1>Good to Go!</h1>
      <p>Your Truffle Box is installed and ready.</p>
      <h2>Smart Contract Example</h2>
      <p>
        If your contracts compiled and migrated successfully, below will show a
        stored value of 5 (by default).
      </p>
      <p>
        Try changing the value stored on <strong>line 40</strong> of App.js.
      </p>
      <div>The stored value is: {storageValue}</div>
    </div>
  ) : (
    <div>Loading Web3, accounts, and contract...</div>
  )
}

export default App

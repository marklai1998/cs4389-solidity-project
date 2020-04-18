import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import constate from 'constate'
import { useEffect, useState } from 'react'
import { useWeb3 } from './useWeb3'
import SimpleStorageContract from '../contracts/SimpleStorage.json'

export const [UseSimpleStorageProvider, useSimpleStorage] = constate(() => {
  const { web3, accounts } = useWeb3()

  const [storageValue, setStorageValue] = useState<number | null>(null)
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

  const runExample = async () => {
    if (!accounts || !simpleStorageContract) return

    // Stores a given value, 5 by default.
    await simpleStorageContract.methods.set(10).send({ from: accounts[0] })

    // Get the value from the contract to prove it worked.
    const response = await simpleStorageContract.methods.get().call()

    // Update state with the result.
    setStorageValue(response)
  }

  return { runExample, storageValue }
})

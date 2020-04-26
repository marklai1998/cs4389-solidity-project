import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import { useState, useEffect } from 'react'
import constate from 'constate'
import { useWeb3 } from './useWeb3'
import { useInterval } from 'react-use'
import * as R from 'ramda'
import EventManagerContract from '../contracts/EventManager.json'
import { Event } from '../types/Event'
import { message } from 'antd'
import { Attendee } from '../types/Attendee'

const parseEvent = (item: any): Event => ({
  organizer: R.prop('organizer', item),
  id: R.prop('id', item),
  name: R.prop('name', item),
  description: R.prop('description', item),
  startDate: R.prop('startDate', item),
  dueDate: R.prop('dueDate', item),
  headcount: R.prop('headcount', item),
  fee: R.prop('fee', item),
  claimed: R.prop('claimed', item),
})

const parseAttendee = (item: any): Attendee => ({
  buyer: R.prop('buyer', item),
  firstName: R.prop('firstName', item),
  lastName: R.prop('lastName', item),
  email: R.prop('email', item),
})

export type EventListItem = {
  event: Event
  attendees: number
  isInTheEvent: boolean
}

export const [UseEventProvider, useEvent] = constate(() => {
  const { web3, accounts, selectedAccount } = useWeb3()
  const [
    eventManagerContract,
    setEventManagerContract,
  ] = useState<Contract | null>(null)

  const [events, setEvents] = useState<EventListItem[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const getEventAttendeeCount = async (id: string): Promise<number> => {
    if (!accounts || !eventManagerContract) return 0
    const result = await eventManagerContract.methods
      .getEventAttendeesCountById(id)
      .call()
    return result
  }

  const getEventAttendeeList = async (id: string): Promise<Attendee[]> => {
    if (!accounts || !eventManagerContract) return []
    const attendees = await eventManagerContract.methods
      .getEventAttendeesById(id)
      .call()
    const parsedAttendees = attendees.map(parseAttendee)
    return parsedAttendees
  }

  const getIsInTheEvent = async (id: string): Promise<boolean> => {
    if (!accounts || !eventManagerContract) return false
    const result = await eventManagerContract.methods
      .getIsInTheEventById(id)
      .call({ from: selectedAccount })
    return result
  }

  const getEventFee = async (id: string): Promise<number> => {
    if (!accounts || !eventManagerContract) return 0
    const fee = await eventManagerContract.methods.getEventFeeById(id).call()
    return fee
  }

  const refreshEvents = async () => {
    if (!accounts || !eventManagerContract) return

    const event = await eventManagerContract.methods.getAllEvent().call()
    const parsedEvents: Event[] = event.map(parseEvent)

    const withAtt = await Promise.all(
      parsedEvents.map(async (event) => {
        const attendees = await getEventAttendeeCount(event.id)
        const isInTheEvent = await getIsInTheEvent(event.id)
        return { event, attendees, isInTheEvent }
      })
    )

    setEvents(withAtt)
  }

  const getEvent = async (id: string): Promise<EventListItem | null> => {
    if (!accounts || !eventManagerContract) return null
    const event = await eventManagerContract.methods.getEventById(id).call()
    const parsedEvent = parseEvent(event)
    const attendees = await getEventAttendeeCount(id)
    const isInTheEvent = await getIsInTheEvent(event.id)

    return { event: parsedEvent, attendees, isInTheEvent }
  }

  useInterval(
    () => {
      refreshEvents()
    },
    5000 // 5s
  )

  useEffect(() => {
    refreshEvents()
  }, [eventManagerContract])

  useEffect(() => {
    const initEventManagerContract = async () => {
      if (!web3) return
      try {
        // Get the contract instance.
        const networkId = await web3.eth.net.getId()
        const deployedNetwork = (EventManagerContract as any).networks[
          networkId
        ]
        const instance = new web3.eth.Contract(
          EventManagerContract.abi as AbiItem[],
          deployedNetwork && deployedNetwork.address
        )
        setEventManagerContract(instance)
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(`Failed to load accounts or contract. Check console for details.`)
        console.error(error)
      }
    }
    initEventManagerContract()
  }, [web3, accounts])

  const createEvent = async ({
    id,
    name,
    description,
    date,
    dueDate,
    headcount,
    fee,
  }: {
    name: string
    id: string
    description: string
    date: string
    dueDate: string
    headcount: number
    fee: number
  }) => {
    if (!accounts || !eventManagerContract || !selectedAccount) return
    const result = await eventManagerContract.methods
      .createEvent(id, name, description, date, dueDate, headcount, fee)
      .send({ from: selectedAccount, gas: 6721975 })

    if (result === false) message.error('Event already exist!')

    refreshEvents()
  }

  const joinEvent = async (
    id: string,
    {
      firstName,
      lastName,
      email,
    }: { firstName: string; lastName: string; email: string }
  ) => {
    if (!accounts || !eventManagerContract || !selectedAccount) return
    const eventFee = await getEventFee(id)

    const result = await eventManagerContract.methods
      .joinEvent(id, firstName, lastName, email)
      .send({ from: selectedAccount, gas: 6721975, value: eventFee })

    return result
  }

  const leaveEvent = async (id: string) => {
    if (!accounts || !eventManagerContract || !selectedAccount) return
    const result = await eventManagerContract.methods
      .leaveEvent(id)
      .send({ from: selectedAccount, gas: 6721975 })

    return result
  }

  const claimEvent = async (id: string) => {
    if (!accounts || !eventManagerContract || !selectedAccount) return
    const result = await eventManagerContract.methods
      .claimEvent(id)
      .send({ from: selectedAccount, gas: 6721975 })

    return result
  }

  return {
    events,
    createEvent,
    getEvent,
    setSelectedEventId,
    selectedEventId,
    joinEvent,
    leaveEvent,
    claimEvent,
    getEventAttendeeList,
  }
})

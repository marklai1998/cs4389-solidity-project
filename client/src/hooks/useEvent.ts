import { useState, useEffect } from 'react'
import constate from 'constate'
// import { useWeb3 } from './useWeb3'
import { useInterval } from 'react-use'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import * as R from 'ramda'

export type Event = {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  dueDate: string
  organizer: string
  headcount: number
  fee: number
  joined: Attendee[]
}

export type Attendee = {
  account: string
  firstName: string
  lastName: string
  email: string
}

const MockedData: Event[] = [
  {
    id: uuid(),
    name: 'test event1',
    description: '',
    startDate: moment().add('day', 1).toISOString(),
    endDate: moment().add('day', 1).toISOString(),
    dueDate: moment().add('day', 1).toISOString(),
    organizer: 'someAddress',
    headcount: 10,
    fee: 10,
    joined: [
      {
        account: 'someAddress',
        firstName: 'mark',
        lastName: 'lai',
        email: 'a@a.com',
      },
      {
        account: 'someAddress',
        firstName: 'ivan',
        lastName: 'Lau',
        email: 'a@a.com',
      },
    ],
  },
  {
    id: uuid(),
    name: 'test event1',
    description: '',
    startDate: moment().add('day', 1).toISOString(),
    endDate: moment().add('day', 1).toISOString(),
    dueDate: moment().add('day', 1).toISOString(),
    organizer: 'someAddress',
    headcount: 10,
    fee: 10,
    joined: [
      {
        account: 'someAddress',
        firstName: 'mark',
        lastName: 'lai',
        email: 'a@a.com',
      },
      {
        account: 'someAddress',
        firstName: 'ivan',
        lastName: 'Lau',
        email: 'a@a.com',
      },
    ],
  },
  {
    id: uuid(),
    name: 'test event1',
    description: '',
    startDate: moment().add('day', 1).toISOString(),
    endDate: moment().add('day', 1).toISOString(),
    dueDate: moment().add('day', 1).toISOString(),
    organizer: 'someAddress',
    headcount: 10,
    fee: 10,
    joined: [
      {
        account: 'someAddress',
        firstName: 'mark',
        lastName: 'lai',
        email: 'a@a.com',
      },
      {
        account: 'someAddress',
        firstName: 'ivan',
        lastName: 'Lau',
        email: 'a@a.com',
      },
    ],
  },
  {
    id: uuid(),
    name: 'test event1',
    description: '',
    startDate: moment().add('day', 1).toISOString(),
    endDate: moment().add('day', 1).toISOString(),
    dueDate: moment().add('day', 1).toISOString(),
    organizer: 'someAddress',
    headcount: 10,
    fee: 10,
    joined: [
      {
        account: 'someAddress',
        firstName: 'mark',
        lastName: 'lai',
        email: 'a@a.com',
      },
      {
        account: 'someAddress',
        firstName: 'ivan',
        lastName: 'Lau',
        email: 'a@a.com',
      },
    ],
  },
  {
    id: uuid(),
    name: 'test event1',
    description: '',
    startDate: moment().add('day', 1).toISOString(),
    endDate: moment().add('day', 1).toISOString(),
    dueDate: moment().add('day', 1).toISOString(),
    organizer: 'someAddress',
    headcount: 10,
    fee: 10,
    joined: [
      {
        account: 'someAddress',
        firstName: 'mark',
        lastName: 'lai',
        email: 'a@a.com',
      },
      {
        account: 'someAddress',
        firstName: 'ivan',
        lastName: 'Lau',
        email: 'a@a.com',
      },
    ],
  },
]

export const [UseEventProvider, useEvent] = constate(() => {
  // const { web3 } = useWeb3()
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const refreshEvents = async () => {
    // TODO: get all event from contract
    setEvents(MockedData)
  }

  const createEvent = (event: Event) => {
    console.log(event)
    // TODO: save event
  }

  const viewEvent = (id: string) => {
    // TODO: save event
    const result = R.find(R.propEq('id', id), events)
    if (!result) return
    setSelectedEvent(result)
  }

  const joinEvent = (id: string) => {
    // TODO: save event
    const result = R.find(R.propEq('id', id), events)
    if (!result) return
    setSelectedEvent(result)
  }

  const resetSelectedEvent = () => {
    setSelectedEvent(null)
  }

  useInterval(
    () => {
      refreshEvents()
    },
    5000 // 5s
  )

  useEffect(() => {
    refreshEvents()
  }, [])

  return {
    events,
    createEvent,
    viewEvent,
    selectedEvent,
    resetSelectedEvent,
    joinEvent,
  }
})

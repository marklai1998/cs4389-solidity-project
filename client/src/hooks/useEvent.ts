import { useState, useEffect } from 'react'
import constate from 'constate'
// import { useWeb3 } from './useWeb3'
import { useInterval } from 'react-use'
import moment from 'moment'
import { v4 as uuid } from 'uuid'

export type Event = {
  id: string
  name: string
  description: string
  start: string
  end: string
  organizer: string
  joined: string[]
}

const MockedData: Event[] = [
  {
    id: uuid(),
    name: 'test event1',
    description: '',
    start: moment().set('year', 2022).toISOString(),
    end: moment().set('year', 2022).toISOString(),
    organizer: 'someAddress',
    joined: ['someAddress1', 'someAddress2'],
  },
  {
    id: uuid(),
    name: 'test event1 but the name is too long',
    description: '',
    start: moment().set('year', 2022).toISOString(),
    end: moment().set('year', 2022).toISOString(),
    organizer: 'someAddress',
    joined: ['someAddress1', 'someAddress2'],
  },
  {
    id: uuid(),
    name: 'test event1',
    description: '',
    start: moment().set('year', 2021).toISOString(),
    end: moment().set('year', 2021).toISOString(),
    organizer: 'someAddress',
    joined: ['someAddress1', 'someAddress2'],
  },
  {
    id: uuid(),
    name: 'test event1',
    description: '',
    start: moment().set('year', 2021).toISOString(),
    end: moment().set('year', 2021).toISOString(),
    organizer: 'someAddress',
    joined: ['someAddress1', 'someAddress2'],
  },
  {
    id: uuid(),
    name: 'test event1',
    description: '',
    start: moment().set('year', 2022).toISOString(),
    end: moment().set('year', 2022).toISOString(),
    organizer: 'someAddress',
    joined: ['someAddress1', 'someAddress2'],
  },
  {
    id: uuid(),
    name: 'test event1',
    description: '',
    start: moment().set('year', 2022).toISOString(),
    end: moment().set('year', 2022).toISOString(),
    organizer: 'someAddress',
    joined: ['someAddress1', 'someAddress2'],
  },
  {
    id: uuid(),
    name: 'test event1',
    description: '',
    start: moment().set('year', 2022).toISOString(),
    end: moment().set('year', 2022).toISOString(),
    organizer: 'someAddress',
    joined: ['someAddress1', 'someAddress2'],
  },
  {
    id: uuid(),
    name: 'test event1',
    description: '',
    start: moment().set('year', 2022).toISOString(),
    end: moment().set('year', 2022).toISOString(),
    organizer: 'someAddress',
    joined: ['someAddress1', 'someAddress2'],
  },
  {
    id: uuid(),
    name: 'test event1',
    description: '',
    start: moment().set('year', 2022).toISOString(),
    end: moment().set('year', 2022).toISOString(),
    organizer: 'someAddress',
    joined: ['someAddress1', 'someAddress2'],
  },
  {
    id: uuid(),
    name: 'test event1',
    description: '',
    start: moment().set('year', 2022).toISOString(),
    end: moment().set('year', 2022).toISOString(),
    organizer: 'someAddress',
    joined: ['someAddress1', 'someAddress2'],
  },
]

export const [UseEventProvider, useEvent] = constate(() => {
  // const { web3 } = useWeb3()
  const [events, setEvents] = useState<Event[]>([])

  const refreshEvents = async () => {
    // TODO: get all event from contract
    setEvents(MockedData)
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

  return { events }
})

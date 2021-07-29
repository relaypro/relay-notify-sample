import axios from 'axios'
import dotenv from 'dotenv'
import pkg from '@relaypro/sdk'
const { Event, Taps, Button, createWorkflow, NotificationPriority, NotificationSound } = pkg
import {EventEmitter} from "events"
import {emitterDispatch} from './dispatch.js'
export const emitterHospital = new EventEmitter()
dotenv.config()

const createApp = (relay) => {
    relay.on(`start`, async () => {
        await relay.flash(`FFA500`) //on initiation of workflow, start flashing LEDs orange
        await relay.say('You are requesting a LifeStar helicopter to Hiawatha Community Hospital in Hiawatha, Kansas. Standby while we send your request.')
        await relay.rotate(`FFA500`)
        await relay.say(`Your request for an immediate helicopter launch to Hiawatha Community Hospital has been
        received in the dispatch center. Please standby for aircraft assignment and ETA`)
        await console.log(process.env.DISPATCH)
        await relay.alert('new_request', 'LifeStar requested at Hiawatha Community Hospital in Hiawatha, Kansas', [`${process.env.DISPATCH}`])
        await console.log("hospital :after alert")
    })

    emitterDispatch.on(`launch`, async (eta) => {
        console.log()
        await relay.say(`LifeStar Lawrence is wheels up, enroute to your location, ETA is ${eta} min`)
    })

    emitterDispatch.on(`update`, async (eta) => {
        await relay.say(`LifeStar Lawrence will arrive at your location in 5 minutes. LifeStar Lawrence arriving in 5 minutes.`)
        await relay.terminate()
    })

    relay.on(Event.NOTIFICATION, async (notificationEvent) => {
        console.log("got event notification ack")
        await relay.breathe(`00FF00`)
        await relay.say(`LifeStar Lawrence has accepted this flight, ETA is 25 minutes.`)
        await relay.broadcast('accept_request', `Successfully acknowledged Hiawatha Community Hospital's request`, [`${notificationEvent.source}`])
    })
}

export default createApp
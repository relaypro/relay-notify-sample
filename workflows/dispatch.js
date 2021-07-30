import axios from 'axios'
import dotenv from 'dotenv'
import pkg from '@relaypro/sdk'
const { Event, Taps, Button, createWorkflow, NotificationPriority, NotificationSound } = pkg
import { EventEmitter} from "events"
import {emitterHospital} from './hospital.js'
export const emitterDispatch = new EventEmitter()
dotenv.config()

const createApp = (relay) => {
    relay.on(`start`, async () => {
        await relay.flash(`FFA500`) //on initiation of workflow, start flashing LEDs orange
        await relay.say('Launching helicopter. Sending notification to Hiawatha Community Hospital')
        await relay.rotate(`00FF00`)
        setTimeout(async () => {  
            console.log("dispatch: before emit");
            emitterDispatch.emit(`launch`, `20`);
            console.log("dispatch: after emit");
        }, 6000)
    })

    relay.on(`button`, async (button, taps) => {
        console.log("button clicked")
        console.log(button.button)
        if (button.button === `action`) {
            if (button.taps === `single`) {
                await relay.say('sending ETA update to Hiawatha Community Hospital')
                setTimeout(async () => {  
                    emitterDispatch.emit(`update`, `5`); 
                }, 6000)
                await relay.terminate()
            }
        }
    })
}

export default createApp

import pkg from '@relaypro/sdk'
import {requests } from '../server.js'

const { Event, Taps, Button, createWorkflow, NotificationPriority, NotificationSound } = pkg

export default createWorkflow(relay => {
  const workflowName = `Notify`
  let deviceName, deviceId, targets, request_type
  function log(msg) {
    console.log(`[${workflowName}/${deviceId}/${deviceName}] ${msg}`)
  }

  relay.on(Event.START, async (msg) => {
    deviceName = await relay.getDeviceName()
    deviceId = await relay.getDeviceId()
    targets = await relay.getVar('targets')
    const request_text = await relay.getVar('request_text')
    request_type = await relay.getVar('request_type')
    log(request_type)
    log(targets)
    log(`Start event`)
    log(deviceId)
    log(request_text)
    await relay.say(request_text)
    const request = await relay.listen()
    requests.push(request.text)

    await relay.say(`Sending your ${request_type} request for ${request.text} to available staff`) // Sending your request for to available staff
    if(request_type === 'pickup') {
      await relay.notify(request_type,`Please bring ${request.text} to the front!`, [`${targets}`],) //rover is here for drop off 
    } else if (request_type === 'go home') {
      await relay.alert(request_type,`Please send ${request.text} home!`, [`${targets}`],)      // drop off rover daycare is here
    }

    log('Completed notify')
  })

  relay.on(Event.NOTIFICATION, async (notificationEvent) => {
    log(`Got notification update: ${JSON.stringify(notificationEvent)}`)  
    if(notificationEvent.event === `ack_event`) {
      let current_request = requests.shift()
      if(notificationEvent.name === 'pickup') {
        await relay.say(`${notificationEvent.source} is bringing ${current_request} to the front.`)
      } else if (notificationEvent.name === 'go home') {
        await relay.say(`${notificationEvent.source} is sending ${current_request} home.`)
      }
      await relay.cancelAlert(notificationEvent.name, [`${targets}`])
      await relay.broadcast(`You have accepted the ${notificationEvent.name} request for ${current_request}.`, [`${notificationEvent.source}`])
      relay.terminate()
    }
  })

  relay.on(Event.BUTTON, async (buttonEvent) => {
    log(`Button Event`)
    log(buttonEvent.taps)
    log(buttonEvent.button)
    if (buttonEvent.button === Button.ACTION) {
      log(`action `)
      if (buttonEvent.taps === Taps.SINGLE) {
        log(`single `)
        } else if (buttonEvent.taps === Taps.DOUBLE) { 
        await relay.say(`Goodbye`)        
        await relay.terminate()
      }
    }
  })
})

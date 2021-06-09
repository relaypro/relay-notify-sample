
import pkg from '@relaypro/sdk'
import {requests } from '../server.js'

const { Event, Taps, Button, createWorkflow, NotificationPriority, NotificationSound } = pkg

export default createWorkflow(relay => {
  const workflowName = `Notify`
  let deviceName, deviceId
  function log(msg) {
    console.log(`[${workflowName}/${deviceId}/${deviceName}] ${msg}`)
  }

  relay.on(Event.START, async (msg) => {
    deviceName = await relay.getDeviceName()
    deviceId = await relay.getDeviceId()
    const targets = relay.getVar('targets')
    const request_text = relay.getVar('request')
    const request_type = relay.getVar('request_type')

    //const notify_text = relay.getVar('notify_text')
    log(`Start event`)
    log(JSON.stringify(msg))
    log(deviceId)
    requests = requests + 1
    await relay.say(request_text)
    const request = await relay.listen()
    
    const options = {}
    
    options.priority = NotificationPriority.HIGH
    options.title = `Title`
    options.body = `Body`
    options.sound = NotificationSound.DEFAULT

    log(JSON.stringify(options))

    await relay.say(`Sending your ${request_type} request for ${request.text} to available staff`) // Sending your request for to available staff
    if(request_type === 'pickup') {
      await relay.alert('Pickup',`Please bring ${request.text} to the front!`, [`${targets}`], options)
    }
    
       
    log('Completed notify')
  })

  relay.on(Event.NOTIFICATION, async (notificationEvent) => {
    log(`Got notification update: ${JSON.stringify(notificationEvent)}`)  
    if(notificationEvent.event === `ack_event`) {
      requests = requests - 1
      await relay.say(`${notificationEvent.source} is bringing your dog to the front.`)
      await relay.broadcast(`You have accepted the current request. There are ${requests} requests pending.`, [`${notificationEvent.source}`])
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

import pkg from '@relaypro/sdk'
const { Event, Taps, Button, createWorkflow, NotificationPriority, NotificationSound } = pkg

export default createWorkflow(relay => {
  const workflowName = `Page_nurse`
  let deviceName, deviceId, targets, room
  function log(msg) {
    console.log(`[${workflowName}/${deviceId}/${deviceName}] ${msg}`)
  }

  relay.on(Event.START, async (msg) => {
    deviceName = await relay.getDeviceName()
    deviceId = await relay.getDeviceId()
    targets = await relay.getVar('nurse_device')
    room = await relay.getVar('room')
    log(targets)

    await relay.alert(request_type,`New request from ${room}`, [`${targets}`],) 
    log('Completed alert')
  })

  relay.on(Event.NOTIFICATION, async (notificationEvent) => {
    log(`Got notification update: ${JSON.stringify(notificationEvent)}`)  
    // Any confirmation action you want to send back
    relay.terminate()
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


import pkg from '@relaypro/sdk'
const { Event, Taps, Button, createWorkflow, NotificationPriority, NotificationSound } = pkg

export default createWorkflow(relay => {
  const workflowName = `Page_nurse`
  let deviceName, deviceId, targets, room

  function log(msg) {
    console.log(`[${workflowName}/${deviceId}/${deviceName}] ${msg}`)
  }

  relay.on(Event.START, async (msg) => {
    log(`Started ${workflowName} workflow`)

    deviceName = await relay.getDeviceName()
    deviceId = await relay.getDeviceId()
    targets = await relay.getVar('targets') // Nurse Relay Device or Relay Channel name
    room = await relay.getVar('room')

    // alert params: alert(name: string, text: string, target: string[])
    await relay.alert(room,`New request from ${room}`, [`${targets}`],)
    //await relay.broadcast(request_type,`New request from ${room}`, [`${targets}`] ) 
    log(`Completed ${workflowName} workflow`)
  })

  relay.on(Event.NOTIFICATION, async (notificationEvent) => {
    log(`Got notification update: ${JSON.stringify(notificationEvent)}`) 
    if(notificationEvent.event === `ack_event`) {
        await relay.broadcast(`You have accepted the request for ${notificationEvent.name}`,[`${notificationEvent.source}`])
        await relay.cancelAlert(room) 
        // Any confirmation action you want to send back
        await relay.terminate()
    }
  })

})

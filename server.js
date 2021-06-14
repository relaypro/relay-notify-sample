import { relay } from '@relaypro/sdk'
import notify from './workflows/notify.js'
import page from './workflows/page.js'
import express from 'express'
import querystring from 'querystring'


const express1 = express()
const port = process.env.PORT || 3000
export const requests = []
const ibot = 'https://all-api-qa-ibot.nocell.io'
const workflow = '/ibot/workflow/wf_page_nurse_zTc3PwRahGlWl3HV2UQj0B' //TODO
const auth_endpoint = `https://auth.republicdev.info/oauth2/token`
const sub_id = 'cd11920e-140a-4f3d-869d-e7bba0d24c72'
const user_id = 'VIRT1aq4dw2PkyLkI5efJpg6nF'

const params = querystring.stringify({
  'subscriber_id': sub_id,
  'user_id': user_id
})

express1.use(express.json());
express1.use(express.urlencoded({
  extended: true
}));

express1.post('/nurse_request', async (req, res) => {
  console.log(`Request to /nurse_request`)
  //console.log(req)
  let payload = req.body
  console.log(payload)
/*
  console.log(payload)
  let auth_header = await auth()
  try { 
    const response = await axios.post(`${ibot}${workflow}?${params}`,
    {
      "action": "invoke",
      "action_args": {
         "notify_device": payload.nurse_device,
         "room": payload.room
        }
    },
    { 
      headers : auth_header
    })
    if (response.status == 200 || response.status == 400) {
      console.log(`Remote trigger invoked`)
      console.log(response.statusText)
      
    }
  } catch (e) {
    console.error(e)
  }

*/
  res.send('Recieved')
})


const server = express1.listen(port, () => {
  console.log(`express listening on ${port}`)
})

const app = relay({server})

app.workflow(`notify`, notify)
app.workflow(`page_nurse`,page)


async function auth() {
  try {
    const response = await axios.post(auth_endpoint, 
      querystring.stringify({
        'grant_type': 'password',
        'client_id': '26NPNHUC',
        'client_secret': 'QM6mLXxTQGH26B52',
        'username': process.env.DEMO_ACCOUNT,
        'password': process.env.DEMO_PASSWORD
      }),
    { 
      headers : {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    console.log(`Auth Token: ${response.data.access_token}`)
    var auth_header = {
      'Authorization': `Bearer ${response.data.access_token}`,
      'Content-Type': 'application/json'
    }
  } catch (err) {
    console.error(err)
  }
  return auth_header
}


import { relay } from '@relaypro/sdk'
import notify from './workflows/relay.js'
import express from 'express'

const express1 = express()
const port = process.env.PORT || 3000
export const requests = []

express1.use(express.json());
express1.use(express.urlencoded({
  extended: true
}));

const server = express1.listen(port, () => {
  console.log(`express listening on ${port}`)
})

const app = relay({server})

app.workflow(`notify`, notify)


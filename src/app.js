import express from 'express'

import routes from './routes'
import database from './config/database'

const app = express()

const configureExpress = () => {
  app.use(express.json())

  app.use('/', routes)

  return app
}

export default () => database.connect().then(configureExpress)

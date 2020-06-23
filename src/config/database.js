import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const config = {
  uri: process.env.MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useCreateIndex: true
  }
}

mongoose.connection.on('open', () => {
  console.log('Successfully connected to database.')
})

mongoose.connection.on('error', () => {
  throw new Error('Could not connect to MongoDB.')
})

export default {
  connect: () => mongoose.connect(config.uri, config.options)
}

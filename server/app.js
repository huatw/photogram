'use strict'

const path = require('path')
const express = require('express')
const compression = require('compression')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const morgan = require('morgan')
const mongoose = require('mongoose')
// const MongoStore = require('connect-mongo')(session)
const cors = require('cors')

const {publicPath, imgPath, serverPort, dbpath} = require('./config')
const configPassport = require('./middlewares/passport')
const router = require('./routes')

const app = express()

const isProd = process.env.NODE_ENV === 'production'
if (!isProd) {
  app.use(cors({
    credentials: true,
    origin: 'http://localhost:8080'
  }))
}

app.set('x-powered-by', false)
app.use(morgan('dev'))

app.use(favicon(path.join(imgPath, './favicon.ico')))
app.use(express.static(publicPath))
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: '!@#$%^&*'
}))
configPassport(app)
app.use('/api', router)

// 404 handler, return main page, let front-end router handles.
app.use('*', (req, res) => {
  res.status(404).sendFile(path.join(publicPath, './index.html'))
})

// fall safe, catch all error
app.use((err, req, res, next) => {
  console.log('error happened:', err)
  res.status(err.status || 500).json({message: err.toString()})
})

const startServer = () => app.listen(serverPort, () => {
  console.log(`server started at port: ${serverPort}`)
})

mongoose.Promise = global.Promise
mongoose
  .connect(dbpath, {useMongoClient: true, autoIndex: true})
  .then(
    () => console.log(`mongo started at port: ${dbpath}`),
    e => console.log('mongo error:', e)
  )
  .then(startServer)

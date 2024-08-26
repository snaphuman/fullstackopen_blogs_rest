const jwt = require('jsonwebtoken')
const logger = require('./logger')

const requestLogger = (req, res, next) => {
  logger.info('Method: ', req.method)
  logger.info('Path: ', req.path)
  logger.info('Body: ', req.body)
  logger.info('-------')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Malformed ID' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'expected username to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid'})
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired'})
  }

  logger.error(error)

  next(error)
}

const tokenExtractor = (req, res, next) => {
  const auth = req.get('Authorization')

  if (auth && auth.includes('Bearer')) {
    const token = auth.replace('Bearer ', '');
    req.token = token
  }

  next();
}

const tokenVerifier = (req, res, next) => {
  const token = req.token
  const isLogin = req.originalUrl.endsWith('login')

  if (!isLogin && !token)  {
    return res.status(401).json({ error: 'token no provided'})
  }

  if (!isLogin) {
    const secret = process.env.SECRET
    const verification = jwt.verify(token, secret)

    req.verifiedToken = verification;
  }

  next()
}

const userExtractor = (req, res, next) => {
  const token = req.token
  const isLogin = req.originalUrl.endsWith('login')

  if (!isLogin && !token)  {
    return res.status(401).json({ error: 'token no provided'})
  }

  if (!isLogin) {
    const decoded = jwt.decode(token)
    console.log('decoded', decoded)

    req.user = decoded;
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  tokenVerifier,
  userExtractor,
}
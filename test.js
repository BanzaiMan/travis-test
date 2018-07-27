import path from 'path'
import test from 'ava'

const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')

const { bind } = require('./')

const PROTO_PATH = path.resolve(__dirname, './hello.proto')
const pd = protoLoader.loadSync(PROTO_PATH)
const hp = grpc.loadPackageDefinition(pd).helloworld

function sayHello (call, fn) {
  fn(null, { message: 'Hello ' + call.request.name })
}

test.cb('should bind service', t => {
  t.plan(1)

  const server = new grpc.Server()
  const port = 50051
  server.addService(hp.Greeter.service, { sayHello: sayHello })

  const bound = bind(server, port)

  t.is(bound, port)

  server.tryShutdown(t.end)
})

test.cb('should throw when binding to already taken port', t => {
  t.plan(3)

  const server = new grpc.Server()
  const port = 50052
  server.addService(hp.Greeter.service, { sayHello: sayHello })

  const bound = bind(server, port)

  t.is(bound, port)

  const error = t.throws(() => {
    bind(server, port)
  }, Error)

  t.is(error.message, `Failed to bind to port ${port}`)

  server.tryShutdown(t.end)
})

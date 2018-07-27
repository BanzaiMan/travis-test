const grpc = require('grpc')

function bind (server, port) {
  const bound = server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure())
  if (!bound) {
    throw new Error(`Failed to bind to port ${port}`)
  }

  return bound
}

module.exports = {
  bind
}

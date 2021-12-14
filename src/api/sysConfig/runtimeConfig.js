import ApiComm from '../ApiComm'

export default {
  create: (paramInfo) => {
    return ApiComm.$http.put('/server/runtime', paramInfo)
  },
  delete: (paramIds) => {
    return ApiComm.$http.delete('/server/runtime', {
      data: paramIds
    })
  },
  update: (paramInfo) => {
    return ApiComm.$http.patch('/server/runtime', paramInfo)
  },
  query: (query) => {
    return ApiComm.$http.post('/server/runtime', query)
  },
  getConfig: (name) => {
    return ApiComm.$http.get('/server/runtime/' + name)
  }
}

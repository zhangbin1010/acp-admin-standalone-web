import ApiComm from '../ApiComm'

export default {
  getList: () => {
    return ApiComm.$http.get('/server/app')
  },
  create: (appInfo) => {
    return ApiComm.$http.put('/server/app', appInfo)
  },
  delete: (appIds) => {
    return ApiComm.$http.delete('/server/app', {
      data: appIds
    })
  },
  update: (appInfo) => {
    return ApiComm.$http.patch('/server/app', appInfo)
  },
  getNewSecret: (appId) => {
    return ApiComm.$http.get('/server/app/update-secret/' + appId)
  },
  query: (query) => {
    return ApiComm.$http.post('/server/app', query)
  }
}

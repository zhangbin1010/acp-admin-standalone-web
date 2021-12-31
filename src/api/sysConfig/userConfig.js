import ApiComm from '../ApiComm'

export default {
  getModifiableUser: () => {
    return ApiComm.$http.get('/server/mod-user-list')
  },
  query: (query) => {
    return ApiComm.$http.post('/server/user', query)
  },
  delete: (idList) => {
    return ApiComm.$http.delete('/server/user', {
      data: idList
    })
  },
  create: (userInfo) => {
    return ApiComm.$http.put('/server/user', userInfo)
  },
  update: (userInfo) => {
    return ApiComm.$http.patch('/server/user', userInfo)
  },
  resetPwd: (userId) => {
    return ApiComm.$http.get('/server/user/reset-pwd/' + userId)
  },
  getUserList: (loginNoOrName) => {
    return ApiComm.$http.get('/oauth/user-list/' + loginNoOrName)
  }
}

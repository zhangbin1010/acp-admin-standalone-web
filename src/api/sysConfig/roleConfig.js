import ApiComm from '../ApiComm'

export default {
  getCodeList: () => {
    return ApiComm.$http.get('/server/role/role-code-list')
  },
  getList: () => {
    return ApiComm.$http.get('/server/role')
  },
  getRoleList: (appId) => {
    return ApiComm.$http.get('/server/role/role-list/' + appId)
  },
  getRoleInfo: (roleId) => {
    return ApiComm.$http.get('/server/role/' + roleId)
  },
  createRole: (roleInfo) => {
    return ApiComm.$http.put('/server/role', roleInfo)
  },
  deleteRole: (idList) => {
    return ApiComm.$http.delete('/server/role', {
      data: idList
    })
  },
  doUpdateRole: (roleInfo) => {
    return ApiComm.$http.patch('/server/role', roleInfo)
  }
}

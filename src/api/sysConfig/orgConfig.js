import ApiComm from '../ApiComm'

export default {
  getOrgList() {
    return ApiComm.$http.get('/server/org')
  },
  getOrgInfo(orgId) {
    return ApiComm.$http.get('/server/org/' + orgId)
  },
  createOrg(orgInfo) {
    return ApiComm.$http.put('/server/org', orgInfo)
  },
  deleteOrg(orgIds) {
    return ApiComm.$http.delete('/server/org', {
      data: orgIds
    })
  },
  doUpdateOrg(orgInfo) {
    return ApiComm.$http.patch('/server/org', orgInfo)
  }
}

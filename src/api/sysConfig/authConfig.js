import ApiComm from '../ApiComm'

export default {
  getMenus: () => {
    return ApiComm.$http.get('/server/menu-list')
  },
  getMenuList: (appId) => {
    return ApiComm.$http.get('/server/auth/menu-list/' + appId)
  },
  getModuleFuncList: (appId) => {
    return ApiComm.$http.get('/server/auth/module-func-list/' + appId)
  },
  getAllMenuList: () => {
    return ApiComm.$http.get('/server/auth/menu')
  },
  createMenu: (menuInfo) => {
    return ApiComm.$http.put('/server/auth/menu', menuInfo)
  },
  deleteMenu: (idList) => {
    return ApiComm.$http.delete('/server/auth/menu', {
      data: idList
    })
  },
  getMenuInfo: (menuId) => {
    return ApiComm.$http.get('/server/auth/menu/' + menuId)
  },
  doUpdateMenu: (menuInfo) => {
    return ApiComm.$http.patch('/server/auth/menu', menuInfo)
  },
  getModuleFuncCodeList: () => {
    return ApiComm.$http.get('/server/auth/module-func-code-list')
  },
  getAllModuleFuncList: () => {
    return ApiComm.$http.get('/server/auth/module-func')
  },
  createModuleFunc: (moduleFuncInfo) => {
    return ApiComm.$http.put('/server/auth/module-func', moduleFuncInfo)
  },
  deleteModuleFunc: (idList) => {
    return ApiComm.$http.delete('/server/auth/module-func', {
      data: idList
    })
  },
  getModuleFuncInfo: (moduleFuncId) => {
    return ApiComm.$http.get('/server/auth/module-func/' + moduleFuncId)
  },
  doUpdateModuleFunc: (moduleFuncInfo) => {
    return ApiComm.$http.patch('/server/auth/module-func', moduleFuncInfo)
  }
}

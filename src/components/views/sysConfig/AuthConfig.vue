<template>
  <el-tabs v-model="activeName">
    <el-tab-pane name="menuList">
      <template #label>
        <el-icon style="margin-right: 5px">
          <el-icon-menu/>
        </el-icon>
        {{ $t('forms.menuList') }}
      </template>
      <el-row :gutter="16">
        <el-col :lg="{ span: 9 }" style="min-width: 300px;margin-bottom: 16px;">
          <el-card>
            <div style="overflow-x: auto;overflow-y: hidden">
              <el-input v-model="menuTreeFilterText" :placeholder="$t('forms.pleaseEnter') + $t('forms.filterKey')"
                        clearable/>
              <el-tree ref="menuTree" v-loading="treeLoading"
                       :data="menuTreeData"
                       :default-expand-all="true" :expand-on-click-node="false" :filter-node-method="filterNode"
                       style="margin-right: 16px;min-height: 100px;margin-top: 10px;">
                <template #default="{ node, data }">
                  <span class="config-tree-node">
                    <span v-if="!data.isApp" @click="menuClick(data)">
                      <el-icon style="margin-right: 5px">
                        <component v-bind:is="'el-icon-'+data.iconType"></component>
                      </el-icon>
                      {{ node.label }}</span>
                    <span v-else>{{ node.label }}</span>
                    <span>
                      <el-button
                        v-if="!data.isApp && node.isLeaf"
                        :loading="treeLoading"
                        icon="el-icon-minus"
                        size="small"
                        type="text"
                        @click="removeMenu(node, data)">
                      </el-button>
                      <el-button
                        :loading="treeLoading"
                        icon="el-icon-plus"
                        size="small"
                        type="text"
                        @click="appendMenu(data)">
                      </el-button>
                    </span>
                  </span>
                </template>
              </el-tree>
            </div>
          </el-card>
        </el-col>
        <el-col v-show="currMenu.id&&currMenu.id!==''" :lg="{ span: 15 }" style="margin-bottom: 16px;">
          <el-card>
            <template #header>{{ currMenuFullPath }}</template>
            <el-form ref="menuEditForm" v-loading="treeLoading" :model="menuEditFormModel" :rules="ruleMenuEditForm"
                     label-width="undefined"
                     size="small" @submit.native.prevent>
              <el-row>
                <el-col :sm="{ span: 12 }">
                  <el-form-item :label="$t('forms.name')" prop="name">
                    <el-input ref="menuName" v-model="menuEditFormModel.name" :disabled="treeLoading"
                              :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                              @keyup.enter.native="doSaveMenu"/>
                  </el-form-item>
                </el-col>
                <el-col :sm="{ span: 12 }">
                  <el-form-item :label="$t('forms.iconType')" prop="iconType">
                    <el-input v-model="menuEditFormModel.iconType" :disabled="treeLoading"
                              :placeholder="$t('forms.pleaseEnter') + $t('forms.iconType')"
                              @keyup.enter.native="doSaveMenu"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="{ span: 12 }">
                  <el-form-item :label="$t('forms.parent')" prop="menuParentArray">
                    <el-cascader v-model="menuEditFormModel.menuParentArray" :disabled="treeLoading"
                                 :options="menuCascaderData" :props="{checkStrictly: true,value:'id'}"
                                 style="width: 100%"/>
                  </el-form-item>
                </el-col>
                <el-col :sm="{ span: 12 }">
                  <el-form-item :label="$t('forms.path')" prop="path">
                    <el-input v-model="menuEditFormModel.path" :disabled="treeLoading"
                              :placeholder="$t('forms.pleaseEnter') + $t('forms.path')"
                              @keyup.enter.native="doSaveMenu"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="{ span: 12 }">
                  <el-form-item :label="$t('forms.openType')" prop="openType">
                    <el-select v-model="menuEditFormModel.openType" :disabled="treeLoading" value="">
                      <el-option v-for="item in openType" :key="'openType-'+item.value" :label="item.label"
                                 :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="{ span: 12 }">
                  <el-form-item :label="$t('forms.sort')" prop="sort">
                    <el-input-number v-model="menuEditFormModel.sort" :disabled="treeLoading" :min="0"
                                     :placeholder="$t('forms.pleaseEnter') + $t('forms.sort')"
                                     style="width: 100%;max-width: 150px;"
                                     @keyup.enter.native="doSaveMenu">
                    </el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="{ span: 12 }">
                  <el-form-item :label="$t('forms.enabled')" :required="true" prop="enabled">
                    <el-switch v-model="menuEditFormModel.enabled" :disabled="treeLoading"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item :label="$t('forms.roleList')">
                <el-transfer v-model="menuEditFormModel.roleIds" v-loading="treeLoading"
                             :button-texts="[$t('forms.buttons.cancel'),$t('forms.buttons.select')]"
                             :data="optionalMenuRoles" :filterable="true"
                             :props="{key:'id',label:'label'}"
                             :titles="[$t('forms.optional'),$t('forms.selected')]"
                             @change="handleMenuRoleListChange">
                </el-transfer>
              </el-form-item>
              <div style="text-align: center">
                <el-button :loading="treeLoading" style="margin-right: 20px;" type="info"
                           @click="doResetMenu">
                  {{ $t('forms.buttons.reset') }}
                </el-button>
                <el-button :loading="treeLoading" type="primary" @click="doSaveMenu">
                  {{ $t('forms.buttons.submit') }}
                </el-button>
              </div>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane name="moduleFuncList">
      <template #label>
        <el-icon style="margin-right: 5px">
          <el-icon-grid/>
        </el-icon>
        {{ $t('forms.moduleFuncList') }}
      </template>
      <el-row :gutter="16">
        <el-col :lg="{ span: 9 }" style="min-width: 300px;margin-bottom: 16px;">
          <el-card>
            <div style="overflow-x: auto;overflow-y: hidden">
              <el-input v-model="moduleFuncTreeFilterText"
                        :placeholder="$t('forms.pleaseEnter') + $t('forms.filterKey')"
                        clearable/>
              <el-tree ref="moduleFuncTree" v-loading="treeLoading"
                       :data="moduleFuncTreeData"
                       :default-expand-all="true" :expand-on-click-node="false" :filter-node-method="filterNode"
                       style="margin-right: 16px;min-height: 100px;margin-top: 10px">
                <template #default="{ node, data }">
                  <span class="config-tree-node">
                  <span v-if="!data.isApp" @click="moduleFuncClick(data)">{{ node.label }}</span>
                  <span v-else>{{ node.label }}</span>
                  <span>
                    <el-button
                      v-if="!data.isApp && node.isLeaf"
                      :loading="treeLoading"
                      icon="el-icon-minus"
                      size="small"
                      type="text"
                      @click="removeModuleFunc(node, data)">
                    </el-button>
                    <el-button
                      :loading="treeLoading"
                      icon="el-icon-plus"
                      size="small"
                      type="text"
                      @click="appendModuleFunc(data)">
                    </el-button>
                  </span>
                </span>
                </template>
              </el-tree>
            </div>
          </el-card>
        </el-col>
        <el-col v-show="currModuleFunc.id&&currModuleFunc.id!==''" :lg="{ span: 15 }" style="margin-bottom: 16px;">
          <el-card>
            <template #header>{{ currModuleFuncFullPath }}</template>
            <el-form ref="moduleFuncEditForm" v-loading="treeLoading" :model="moduleFuncEditFormModel"
                     :rules="ruleModuleFuncEditForm"
                     label-width="undefined" size="small" @submit.native.prevent>
              <el-row>
                <el-col :sm="{ span: 12 }">
                  <el-form-item :label="$t('forms.name')" prop="name">
                    <el-input ref="moduleFuncName" v-model="moduleFuncEditFormModel.name" :disabled="treeLoading"
                              :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                              @keyup.enter.native="doSaveModuleFunc"/>
                  </el-form-item>
                </el-col>
                <el-col :sm="{ span: 12 }">
                  <el-form-item :label="$t('forms.code')" prop="code">
                    <el-autocomplete v-model="moduleFuncEditFormModel.code" :disabled="treeLoading"
                                     :fetch-suggestions="querySearch"
                                     :placeholder="$t('forms.pleaseEnter') + $t('forms.code')"
                                     style="width: 100%"
                                     @keyup.enter.native="doSaveModuleFunc"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="{ span: 24 }">
                  <el-form-item :label="$t('forms.parent')" prop="moduleFuncParentArray">
                    <el-cascader v-model="moduleFuncEditFormModel.moduleFuncParentArray"
                                 :disabled="treeLoading"
                                 :options="moduleFuncCascaderData" :props="{checkStrictly: true,value:'id'}"
                                 style="width: 100%"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item :label="$t('forms.roleList')">
                <el-transfer v-model="moduleFuncEditFormModel.roleIds" v-loading="treeLoading"
                             :button-texts="[$t('forms.buttons.cancel'),$t('forms.buttons.select')]"
                             :data="optionalModuleFuncRoles" :filterable="true"
                             :props="{key:'id',label:'label'}"
                             :titles="[$t('forms.optional'),$t('forms.selected')]"
                             @change="handleModuleFuncRoleListChange"/>
              </el-form-item>
              <div style="text-align: center">
                <el-button :loading="treeLoading" style="margin-right: 20px;" type="info"
                           @click="doResetModuleFunc">
                  {{ $t('forms.buttons.reset') }}
                </el-button>
                <el-button :loading="treeLoading" type="primary" @click="doSaveModuleFunc">
                  {{ $t('forms.buttons.submit') }}
                </el-button>
              </div>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import {
  copy,
  filterTreeNode,
  getTreeFullPathArray,
  getTreeFullPathTitle,
  processTreeNode,
  sortTreeNodes
} from '@/libs/tools'
import {nextTick, ref} from "vue";

export default {
  name: 'authConfig',
  data() {
    return {
      activeName: 'menuList',
      menuTreeData: [],
      moduleFuncTreeData: [],
      tree_loading: false,
      moduleFuncCode: [],
      currMenuFullPath: '',
      currMenuData: {},
      currMenu: {},
      menuEditFormModel: {sort: 0},
      currModuleFuncFullPath: '',
      currModuleFuncData: {},
      currModuleFunc: {},
      moduleFuncEditFormModel: {},
      optionalMenuRoles: [],
      optionalModuleFuncRoles: [],
      menuTreeFilterText: '',
      moduleFuncTreeFilterText: ''
    }
  },
  computed: {
    treeLoading() {
      return this.tree_loading
    },
    openType() {
      return [{
        value: 0,
        label: this.$i18n.t('forms.inner')
      }, {
        value: 1,
        label: this.$i18n.t('forms.newTabs')
      }]
    },
    menuCascaderData() {
      const menuTree = copy(this.menuTreeData)
      if (!this.menuEditFormModel.appId && this.menuEditFormModel.appId !== '') {
        for (let i = 0; i < menuTree.length; i++) {
          if (menuTree[i].id !== this.menuEditFormModel.appId) {
            menuTree.splice(i, 1)
            break
          }
        }
      }
      return filterTreeNode(menuTree, [this.menuEditFormModel.id])
    },
    moduleFuncCascaderData() {
      const moduleFuncTree = copy(this.moduleFuncTreeData)
      if (!this.moduleFuncEditFormModel.appId && this.moduleFuncEditFormModel.appId !== '') {
        for (let i = 0; i < moduleFuncTree.length; i++) {
          if (moduleFuncTree[i].id !== this.moduleFuncEditFormModel.appId) {
            moduleFuncTree.splice(i, 1)
            break
          }
        }
      }
      return filterTreeNode(moduleFuncTree, [this.moduleFuncEditFormModel.id])
    },
    menuParentArray() {
      return this.menuEditFormModel.menuParentArray
    },
    moduleFuncParentArray() {
      return this.moduleFuncEditFormModel.moduleFuncParentArray
    },
    ruleMenuEditForm() {
      return {
        name: [{
          required: true,
          message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }],
        iconType: [{
          required: true,
          message: this.$i18n.t('forms.iconType') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }],
        openType: [{
          type: 'integer',
          required: true,
          message: this.$i18n.t('forms.openType') + this.$i18n.t('forms.notEmpty'),
          trigger: 'change'
        }],
        sort: [{
          type: 'integer',
          required: true,
          message: this.$i18n.t('forms.sort') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }],
        menuParentArray: [{
          type: 'array',
          required: true,
          message: this.$i18n.t('forms.parent') + this.$i18n.t('forms.notEmpty'),
          trigger: 'on-change'
        }]
      }
    },
    ruleModuleFuncEditForm() {
      return {
        name: [{
          required: true,
          message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }],
        code: [{
          type: 'string',
          required: true,
          message: this.$i18n.t('forms.code') + this.$i18n.t('forms.notEmpty'),
          trigger: 'none'
        }],
        moduleFuncParentArray: [{
          type: 'array',
          required: true,
          message: this.$i18n.t('forms.parent') + this.$i18n.t('forms.notEmpty'),
          trigger: 'on-change'
        }]
      }
    }
  },
  watch: {
    menuTreeFilterText(value) {
      this.menuTree.filter(value)
    },
    moduleFuncTreeFilterText(value) {
      this.moduleFuncTree.filter(value)
    },
    menuParentArray(selectedArray) {
      if (selectedArray.length > 0) {
        this.menuEditFormModel.parentId = selectedArray[selectedArray.length - 1]
      } else {
        this.menuEditFormModel.parentId = ''
      }
    },
    moduleFuncParentArray(selectedArray) {
      if (selectedArray.length > 0) {
        this.moduleFuncEditFormModel.parentId = selectedArray[selectedArray.length - 1]
      } else {
        this.moduleFuncEditFormModel.parentId = ''
      }
    }
  },
  methods: {
    querySearch(queryString, cb) {
      let restaurants = this.moduleFuncCode
      let results = queryString ? restaurants.filter(item => {
        return item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }) : restaurants
      cb(results)
    },
    filterNode(value, data) {
      if (!value || value === '') {
        return true
      }
      return data.label.indexOf(value) !== -1
    },
    refreshModuleFuncCodeList() {
      this.tree_loading = true
      this.$api.request.auth.getModuleFuncCodeList().then((res) => {
        this.tree_loading = false
        if (res) {
          this.moduleFuncCode = res.data.map(item => {
            const obj = {}
            obj.value = item
            return obj
          })
        }
      }).catch(() => {
        this.tree_loading = false
      })
    },
    reloadMenuRoleList() {
      this.tree_loading = true
      this.$api.request.role.getRoleList(this.currMenu.appId).then((res) => {
        this.tree_loading = false
        if (res) {
          this.optionalMenuRoles = res.data.map(item => {
            item.label = item.name
            return item
          })
        }
        nextTick(() => {
          this.menuName.focus()
        })
      }).catch(() => {
        this.tree_loading = false
      })
    },
    reloadModuleFuncRoleList() {
      this.tree_loading = true
      this.$api.request.role.getRoleList(this.currModuleFunc.appId).then((res) => {
        this.tree_loading = false
        if (res) {
          this.optionalModuleFuncRoles = res.data.map(item => {
            item.label = item.name
            return item
          })
        }
        nextTick(() => {
          this.moduleFuncName.focus()
        })
      }).catch(() => {
        this.tree_loading = false
      })
    },
    refreshMenuTree(clear = true, callBackFun) {
      if (clear) {
        this.clearMenuCurrObj()
      }
      this.tree_loading = true
      this.$api.request.app.getList().then((appRes) => {
        if (appRes) {
          const appData = appRes.data
          for (let i = 0; i < appData.length; i++) {
            const item = appData[i]
            item.isApp = true
            item.appId = item.id
            item.name = item.appName
            item.label = item.appName
            item.sort = i
            item.children = []
          }
          this.$api.request.auth.getAllMenuList().then((res) => {
            this.tree_loading = false
            if (res) {
              processTreeNode(res.data)
              for (const item of res.data) {
                item.parentId = item.appId
                for (const root of appData) {
                  if (root.id === item.appId) {
                    root.children.push(item)
                  }
                }
              }
              this.menuTreeData = appData
              this.menuTreeFilterText = ''
              if (typeof callBackFun === 'function') {
                callBackFun()
              }
            }
          }).catch(() => {
            this.tree_loading = false
          })
        }
      }).catch(() => {
        this.tree_loading = false
      })
    },
    refreshModuleFuncTree(clear = true, callBackFun) {
      if (clear) {
        this.clearModuleFuncCurrObj()
      }
      this.tree_loading = true
      this.$api.request.app.getList().then((appRes) => {
        if (appRes) {
          const appData = appRes.data
          for (let i = 0; i < appData.length; i++) {
            const item = appData[i]
            item.isApp = true
            item.appId = item.id
            item.name = item.appName
            item.label = item.appName
            item.children = []
          }
          this.$api.request.auth.getAllModuleFuncList().then((res) => {
            this.tree_loading = false
            if (res) {
              processTreeNode(res.data)
              for (const item of res.data) {
                item.parentId = item.appId
                for (const root of appData) {
                  if (root.id === item.appId) {
                    root.children.push(item)
                  }
                }
              }
              this.moduleFuncTreeData = appData
              this.moduleFuncTreeFilterText = ''
              if (typeof callBackFun === 'function') {
                callBackFun()
              }
            }
          }).catch(() => {
            this.tree_loading = false
          })
        }
      }).catch(() => {
        this.tree_loading = false
      })
    },
    clearMenuCurrObj(currMenuId) {
      if (!currMenuId || (currMenuId && currMenuId === this.currMenu.id)) {
        this.menuEditFormModel = {
          id: '',
          appId: '',
          name: '',
          iconType: '',
          path: '',
          enabled: true,
          openType: 0,
          menuParentArray: [],
          parentId: '',
          sort: 0,
          roleIds: []
        }
        this.currMenu = {
          id: '',
          appId: '',
          name: '',
          iconType: '',
          path: '',
          enabled: true,
          openType: 0,
          parentId: '',
          sort: 0,
          roleIds: []
        }
        this.currMenuData = {}
      }
    },
    clearModuleFuncCurrObj(currModuleFuncId) {
      if (!currModuleFuncId || (currModuleFuncId && currModuleFuncId === this.currModuleFunc.id)) {
        this.moduleFuncEditFormModel = {
          id: '',
          appId: '',
          name: '',
          code: '',
          moduleFuncParentArray: [],
          parentId: '',
          roleIds: []
        }
        this.currModuleFunc = {
          id: '',
          appId: '',
          name: '',
          code: '',
          parentId: '',
          roleIds: []
        }
        this.currModuleFuncData = {}
      }
    },
    appendMenu(data) {
      this.tree_loading = true
      this.$api.request.auth.createMenu({
        appId: data.appId,
        name: this.$i18n.t('forms.new') + this.$i18n.t('forms.menu'),
        iconType: 'caret-right',
        path: '/',
        parentId: data.id,
        enabled: false,
        openType: 0,
        sort: data.children.length + 1
      }).then((res) => {
        this.tree_loading = false
        if (res) {
          this.$message.success(this.$i18n.t('messages.createSuccess') + '')
          const children = data.children || []
          processTreeNode([res.data])
          children.push(res.data)
          sortTreeNodes(children)
          this.menuClick(res.data)
          this.$set(data, 'children', children)
        }
      }).catch(() => {
        this.tree_loading = false
      })
    },
    appendModuleFunc(data) {
      this.tree_loading = true
      this.$api.request.auth.createModuleFunc({
        appId: data.appId,
        name: this.$i18n.t('forms.new') + this.$i18n.t('forms.moduleFunc'),
        code: 'other',
        parentId: data.id
      }).then((res) => {
        this.tree_loading = false
        if (res) {
          this.$message.success(this.$i18n.t('messages.createSuccess') + '')
          const children = data.children || []
          processTreeNode([res.data])
          children.push(res.data)
          sortTreeNodes(children, 'code')
          this.moduleFuncClick(res.data)
          this.$set(data, 'children', children)
        }
      }).catch(() => {
        this.tree_loading = false
      })
    },
    removeMenu(node, data) {
      if (!data.covert) {
        this.$alert(this.$i18n.t('messages.tableDataCannotDel') + ': ' + getTreeFullPathTitle(this.menuTreeData, data.id),
          this.$i18n.t('dialog.error') + '', {
            type: 'error',
            callback: () => {
            }
          })
        return
      }
      this.$confirm(this.$i18n.t('messages.deleteDataConfirm') + ': ' + getTreeFullPathTitle(this.menuTreeData, data.id),
        this.$i18n.t('dialog.confirm') + '', {
          type: 'warning'
        }).then(() => {
        this.tree_loading = true
        this.$api.request.auth.deleteMenu([data.id]).then((res) => {
          this.tree_loading = false
          if (res) {
            this.$message.success(this.$i18n.t('messages.deleteSuccess') + '')
            this.clearMenuCurrObj(data.id)
            const parent = node.parent
            const children = parent.data.children
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
          }
        }).catch(() => {
          this.tree_loading = false
        })
      }).catch(() => {
      })
    },
    removeModuleFunc(node, data) {
      if (!data.covert) {
        this.$alert(this.$i18n.t('messages.tableDataCannotDel') + ': ' + getTreeFullPathTitle(this.moduleFuncTreeData, data.id),
          this.$i18n.t('dialog.error') + '', {
            type: 'error',
            callback: () => {
            }
          })
        return
      }
      this.$confirm(this.$i18n.t('messages.deleteDataConfirm') + ': ' + getTreeFullPathTitle(this.moduleFuncTreeData, data.id),
        this.$i18n.t('dialog.confirm') + '', {
          type: 'warning'
        }).then(() => {
        this.tree_loading = true
        this.$api.request.auth.deleteModuleFunc([data.id]).then((res) => {
          this.tree_loading = false
          if (res) {
            this.$message.success(this.$i18n.t('messages.deleteSuccess') + '')
            this.clearModuleFuncCurrObj(data.id)
            const parent = node.parent
            const children = parent.data.children
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
          }
        }).catch(() => {
          this.tree_loading = false
        })
      }).catch(() => {
      })
    },
    menuClick(data) {
      this.tree_loading = true
      this.$api.request.auth.getMenuInfo(data.id).then((res) => {
        this.tree_loading = false
        if (res) {
          this.currMenuData = data
          this.currMenuData.roleIds = res.data.roleIds
          this.currMenu = {
            id: this.currMenuData.id,
            appId: this.currMenuData.appId,
            name: this.currMenuData.name,
            iconType: this.currMenuData.iconType,
            path: this.currMenuData.path,
            enabled: this.currMenuData.enabled,
            openType: this.currMenuData.openType,
            parentId: this.currMenuData.parentId,
            sort: this.currMenuData.sort,
            roleIds: this.currMenuData.roleIds
          }
          this.doResetMenu()
        }
      }).catch(() => {
        this.tree_loading = false
      })
    },
    moduleFuncClick(data) {
      this.tree_loading = true
      this.$api.request.auth.getModuleFuncInfo(data.id).then((res) => {
        this.tree_loading = false
        if (res) {
          this.currModuleFuncData = data
          this.currModuleFuncData.roleIds = res.data.roleIds
          this.currModuleFunc = {
            id: this.currModuleFuncData.id,
            appId: this.currModuleFuncData.appId,
            name: this.currModuleFuncData.name,
            code: this.currModuleFuncData.code,
            parentId: this.currModuleFuncData.parentId,
            roleIds: this.currModuleFuncData.roleIds
          }
          this.doResetModuleFunc()
        }
      }).catch(() => {
        this.tree_loading = false
      })
    },
    doSaveMenu() {
      this.menuEditForm.validate((valid) => {
        if (valid) {
          this.tree_loading = true
          this.$api.request.auth.doUpdateMenu({
            id: this.menuEditFormModel.id,
            appId: this.menuEditFormModel.appId,
            name: this.menuEditFormModel.name,
            iconType: this.menuEditFormModel.iconType,
            path: this.menuEditFormModel.path,
            parentId: this.menuEditFormModel.parentId,
            enabled: this.menuEditFormModel.enabled,
            openType: this.menuEditFormModel.openType,
            sort: this.menuEditFormModel.sort,
            roleIds: this.menuEditFormModel.roleIds
          }).then((res) => {
            this.tree_loading = false
            if (res) {
              this.reloadMenuRoleList()
              this.$message.success(this.$i18n.t('messages.saveSuccess') + '')
              this.currMenuData.name = this.menuEditFormModel.name
              this.currMenuData.label = this.menuEditFormModel.name
              this.currMenuData.iconType = this.menuEditFormModel.iconType
              this.currMenuData.path = this.menuEditFormModel.path
              this.currMenuData.parentId = this.menuEditFormModel.parentId
              this.currMenuData.enabled = this.menuEditFormModel.enabled
              this.currMenuData.openType = this.menuEditFormModel.openType
              this.currMenuData.sort = this.menuEditFormModel.sort
              this.currMenuData.roleIds = this.menuEditFormModel.roleIds
              this.currMenu = {
                id: this.menuEditFormModel.id,
                appId: this.menuEditFormModel.appId,
                name: this.menuEditFormModel.name,
                iconType: this.menuEditFormModel.iconType,
                path: this.menuEditFormModel.path,
                parentId: this.menuEditFormModel.parentId,
                enabled: this.menuEditFormModel.enabled,
                openType: this.menuEditFormModel.openType,
                sort: this.menuEditFormModel.sort,
                roleIds: this.menuEditFormModel.roleIds
              }
              this.refreshMenuTree(false, (() => {
                this.currMenuFullPath = getTreeFullPathTitle(this.menuTreeData, this.currMenu.id)
                nextTick(() => {
                  this.menuName.focus()
                })
              }))
            }
          }).catch(() => {
            this.tree_loading = false
          })
        }
      })
    },
    doSaveModuleFunc() {
      this.moduleFuncEditForm.validate((valid) => {
        if (valid) {
          this.tree_loading = true
          this.$api.request.auth.doUpdateModuleFunc({
            id: this.moduleFuncEditFormModel.id,
            appId: this.moduleFuncEditFormModel.appId,
            name: this.moduleFuncEditFormModel.name,
            code: this.moduleFuncEditFormModel.code,
            parentId: this.moduleFuncEditFormModel.parentId,
            roleIds: this.moduleFuncEditFormModel.roleIds
          }).then((res) => {
            this.tree_loading = false
            if (res) {
              this.reloadModuleFuncRoleList()
              this.$message.success(this.$i18n.t('messages.saveSuccess') + '')
              this.currModuleFuncData.name = this.moduleFuncEditFormModel.name
              this.currModuleFuncData.label = this.moduleFuncEditFormModel.code !== '' ? this.moduleFuncEditFormModel.name + '(' + this.moduleFuncEditFormModel.code + ')' : this.moduleFuncEditFormModel.name
              this.currModuleFuncData.code = this.moduleFuncEditFormModel.code
              this.currModuleFuncData.parentId = this.moduleFuncEditFormModel.parentId
              this.currModuleFuncData.roleIds = this.moduleFuncEditFormModel.roleIds
              this.currModuleFunc = {
                id: this.moduleFuncEditFormModel.id,
                appId: this.moduleFuncEditFormModel.appId,
                name: this.moduleFuncEditFormModel.name,
                code: this.moduleFuncEditFormModel.code,
                parentId: this.moduleFuncEditFormModel.parentId,
                roleIds: this.moduleFuncEditFormModel.roleIds
              }
              this.refreshModuleFuncTree(false, (() => {
                this.currModuleFuncFullPath = getTreeFullPathTitle(this.moduleFuncTreeData, this.currModuleFunc.id)
                nextTick(() => {
                  this.moduleFuncName.focus()
                })
              }))
            }
          }).catch(() => {
            this.tree_loading = false
          })
        }
      })
    },
    doResetMenu() {
      this.menuEditForm.resetFields()
      this.menuEditFormModel = {
        id: this.currMenu.id,
        appId: this.currMenu.appId,
        name: this.currMenu.name,
        iconType: this.currMenu.iconType,
        path: this.currMenu.path,
        enabled: this.currMenu.enabled,
        openType: this.currMenu.openType,
        menuParentArray: getTreeFullPathArray(this.menuTreeData, this.currMenu.parentId).map(item => item.id),
        parentId: this.currMenu.parentId,
        sort: this.currMenu.sort,
        roleIds: this.currMenu.roleIds
      }
      this.reloadMenuRoleList()
      this.currMenuFullPath = getTreeFullPathTitle(this.menuTreeData, this.currMenu.id)
    },
    doResetModuleFunc() {
      this.moduleFuncEditForm.resetFields()
      this.moduleFuncEditFormModel = {
        id: this.currModuleFunc.id,
        appId: this.currModuleFunc.appId,
        name: this.currModuleFunc.name,
        code: this.currModuleFunc.code,
        moduleFuncParentArray: getTreeFullPathArray(this.moduleFuncTreeData, this.currModuleFunc.parentId).map(item => item.id),
        parentId: this.currModuleFunc.parentId,
        roleIds: this.currModuleFunc.roleIds
      }
      this.reloadModuleFuncRoleList()
      this.currModuleFuncFullPath = getTreeFullPathTitle(this.moduleFuncTreeData, this.currModuleFunc.id)
    },
    handleMenuRoleListChange(newTargetKeys) {
      this.menuEditFormModel.roleIds = newTargetKeys
    },
    handleModuleFuncRoleListChange(newTargetKeys) {
      this.moduleFuncEditFormModel.roleIds = newTargetKeys
    }
  },
  mounted() {
    this.refreshMenuTree()
    this.refreshModuleFuncTree()
    this.refreshModuleFuncCodeList()
  },
  setup() {
    const menuName = ref(null)
    const menuTree = ref(null)
    const menuEditForm = ref(null)
    const moduleFuncName = ref(null)
    const moduleFuncTree = ref(null)
    const moduleFuncEditForm = ref(null)
    return {menuName, menuTree, menuEditForm, moduleFuncName, moduleFuncTree, moduleFuncEditForm}
  }
}
</script>

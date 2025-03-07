<template>
  <el-card>
    <el-form ref="searchForm" :inline="true" :model="searchFormModel" label-width="undefined" size="small"
             @submit.native.prevent>
      <el-form-item :label="$t('forms.name')" prop="appName">
        <el-input v-model="searchFormModel.appName" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button-group>
          <el-button :loading="modal_loading" type="primary" @click="handleSearch">
            {{ $t('forms.buttons.search') }}
          </el-button>
          <el-button :loading="modal_loading" type="primary" @click="handleSearchReset">
            {{ $t('forms.buttons.reset') }}
          </el-button>
          <el-button :loading="modal_loading" type="primary" @click="handleAdd">
            {{ $t('forms.buttons.add') }}
          </el-button>
          <el-button :loading="modal_loading" type="primary" @click="handleDeleteMore">
            {{ $t('forms.buttons.delete') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <el-table ref="table" v-loading="modal_loading" :data="searchData" :default-sort="searchFormModel.orderParam"
              :empty-text="$t('messages.tableNoData')"
              :height="tableHeight"
              border header-cell-class-name="query-table-header" size="small"
              @selection-change="handleSelect" @row-click="handleRowClick" @sort-change="handleSortChange">
      <el-table-column
        :selectable="selectableFun"
        align="center"
        fixed="left"
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        :label="'ID'"
        align="center"
        prop="id"
        width="250">
      </el-table-column>
      <el-table-column
        :label="$t('forms.name')"
        prop="appName"
        sortable="custom">
      </el-table-column>
      <el-table-column
        :label="$t('forms.accessTokenValiditySeconds')"
        prop="accessTokenValiditySeconds">
      </el-table-column>
      <el-table-column
        :label="$t('forms.refreshTokenValiditySeconds')"
        prop="refreshTokenValiditySeconds">
      </el-table-column>
      <el-table-column
        :label="$t('forms.identify')"
        prop="identify"
        sortable="custom">
      </el-table-column>
      <el-table-column
        :label="$t('forms.scope')"
        prop="scope">
      </el-table-column>
      <el-table-column
        :fixed="isMobile?false:'right'"
        :label="$t('forms.action')"
        align="center"
        prop="action"
        width="120">
        <template #default="scope">
          <el-button icon="el-icon-edit" type="text"
                     @click="handleEdit(scope.row,1)"></el-button>
          <el-button v-if="scope.row.secret!==$store.state.app.appInfo.appSecret" icon="el-icon-search"
                     type="text"
                     @click="handleEdit(scope.row,2,scope.$index)"></el-button>
          <el-button v-if="scope.row.covert" icon="el-icon-delete" type="text"
                     @click="handleDeleteRow(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="searchFormModel.currPage"
                   v-model:page-size="searchFormModel.pageSize"
                   :layout="isMobile?'prev, pager, next':'total, sizes, prev, pager, next, jumper'"
                   :page-sizes="searchFormModel.pageSizeArray"
                   :small="isMobile" :total="searchFormModel.totalRows"
                   @size-change="handlePageSizeSearch">
    </el-pagination>
    <el-dialog v-model="editModal" :close-on-click-modal="false" :fullscreen="isMobile" :title="$t('forms.info')">
      <el-form ref="editForm" v-loading="modal_loading" :model="editFormModel" :rules="ruleEditForm"
               label-width="undefined"
               size="small" style="padding-right: 25px;" @submit.native.prevent>
        <el-form-item v-if="action===2" :label="'appId:'" prop="id">
          <span style="color: green">{{ editFormModel.id }}</span>
        </el-form-item>
        <el-form-item v-if="action===2" :label="'secret:'" prop="secret">
          <span style="color: red">{{ editFormModel.secret }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.name')+':'" prop="appName">
          <el-input v-if="action!==2" ref="appName" v-model="editFormModel.appName" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                    @keyup.enter.native="doSave"/>
          <span v-else>{{ editFormModel.appName }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.identify')+':'" prop="identify">
          <el-input v-if="action!==2" v-model="editFormModel.identify" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.identify')"
                    @keyup.enter.native="doSave"/>
          <span v-else>{{ editFormModel.identify }}</span>
        </el-form-item>
        <el-form-item v-if="editFormModel.secret!==$store.state.app.appInfo.appSecret" :label="$t('forms.scope')+':'"
                      prop="scope">
          <el-input v-if="action!==2" v-model="editFormModel.scope" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.scope')" :rows="2"
                    type="textarea"/>
          <span v-else>{{ editFormModel.scope }}</span>
        </el-form-item>
        <el-form-item :label="$t('forms.accessTokenValiditySeconds')+':'" prop="accessTokenValiditySeconds">
          <el-input v-if="action!==2" v-model="editFormModel.accessTokenValiditySeconds" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.accessTokenValiditySeconds')"
                    @keyup.enter.native="doSave">
            <template #append>{{ $t('forms.seconds') }}</template>
          </el-input>
          <span v-else>{{ editFormModel.accessTokenValiditySeconds }}
            {{ $t('forms.seconds') }}
          </span>
        </el-form-item>
        <el-form-item :label="$t('forms.refreshTokenValiditySeconds')+':'" prop="refreshTokenValiditySeconds">
          <el-input v-if="action!==2" v-model="editFormModel.refreshTokenValiditySeconds" :disabled="modal_loading"
                    :placeholder="$t('forms.pleaseEnter') + $t('forms.refreshTokenValiditySeconds')"
                    @keyup.enter.native="doSave">
            <template #append>{{ $t('forms.seconds') }}</template>
          </el-input>
          <span v-else>{{ editFormModel.refreshTokenValiditySeconds }}
            {{ $t('forms.seconds') }}
          </span>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button :loading="modal_loading" type="info" @click="doCancel">
            {{ $t('forms.buttons.cancel') }}
          </el-button>
          <el-button v-if="action===0||action===1" :loading="modal_loading" type="primary"
                     @click="doSave">
            {{ $t('forms.buttons.submit') }}
          </el-button>
          <el-button v-else :loading="modal_loading" type="primary"
                     @click="doSave">
            {{ $t('forms.buttons.updateSecret') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>
<script>
import {nextTick, ref} from "vue";
import {isMobileDevice} from "@/libs/tools";

export default {
  name: 'appConfig',
  data() {
    return {
      searchFormModel: {
        appName: '',
        orderParam: {
          prop: 'identify',
          order: 'ascending'
        },
        currPage: 1,
        totalRows: 0,
        pageSize: 10,
        pageSizeArray: [10, 20, 30, 40]
      },
      editFormModel: {
        id: '',
        appName: '',
        scope: '',
        identify: '',
        accessTokenValiditySeconds: '',
        refreshTokenValiditySeconds: '',
        secret: '',
        index: -1
      },
      editModal: false,
      action: 0, // 0-add, 1-update, 2-view
      modal_loading: false,
      searchData: [],
      selectedData: []
    }
  },
  watch: {
    editModal(value) {
      if (value) {
        nextTick(() => {
          if (this.action !== 2) {
            this.appName.focus()
          }
        })
      }
    },
    'searchFormModel.currPage'() {
      this.handleSearch()
    }
  },
  computed: {
    isMobile() {
      return isMobileDevice()
    },
    tableHeight() {
      const minHeight = 300
      const height = this.$store.state.app.mainHeight - 80 - 46 - 42 - 4
      if (height < minHeight) {
        return minHeight - 2
      } else {
        return height
      }
    },
    ruleEditForm() {
      return {
        appName: [{
          required: true,
          message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }],
        accessTokenValiditySeconds: [{
          required: true,
          message: this.$i18n.t('forms.accessTokenValiditySeconds') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^[0-9]*$/,
          message: this.$i18n.t('forms.accessTokenValiditySeconds') + this.$i18n.t('forms.incorrect'),
          trigger: 'blur'
        }],
        refreshTokenValiditySeconds: [{
          required: true,
          message: this.$i18n.t('forms.accessTokenValiditySeconds') + this.$i18n.t('forms.notEmpty'),
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^[0-9]*$/,
          message: this.$i18n.t('forms.accessTokenValiditySeconds') + this.$i18n.t('forms.incorrect'),
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    selectableFun(row) {
      return !row._disabled
    },
    handleAdd() {
      this.editModal = true
      nextTick(() => {
        this.editForm.resetFields()
        this.editFormModel.id = ''
        this.editFormModel.appName = ''
        this.editFormModel.scope = ''
        this.editFormModel.identify = ''
        this.editFormModel.accessTokenValiditySeconds = ''
        this.editFormModel.refreshTokenValiditySeconds = ''
        this.editFormModel.secret = ''
        this.editFormModel.index = -1
        this.action = 0
      })
    },
    doCancel() {
      this.editModal = false
    },
    doSave() {
      switch (this.action) {
        case 0: // 新增
          this.editForm.validate((valid) => {
            if (valid) {
              this.modal_loading = true
              this.$api.request.app.create({
                appName: this.editFormModel.appName,
                scope: this.editFormModel.scope,
                identify: this.editFormModel.identify,
                accessTokenValiditySeconds: Number(this.editFormModel.accessTokenValiditySeconds),
                refreshTokenValiditySeconds: Number(this.editFormModel.refreshTokenValiditySeconds)
              }).then((res) => {
                this.modal_loading = false
                if (res) {
                  this.$message.success(this.$i18n.t('messages.saveSuccess') + '')
                  this.editModal = false
                  this.handleSearch()
                }
              }).catch(() => {
                this.modal_loading = false
              })
            }
          })
          break
        case 1: // 更新
          this.editForm.validate((valid) => {
            if (valid) {
              this.modal_loading = true
              this.$api.request.app.update({
                id: this.editFormModel.id,
                appName: this.editFormModel.appName,
                scope: this.editFormModel.scope,
                identify: this.editFormModel.identify,
                accessTokenValiditySeconds: Number(this.editFormModel.accessTokenValiditySeconds),
                refreshTokenValiditySeconds: Number(this.editFormModel.refreshTokenValiditySeconds)
              }).then((res) => {
                this.modal_loading = false
                if (res) {
                  this.$message.success(this.$i18n.t('messages.updateSuccess') + '')
                  this.editModal = false
                  this.handleSearch()
                }
              }).catch(() => {
                this.modal_loading = false
              })
            }
          })
          break
        case 2:
          this.modal_loading = true
          this.$api.request.app.getNewSecret(this.editFormModel.id).then((res) => {
            this.modal_loading = false
            this.$message.success(this.$i18n.t('messages.updateSuccess') + '')
            this.editFormModel.secret = res.data.secret
            this.searchData[this.editFormModel.index].secret = res.data.secret
          }).catch(() => {
            this.modal_loading = false
          })
          break
      }
    },
    handleDelete(rowIds) {
      this.modal_loading = true
      this.$api.request.app.delete(rowIds).then((res) => {
        this.modal_loading = false
        if (res) {
          this.$message.success(this.$i18n.t('messages.deleteSuccess') + '')
          this.handleSearch()
        }
      }).catch(() => {
        this.modal_loading = false
      })
    },
    handlePageSizeSearch(size) {
      this.searchFormModel.pageSize = size
      this.handleSearch()
    },
    handleSearch() {
      let searchParam = {
        appName: this.searchFormModel.appName,
        queryParam: {
          currPage: this.searchFormModel.currPage,
          pageSize: this.searchFormModel.pageSize
        }
      }
      if (this.searchFormModel.orderParam.order !== 'normal') {
        searchParam.queryParam.orderName = this.searchFormModel.orderParam.prop
        searchParam.queryParam.orderCommand = this.searchFormModel.orderParam.order
      }
      this.modal_loading = true
      this.$api.request.app.query(searchParam).then((res) => {
        this.modal_loading = false
        if (res) {
          this.selectedData = []
          this.searchFormModel.totalRows = res.data.totalElements
          this.searchData = res.data.content.map(item => {
            if (!item.covert) {
              item._disabled = true
            }
            return item
          })
          nextTick(() => {
            this.table.doLayout()
          })
        }
      }).catch(() => {
        this.searchData = []
        this.selectedData = []
        this.modal_loading = false
      })
    },
    handleSortChange(param) {
      this.searchFormModel.orderParam.prop = param.prop
      this.searchFormModel.orderParam.order = param.order
      this.handleSearch()
    },
    handleRowClick(row) {
      if (!row._disabled) {
        this.table.toggleRowSelection(row)
      }
    },
    handleSearchReset() {
      this.searchForm.resetFields()
    },
    handleSelect(selection) {
      this.selectedData = selection
    },
    handleDeleteRow(row) {
      if (!row.covert) {
        this.$alert(this.$i18n.t('messages.tableDataCannotDel') + '', this.$i18n.t('dialog.error') + '', {
          type: 'error',
          callback: () => {
          }
        })
      } else {
        this.$confirm(this.$i18n.t('messages.deleteDataConfirm') + '', this.$i18n.t('dialog.confirm') + '', {
          type: 'warning'
        }).then(() => {
          this.handleDelete([row.id])
        }).catch(() => {
        })
      }
    },
    handleDeleteMore() {
      if (this.selectedData.length > 0) {
        this.$confirm(this.$i18n.t('messages.deleteDataConfirm') + '', this.$i18n.t('dialog.confirm') + '', {
          type: 'warning'
        }).then(() => {
          this.handleDelete(this.selectedData.map(item => item.id))
        }).catch(() => {
        })
      } else {
        this.$alert(this.$i18n.t('messages.selectDataForDelete') + '', this.$i18n.t('dialog.info') + '', {
          type: 'error',
          callback: () => {
          }
        })
      }
    },
    handleEdit(row, action, index) {
      this.editModal = true
      nextTick(() => {
        this.editForm.resetFields()
        this.editFormModel.id = row.id
        this.editFormModel.appName = row.appName
        this.editFormModel.accessTokenValiditySeconds = row.accessTokenValiditySeconds + ''
        this.editFormModel.refreshTokenValiditySeconds = row.refreshTokenValiditySeconds + ''
        this.editFormModel.secret = row.secret
        this.editFormModel.scope = row.scope
        this.editFormModel.identify = row.identify
        this.editFormModel.index = index
        this.action = action
      })
    }
  },
  mounted() {
    this.handleSearch()
  },
  activated() {
    nextTick(() => {
      this.table.doLayout()
    })
  },
  setup() {
    const searchForm = ref(null)
    const editForm = ref(null)
    const table = ref(null)
    const appName = ref(null)
    return {searchForm, editForm, table, appName}
  }
}
</script>

<template>
  <div class="index">
    <el-card shadow="always">
      <template #header>{{ $t('forms.numberOfOnlineUsers') }}</template>
      <el-row :gutter="8" style="margin-top: -8px">
        <el-col v-for="(item,index) in onlineMessage" :key="index" :lg='{span:6}'
                style="padding: 0;margin-top: 8px">
          <el-card shadow="hover" style="margin: 0 8px">
            <el-row>
              <el-col :span="8">
                <el-icon color="#67c23a" size="55px">
                  <el-icon-odometer/>
                </el-icon>
              </el-col>
              <el-col :span="16">
                <div style="color: #9ea7b4;">{{ item.appName }}</div>
                <count-to :autoplay="true"
                          :duration="2000"
                          :end-val="item.count"
                          :prefix="''"
                          :separator="','"
                          :start-val="0"
                          :suffix="''"
                          style="font-size: 30px;color: #409EFF"/>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import countTo from '@/plugins/vue-count-to'

export default {
  name: 'index',
  components: {countTo},
  data() {
    return {
      onlineInfo: []
    }
  },
  computed: {
    onlineMessage() {
      return this.onlineInfo
    }
  },
  methods: {},
  mounted() {
    this.$api.request.auth.getOnlineInfo().then(res => {
      if (res.data) {
        this.onlineInfo = res.data
      }
    })
  }
}
</script>

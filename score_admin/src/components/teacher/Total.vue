<template>
  <div style="display: flex">
    <div>
      <div style="display: flex">
        <el-card style="width: 200px">
          <el-select @change="selectChange" v-model="CourseValue" placeholder="请选择" size="small">
            <el-option v-for="item in className" :key="item.id" :value="item.id" :label="item.name"> </el-option>
          </el-select>
        </el-card>
        <el-card style="width: 320px; margin-left: 20px">
          <div style="width: 400px; display: flex; flex-direction: row">
            <div style="font-size: 13px; margin-top: 9px">平时成绩占比</div>
            <el-slider style="width: 200px; margin-left: 15px" @change="ordinaryProportionChange" v-model="ordinaryScoreProportion" :step="0.1" :max="1"> </el-slider>
          </div>
        </el-card>
      </div>

      <el-card style="width: 540px; height: 300px; margin-top: 20px">
        <div id="myChart" style="width: 500px; height: 300px"></div>
      </el-card>
    </div>
    <div style="width: 100%; margin-left: 20px">
      <el-card style="width: 100%; height: 400px">
        <div id="barGraph" style="width: 100%; height: 380px"></div>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: '',
      //平时成绩占比
      ordinaryScoreProportion: null,
      //课程id
      CourseValue: 1,
      className: [],
      classQuery: {
        token: '',
        teacherId: '',
        year: '',
        term: '',
      },
      //不及格人数数组
      fail: [],
      //成绩90以上
      ninety: [],
    }
  },
  methods: {
    // 获取所带班级
    async getClass() {
      const { data: res } = await this.$http.post('api/teacher/course', this.qs.stringify(this.classQuery))
      this.className = res.data.courses
    },
    //获取平时成绩占比
    async getOrdinary() {
      const { data: res } = await this.$http.post(
        'api/teacher/proportion/get',
        this.qs.stringify({
          courseId: this.CourseValue,
          teacherId: this.userInfo.data.info.teacherId,
          token: this.token,
        })
      )
      console.log(res)
      this.ordinaryScoreProportion = res.data.normalProportion
    },
    //选中课程改变时触发
    selectChange() {
      this.getOrdinary()
      this.drawLine()
      this.drawBarGraph()
    },
    // 柱状图
    async drawBarGraph() {
      const { data: res } = await this.$http.post(
        'api/teacher/distribute',
        this.qs.stringify({
          courseId: this.CourseValue,
          teacherId: this.userInfo.data.info.teacherId,
          token: this.token,
        })
      )
      var xData = []
      res.data.map((item) => {
        xData.push(item.studentName)
      })
      console.log(xData)
      var yData = []
      res.data.map((item) => {
        yData.push(item.score)
      })
      console.log(yData)

      var BarGraph = this.$echarts.init(document.getElementById('barGraph'))
      // 绘制图表
      BarGraph.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '最终成绩',
            type: 'bar',
            barWidth: '60%',
            data: yData,
          },
        ],
      })
    },
    // 饼图
    async drawLine() {
      //获取不及格人数
      const { data: res } = await this.$http.post(
        'api/teacher/fail',
        this.qs.stringify({
          courseId: this.CourseValue,
          teacherId: this.userInfo.data.info.teacherId,
          token: this.token,
        })
      )
      this.fail = res.data
      // 获取成绩分布
      const { data: result } = await this.$http.post(
        'api/teacher/distribute',
        this.qs.stringify({
          courseId: this.CourseValue,
          teacherId: this.userInfo.data.info.teacherId,
          token: this.token,
        })
      )
      result.data.map((item) => {
        if (item.score >= 90) {
          this.ninety.push(item)
        }
      })

      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '不及格人数占比',
          // subtext: 'Fake Data',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '考试成绩',
            type: 'pie',
            radius: '50%',
            data: [
              { value: this.fail.length, name: '不及格人数' },
              { value: this.ninety.length, name: '90分以上' },
              { value: result.data.length - this.fail.length - this.ninety.length, name: '其他' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      })
    },
    // 平时成绩改变触发
    async ordinaryProportionChange() {
      await this.$http.post(
        '/api/teacher/proportion/update',
        this.qs.stringify({
          token: this.token,
          courseId: this.CourseValue,
          normalProportion: this.ordinaryScoreProportion,
          examProportion: 1 - this.ordinaryScoreProportion,
          teacherId: this.userInfo.data.info.teacherId,
        })
      )
    },
    //获取最高分最低分
    async getAverageScore() {
      const { data: res } = await this.$http.post(
        'api/teacher/extreme',
        this.qs.stringify({
          courseId: this.CourseValue,
          teacherId: this.userInfo.data.info.teacherId,
          token: this.token,
        })
      )
      console.log(res)
    },
    // 获取不及格人数
    async getFail() {
      const { data: res } = await this.$http.post(
        'api/teacher/fail',
        this.qs.stringify({
          courseId: this.CourseValue,
          teacherId: this.userInfo.data.info.teacherId,
          token: this.token,
        })
      )
      this.fail = res.data
      console.log(this.fail.length)
    },

    //班级成绩分布
    async getDistribute() {
      const { data: res } = await this.$http.post(
        'api/teacher/distribute',
        this.qs.stringify({
          courseId: this.CourseValue,
          teacherId: this.userInfo.data.info.teacherId,
          token: this.token,
        })
      )
      console.log(res)
    },
  },
  mounted() {
    this.drawLine()
    this.drawBarGraph()
  },
  created() {
    this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    this.classQuery.token = this.token
    this.classQuery.teacherId = this.userInfo.data.info.teacherId
    this.getClass()
    this.getOrdinary()
  },
  computed: {
    token() {
      return window.sessionStorage.getItem('token')
    },
  },
}
</script>
<style>
.ordinary {
  width: 320px;
  padding: 15px !important;
}
</style>
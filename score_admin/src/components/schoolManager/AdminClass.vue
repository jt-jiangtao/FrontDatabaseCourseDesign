<template>
  <div>
    <el-card>
      <div style="display: flex">
        <div style="width: 160px">
          <el-select @change="updateSpecialty" width="200px" v-model="specialtyId" placeholder="请选择专业" size="small">
            <el-option v-for="item in specialtyInfo" :key="item.specialtyId" :value="item.specialtyId" :label="item.specialtyName"> </el-option>
          </el-select>
        </div>
        <div style="width: 120px; margin-left: 20px">
          <el-select @change="classChange" v-model="classId" placeholder="请选择班级" size="small">
            <el-option v-for="item in classInfo" :key="item.classId" :value="item.classId" :label="item.number + '班'"> </el-option>
          </el-select>
        </div>
      </div>
    </el-card>

    <div style="display: flex">
      <el-card style="width: 540px; height: 400px; margin-top: 15px">
        <div id="myChart" style="width: 500px; height: 400px"></div>
      </el-card>
      <el-card style="width: 720px; height: 400px; margin-top: 15px; margin-left: 20px">
        <div id="gpa" style="width: 750px; height: 400px"></div>
      </el-card>
    </div>
    <el-card style="width: 100%; height: 400px; margin-top: 20px">
      <div id="score" style="width: 100%; height: 400px"></div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: '',
      specialtyId: 1,
      specialtyInfo: [],
      classInfo: [],
      classId: 4,
      scoreQuery: {
        deptId: '',
        specialtyId: '',
        year: '',
        term: '',
        all: '',
        grade: '',
        classId: '',
      },
      scoreInfo: [],
    }
  },
  methods: {
    classChange() {
      this.drawFailMap()
      console.log(this.classId)
    },
    //   专业信息
    async getspecialtyInfo() {
      const { data: res } = await this.$http.post(
        'api/dept/specialty',
        this.qs.stringify({
          token: this.token,
          deptId: this.userInfo.data.info.deptId,
        })
      )
      this.specialtyInfo = res.data
    },
    // 班级信息
    async getClassInfo() {
      const { data: res } = await this.$http.post(
        'api/dept/class',
        this.qs.stringify({
          token: this.token,
          deptId: this.userInfo.data.info.deptId,
          specialtyId: this.specialtyId,
        })
      )
      this.classInfo = res.data
      console.log(this.classId)
    },
    //成绩分布
    async getScoreDistribute() {
      const { data: res } = await this.$http.post(
        'api/dept/distribute',
        this.qs.stringify({
          token: this.token,
          deptId: this.userInfo.data.info.deptId,
          specialtyId: this.specialtyId,
          classId: this.classId,
        })
      )
      console.log(res)
      this.scoreInfo = res.data
      this.courses = res.data[1].courses
      console.log(this.courses)
    },
    updateSpecialty() {
      this.getClassInfo()
      //   this.classId = this.classId
      //   console.log(this.classId)
    },
    // 不及格人数饼状图
    async drawFailMap() {
      //获取不及格人数
      const { data: res } = await this.$http.post(
        'api/dept/fail',
        this.qs.stringify({
          deptId: this.userInfo.data.info.deptId,
          specialtyId: this.specialtyId,
          classId: this.classId,
          token: this.token,
        })
      )
      var data = []
      var dataObj = {}
      console.log(res)
      res.data.map((item) => {
        for (var i = 0; i < item.courses.length; i++) {
          dataObj.value = item.courses[i].score
          dataObj.name = item.name + ' ' + item.courses[i].courseName
          data.push(dataObj)
        }
      })
      console.log(data)
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '挂科学生信息',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          top: 20,
          bottom: 20,
          left: 400,
          data: res.data.name,
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: data,
          },
        ],
      })
    },
    //绩点折线图
    async drawGrapeMap() {
      const { data: res } = await this.$http.post(
        'api/dept/distribute',
        this.qs.stringify({
          token: this.token,
          deptId: this.userInfo.data.info.deptId,
          specialtyId: this.specialtyId,
          classId: this.classId,
        })
      )
      console.log(res)
      this.scoreInfo = res.data
      var nameData = []
      var pgaData = []
      res.data.map((item) => {
        nameData.push(item.name)
        pgaData.push(item.scorePoint)
      })

      let myChart = this.$echarts.init(document.getElementById('gpa'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '学生绩点信息',
          left: 'center',
        },
        xAxis: {
          type: 'category',
          data: nameData,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: pgaData,
            type: 'line',
            label: {
              show: true,
              position: 'bottom',
              textStyle: {
                fontSize: 12,
              },
            },
          },
        ],
      })
    },
    //每个课程的分数
    async scoreMap() {
      const { data: res } = await this.$http.post(
        'api/dept/distribute',
        this.qs.stringify({
          token: this.token,
          deptId: this.userInfo.data.info.deptId,
          specialtyId: this.specialtyId,
          classId: this.classId,
        })
      )
      console.log(res)
      const { data: result } = await this.$http.post(
        'api/dept/courses',
        this.qs.stringify({
          deptId: this.userInfo.data.info.deptId,
          token: this.token,
          specialtyId: this.specialtyId,
        })
      )
      console.log(result)
      var courses = []
      courses.push('product')
      result.data.map((item) => {
        courses.push(item.courseName)
      })

      console.log(courses)
      // var courseData = []
      // res.data.map((item) => {
      //   // for (var i = 0; i < item.courses.length; i++) {

      //   // }
      //   courseData.push('product')
      // })
      let myChart = this.$echarts.init(document.getElementById('score'))
      // 绘制图表
      myChart.setOption({
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: courses,
          source: [
            { product: res.data[0].name, 数据库: 0, 软件工程导论: 0, c: 0, java: 0 },
            { product: res.data[1].name, 数据库: res.data[1].courses[0], 软件工程导论: res.data[1].courses[0].score, c: res.data[1].courses[1].score, java: res.data[1].courses[2].score },
            // { product: res.data[2].name, 数据库: 43.3, 软件工程导论: 85.8, c: 93.7, java: 33 },
            // { product: res.data[3].name, 数据库: 43.3, 软件工程导论: 85.8, c: 93.7, java: 33 },
            // { product: res.data[4].name, 数据库: 43.3, 软件工程导论: 85.8, c: 93.7, java: 33 },
            // { product: res.data[5].name, 数据库: 43.3, 软件工程导论: 85.8, c: 93.7, java: 33 },
          ],
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
      })
    },
  },
  created() {
    this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    this.scoreQuery.deptId = this.userInfo.data.info.deptId
    this.scoreQuery.specialtyId = this.specialtyId
    this.scoreQuery.classId = this.classId
    this.getspecialtyInfo()
    this.getClassInfo()
    this.scoreMap()
    this.drawGrapeMap()
    this.drawFailMap()
  },
  computed: {
    token() {
      return window.sessionStorage.getItem('token')
    },
  },
}
</script>
<style scoped>
</style>
<template>
  <el-container id="zhihu-answer-container" :v-loading="isLoading">
    <el-input type="textarea" v-model="metaData.txt" placeholder="请将答案在此复制输入" :autosize="{minRows: 15}">
    </el-input>
    <el-container id="label-container">
      <el-container>
        <p>请输入提取词数</p>
        <el-input placeholder="请输入关键词个数" type="number" v-model="metaData.keyword_count">
          <template slot="prepend">关键词数</template>
        </el-input>
        <el-button type="primary" @click.native="confirmInput">确认</el-button>
      </el-container>
    </el-container>
    <el-container id="chart-container">
      <template v-for="(chartOption, index) in chartOptions">
        <el-container :key="index">
          <vue-echarts :options="chartOption.options" style="width: 750px; height: 500px"
                       @click="chartClick"></vue-echarts>
          <div class="chart-sidebar">
            <el-input type="string" v-model="chartOption.options.title.text">
              <template slot="prepend">图表名</template>
            </el-input>
            <p>请选择图表类型</p>
            <el-select v-model="chartOption.type" placeholder="请选择" :disabled="!chartOption.convert"
                       @change="convertTopicChart(chartOption)">
              <el-option v-for="option in SELECT_CHART_OPTIONS" :key="option.value" :label="option.label"
                         :value="option.value"></el-option>
            </el-select>
            <el-button type="danger" @click.native="deleteChart(index)">删除</el-button>
          </div>
        </el-container>

        <el-container class="el-container-sidebar" :key="index + '-1'">
          <template v-if="chartOption.dataType === 'topic'">
            <div class="topic-intro" v-for="topic in chartOption.topics" :key="topic.id">
              <p @click="imgClick(topic.avatar_url)">
                {{topic.name}}
                <i class="el-icon-picture"></i>
              </p>
              <p @click="parseTopicDialog(topic)">{{topic.introduction}}</p>
            </div>
          </template>
        </el-container>
        <el-container v-if="chartOption.dataType === 'topic' && chartOption.users.length > 0"
                      class="el-container-sidebar" :key="index + '-2'">
          <template v-for="user in chartOption.users">
            <vue-echarts :key="user.id + '-' + index" :options="user.options" style="width: 300px; height: 300px"
                         @click="userClick(user.user_token)"></vue-echarts>
          </template>
        </el-container>
      </template>
    </el-container>
    <el-dialog v-if="topicDialog.id !== undefined"
               :title="topicDialog.name"
               :visible.sync="topicDialogVisible"
               width="50%" center id="topic-dialog">
      <p>{{topicDialog.introduction}}</p>
      <p>
        <span>行业指数: <span class="span-number">{{topicDialog.business}}</span>, </span>
        <span>公司指数: <span class="span-number">{{topicDialog.company}}</span>, </span>
        <span>岗位指数: <span class="span-number">{{topicDialog.job}}</span>, </span>
        <span>地理指数: <span class="span-number">{{topicDialog.location}}</span>, </span>
        <span>专业指数: <span class="span-number">{{topicDialog.major}}</span>, </span>
        <span>教育指数: <span class="span-number">{{topicDialog.school}}</span></span>
      </p>
      <p class="p-center">
        <el-button type="primary" @click="imgClick(topicDialog.avatar_url)">查看图片</el-button>
        <el-button type="primary" @click="zhihuSearch(topicDialog.name + '&type=topic')">前往知乎</el-button>
      </p>
      <template v-if="topicDialog.question_list.length > 0">
        <p>相关问题:</p>
        <el-container v-for="question in topicDialog.question_list" :key="question.id">
          <p>
            问题: {{question.content}}
            <el-button type="primary" @click="zhihuQuestion(question.id)">前往知乎</el-button>
          </p>
          <p v-if="question.keywords.length > 0">
            相关主题:&nbsp;
            <span class="span-button" v-for="keyword in question.keywords" :key="question.id + keyword" @click="zhihuSearch(keyword + '&type=topic')">{{keyword}}&nbsp;</span>
          </p>
          <p>
            <span>关注者数：<span class="span-number">{{question.followers}}</span></span>
            <span>回答数：<span class="span-number">{{question.answers}}</span></span>
            <span>评论数：<span class="span-number">{{question.comments}}</span></span>
            <span>浏览数：<span class="span-number">{{question.viewers}}</span></span>
          </p>
        </el-container>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="topicDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog v-if="userDialog.id !== undefined">

    </el-dialog>
  </el-container>
</template>

<script>
const TOPIC_LABEL = [
  {
    label: '地理',
    value: 'location',
    data: []
  },
  {
    label: '教育',
    value: 'school',
    data: []
  },
  {
    label: '专业',
    value: 'major',
    data: []
  },
  {
    label: '公司',
    value: 'company',
    data: []
  },
  {
    label: '行业',
    value: 'business',
    data: []
  },
  {
    label: '岗位',
    value: 'job',
    data: []
  }
]

const SELECT_CHART_OPTIONS = [
  {
    label: '南丁格尔玫瑰图',
    value: 'ROSE_PIE'
  },
  {
    label: '堆叠图',
    value: 'STACKED'
  }
]

const DEFAULT_CHART_OPTIONS = {
  ROSE_PIE: {
    title: {
      text: '南丁格尔玫瑰图',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
    },
    toolbox: {
      show: true,
      feature: {
        mark: {show: true},
        dataView: {show: true, readOnly: false},
        magicType: {
          show: true,
          type: ['pie', 'funnel']
        },
        saveAsImage: {show: true}
      },
      right: 20
    },
    calculable: true,
    series: [
      {
        type: 'pie',
        radius: [20, 110],
        center: ['50%', '50%'],
        roseType: 'radius',
        label: {
          normal: {
            show: true
          },
          emphasis: {
            show: true
          }
        },
        lableLine: {
          normal: {
            show: false
          },
          emphasis: {
            show: true
          }
        },
        data: [
          {value: 10, name: 'rose1'},
          {value: 5, name: 'rose2'},
          {value: 15, name: 'rose3'},
          {value: 25, name: 'rose4'},
          {value: 20, name: 'rose5'},
          {value: 35, name: 'rose6'},
          {value: 30, name: 'rose7'},
          {value: 40, name: 'rose8'}
        ]
      }
    ]
  },
  STACKED: {
    title: {
      text: '堆叠图'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: []
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      },
      right: 20
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: []
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'location',
        type: 'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data: []
      },
      {
        name: 'school',
        type: 'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data: []
      },
      {
        name: 'major',
        type: 'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data: []
      },
      {
        name: 'company',
        type: 'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data: []
      },
      {
        name: 'business',
        type: 'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data: []
      },
      {
        name: 'job',
        type: 'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data: []
      }
    ]
  },
  RADAR: {
    title: {
      text: '雷达图'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      x: 'center',
      data: ['某软件']
    },
    radar: [
      {
        indicator: [],
        center: ['50%', '50%'],
        radius: 80
      }
    ],
    series: [
      {
        type: 'radar',
        tooltip: {
          trigger: 'item'
        },
        itemStyle: {normal: {areaStyle: {type: 'default'}}},
        data: [
          {
            value: [],
            name: '某软件'
          }
        ]
      }
    ]
  }
}

export default {
  name: 'zhihu-answer',
  data () {
    return {
      metaData: {
        keyword_count: 10,
        txt: null
      },
      chartOptions: [],
      SELECT_CHART_OPTIONS,
      DEFAULT_CHART_OPTIONS,
      TOPIC_LABEL,
      isLoading: false,
      topicDialogVisible: false,
      topicDialog: {},
      userDialog: {}
    }
  },
  mounted () {
  },
  methods: {
    confirmInput () {
      this.isLoading = true
      this.$axios.post('http://localhost:8081/zhihu-answer', {
        keyword_count: this.metaData.keyword_count,
        txt: this.metaData.txt
      }).then(resp => {
        this.addExtractResToChart(resp.data)
        this.isLoading = false
      })
    },
    makeupTagsToRoseChart (data) {
      let tempChartOption = JSON.parse(JSON.stringify(this.DEFAULT_CHART_OPTIONS.ROSE_PIE))
      tempChartOption.series[0].data = []
      data.forEach(t => {
        tempChartOption.series[0].data.push({
          name: t.word,
          value: t.weight
        })
      })
      return tempChartOption
    },
    convertTopicsToRoseChart (data) {
      let tempChartOption = JSON.parse(JSON.stringify(this.DEFAULT_CHART_OPTIONS.ROSE_PIE))
      tempChartOption.series[0].data = []
      data.forEach(t => {
        tempChartOption.series[0].data.push({
          name: t.name,
          value: (t.location + t.school + t.major + t.company + t.business + t.job),
          type: 'topic',
          id: t.id
        })
      })
      return tempChartOption
    },
    convertTopicToStackedChart (data) {
      const topicLabel = JSON.parse(JSON.stringify(this.TOPIC_LABEL))
      const tempChartOption = JSON.parse(JSON.stringify(this.DEFAULT_CHART_OPTIONS.STACKED))
      data.forEach(topic => {
        topicLabel.forEach(t => {
          t.data.push(topic[t.value])
        })
        tempChartOption.xAxis[0].data.push(topic.name)
      })
      topicLabel.forEach(t => {
        tempChartOption.legend.data.push(t.label)
        tempChartOption.series.push({
          name: t.label,
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: t.data
        })
      })
      return tempChartOption
    },
    initialUserRadarChart (userList) {
      const radarMeta = {
        following_count: {
          label: '关注数',
          value: 0
        },
        answer_count: {
          label: '回答数',
          value: 0
        },
        question_count: {
          label: '提问数',
          value: 0
        },
        voteup_count: {
          label: '支持数',
          value: 0
        },
        thanked_count: {
          label: '被感谢次数',
          value: 0
        },
        follower_count: {
          label: '被关注数',
          value: 0
        },
        articles_count: {
          label: '专栏数',
          value: 0
        }
      }
      userList.forEach(u => {
        for (let key in radarMeta) {
          if (u[key] > radarMeta[key].value) {
            radarMeta[key].value = u[key]
          }
        }
      })
      return radarMeta
    },
    makeupUserToRadarChart (user, radarMeta) {
      let tempChartOption = JSON.parse(JSON.stringify(this.DEFAULT_CHART_OPTIONS.RADAR))
      tempChartOption.title.text = user.name
      tempChartOption.legend.data = [user.user_token]
      tempChartOption.indicator = []
      let tempData = {
        value: [],
        name: user.name
      }
      for (let key in radarMeta) {
        tempChartOption.radar[0].indicator.push({
          text: radarMeta[key].label,
          max: radarMeta[key].value
        })
        tempData.value.push(user[key])
      }
      tempChartOption.series[0].data = [tempData]
      return tempChartOption
    },
    addExtractResToChart (extractRes) {
      const tags = extractRes.word_list
      const tempRoseChartOption = this.makeupTagsToRoseChart(tags)
      tempRoseChartOption.title.text += ('关键词-' + (this.chartOptions.length + 1))
      this.chartOptions.push({
        type: 'ROSE_PIE',
        options: tempRoseChartOption,
        data: tags,
        dataType: 'tag',
        convert: false
      })
      const topics = extractRes.topic_list
      const users = extractRes.user_list
      const radarMeta = this.initialUserRadarChart(users)
      users.forEach(u => {
        u.options = this.makeupUserToRadarChart(u, radarMeta)
      })
      const tempStackedChartOption = this.convertTopicToStackedChart(topics)
      tempStackedChartOption.title.text += ('话题-' + (this.chartOptions.length + 1))
      this.chartOptions.push({
        type: 'STACKED',
        options: tempStackedChartOption,
        topics: topics,
        users: users,
        dataType: 'topic',
        convert: true
      })
    },
    convertTopicChart (chart) {
      let tempTitle = chart.options.title.text
      switch (chart.type) {
        case 'ROSE_PIE':
          chart.options = this.convertTopicsToRoseChart(chart.topics)
          break
        case 'STACKED':
          chart.options = this.convertTopicToStackedChart(chart.topics)
          break
      }
      chart.options.title.text = tempTitle
    },
    deleteChart (index) {
      this.chartOptions.splice(index, 1)
    },
    parseTopicDialog (topic) {
      this.isLoading = true
      this.$axios.get('http://localhost:8081/zhihu-topic', {
        params: {
          id: topic.id
        }
      }).then(resp => {
        if (resp.data) {
          this.topicDialogVisible = true
          let tempDialog = resp.data
          let tempKeyWordList = []
          tempDialog.question_list.forEach(q => {
            tempKeyWordList = q.keywords.slice(1, -1).split(', ')
            q.keywords = tempKeyWordList
            tempKeyWordList = []
          })
          this.topicDialog = tempDialog
        } else {
          this.zhihuSearch(topic.name + '&type=topic')
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    chartClick (params) {
      if (params.data.type === 'topic') {
        this.isLoading = true
        this.parseTopicDialog(params)
      } else {
        this.zhihuSearch(params.name + '&type=content')
      }
    },
    imgClick (url) {
      if (url.endsWith('_is.jpg')) {
        url = url.replace('_is.jpg', '.jpg')
      }
      window.open(url, '_blank')
    },
    zhihuSearch (name) {
      window.open('https://www.zhihu.com/search?q=' + name, '_blank')
    },
    zhihuQuestion (id) {
      window.open('https://www.zhihu.com/question/' + id, '_blank')
    },
    topicClick (id) {
      window.open('https://www.zhihu.com/topic/' + id, '_blank')
    },
    userClick (userToken) {
      window.open('https://www.zhihu.com/people/' + userToken, '_blank')
    }
  }
}
</script>

<style scoped lang="scss">
  #zhihu-answer-container {
    display: flex;
    flex-direction: column;
    justify-content: center;

    #label-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      width: 100%;
      padding-right: 10px;
      text-align: left;
      > .el-container {
        max-width: 250px;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        > .el-input {
          margin-bottom: 10px;
        }
        > .el-select {
          margin-bottom: 10px;
        }
      }
    }
    #chart-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      > .el-container {
        display: flex;
        flex-direction: row;
        .chart-sidebar {
          display: flex;
          flex-direction: column;
          > div, button {
            margin-bottom: 10px;
          }
        }
      }
      .el-container-sidebar {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 5px;
        > .topic-intro {
          height: 120px;
          width: 220px;
          padding: 5px;
          background: beige;
          border: 1px solid white;
          font-size: 12px;
          text-overflow: ellipsis;
          overflow: hidden;
          p {
            margin: 0;
          }
          > :first-child {
            font-size: 14px;
            font-weight: bold;
          }
        }
        > .echarts {
          width: 300px;
          height: 300px;
          cursor: pointer !important;
        }
      }
    }
    #topic-dialog {
      .p-center {
        text-align: center;
      }
      .el-container {
        display: flex;
        flex-direction: column;
      }
      .span-button {
        background-color: silver;
        border-radius: 5px;
        padding: 5px;
        font-weight: bolder;
        text-align: center;
        margin-right: 10px;
        cursor: pointer;
      }
      .span-number {
        font-weight: bolder;
        color: cornflowerblue;
      }
    }
  }
</style>

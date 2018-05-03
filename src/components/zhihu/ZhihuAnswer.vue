<template>
  <el-container id="zhihu-answer-container">
    <el-container id="answer-container">
      <el-container id="label-container">
        <p>请输入提取词数</p>
        <el-input placeholder="请输入关键词个数" type="number" v-model="metaData.keyword_count">
          <template slot="prepend">关键词数</template>
        </el-input>
        <p>请选择提取模式</p>
        <el-select v-model="metaData.key_word_type" placeholder="请选择">
          <el-option
            v-for="item in KEY_WORD_TYPE"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click.native="confirmInput">确认</el-button>
      </el-container>
      <el-input type="textarea" v-model="txt" placeholder="请将答案在此复制输入" :autosize="{minRows: 15}">
      </el-input>
    </el-container>
    <el-container id="chart-container">
      <template v-for="(chartOption, index) in chartOptions">
        <el-container :key="index">
          <vue-echarts :options="chartOption"></vue-echarts>
          <div class="chart-sidebar">
            <el-input type="string" v-model="chartOption.title.text">
              <template slot="prepend">图表名</template>
            </el-input>
            <!--<el-input type="string" v-model="chartOption.series[0].center[0]">-->
              <!--<template slot="prepend">水平位置</template>-->
            <!--</el-input>-->
            <!--<el-input type="string" v-model="chartOption.series[0].center[1]">-->
              <!--<template slot="prepend">竖直位置</template>-->
            <!--</el-input>-->
            <el-button type="danger" @click.native="deleteChart(index)">删除</el-button>
          </div>
        </el-container>
      </template>
    </el-container>
  </el-container>
</template>

<script>
const KEY_WORD_TYPE = {
  default: {
    label: 'jieba 分词',
    value: 'default'
  },
  recount: {
    label: '按次数构建语料库',
    value: 'recount'
  },
  single_plus: {
    label: '语料库权重加和',
    value: 'single_plus'
  },
  social_weight: {
    label: '社交化语料库',
    value: 'social_weight'
  }
}
const CHART_TYPE = {
  default: {
    label: 'jieba 分词',
    value: 'default'
  },
  recount: {
    label: '按次数构建语料库',
    value: 'recount'
  },
  single_plus: {
    label: '语料库权重加和',
    value: 'single_plus'
  },
  social_weight: {
    label: '社交化语料库',
    value: 'social_weight'
  }
}

export default {
  name: 'zhihu-answer',
  data () {
    return {
      KEY_WORD_TYPE,
      CHART_TYPE,
      metaData: {
        keyword_count: 10,
        key_word_type: 'default'
      },
      txt: null,
      chartOptions: [],
      DEFAULT_ROSE_PIE_CHART: {
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
          }
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
      }
    }
  },
  mounted () {
    // let tempChartOption = JSON.parse(JSON.stringify(this.DEFAULT_ROSE_PIE_CHART))
    // tempChartOption.title.text += ('-' + (this.chartOptions.length + 1))
    // this.chartOptions.push(tempChartOption)
  },
  methods: {
    confirmInput () {
      this.$axios.post('http://localhost:8081/zhihu-answer', {
        keyword_type: this.metaData.key_word_type,
        keyword_count: this.metaData.keyword_count,
        txt: this.txt
      }).then(resp => {
        console.log(JSON.stringify(resp.data))
        const tags = resp.data
        let tempChartOption = JSON.parse(JSON.stringify(this.DEFAULT_ROSE_PIE_CHART))
        tempChartOption.series[0].data = []
        console.log(JSON.stringify(tempChartOption.series[0].data))
        tags.forEach(t => {
          tempChartOption.series[0].data.push({
            name: t.word,
            value: t.weight
          })
        })
        console.log(JSON.stringify(tempChartOption.series[0].data))
        tempChartOption.title.text += ('-' + (this.chartOptions.length + 1))
        this.chartOptions.push(tempChartOption)
      })
    },
    deleteChart (index) {
      this.chartOptions.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="scss">
  #zhihu-answer-container {
    display: flex;
    flex-direction: column;
    justify-content: center;

    #answer-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      padding: 10px;
      #label-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 250px;
        margin-right: 10px;
        text-align: left;
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
    }
  }
</style>

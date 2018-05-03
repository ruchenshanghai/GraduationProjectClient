<template>
  <el-container id="app-header">
    <img src="../assets/img/logo.png">
    <el-menu default-active="Sample" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-submenu v-for="item in router_list" :key="item.text" :index="item.text">
          <template slot="title">{{item.text}}</template>
          <el-menu-item v-for="sub_item in item.children" :key="sub_item.text" :index="sub_item.link">
            {{sub_item.text}}
          </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-container>
</template>

<script>
export default {
  name: 'app-header',
  data () {
    return {
      router_list: [
        {
          text: '主页',
          children: [
            {
              text: '系统说明',
              link: '/readme'
            },
            {
              text: '图表展示',
              link: '/sample'
            }
          ]
        },
        {
          text: '知乎',
          children: [
            {
              text: '答案分析',
              link: '/zhihu-answer'
            },
            {
              text: '用户推荐',
              link: '/zhihu-user'
            },
            {
              text: '样例展示',
              link: '/zhihu-sample'
            }
          ]
        },
        {
          text: '自定义',
          children: [
            {
              text: '文本分析',
              link: '/diy-txt'
            },
            {
              text: '可视化',
              link: '/diy-visual'
            },
            {
              text: '样例展示',
              link: '/diy-sample'
            }
          ]
        }
      ]
    }
  },
  methods: {
    handleSelect (val) {
      this.$router.push({
        path: val
      })
    }
  }
}
</script>

<style scoped lang="scss">
#app-header {
  background-color: #0064c8;
  display: flex;
  flex-direction: row;
  justify-content: left;
  width: 100%;
  max-width: 980px;
  padding: 10px;
  > img {
    width: 50px;
    height: 50px;
    margin-left: 50px;
    align-self: center;
  }
  > .el-menu {
    background-color: transparent;
    margin-left: 50px;
    border-bottom: none;
    .el-menu-item, .el-submenu{
      > div {
        color: #909399;
      }
      color: #909399;
      width: 130px;
    }
    .el-menu-item:hover {
      background-color: initial;
    }
    .is-active {
      color: #303133;
      background-color: initial;
    }
  }
}
</style>

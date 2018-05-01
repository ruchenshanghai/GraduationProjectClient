<template>
  <el-container id="app-header">
    <img src="../assets/img/logo.png">
    <el-menu default-active="Sample" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="Sample">首页</el-menu-item>
      <el-submenu index="zhihu">
        <template slot="title">知乎</template>
        <el-menu-item index="zhihu-answer">答案分析</el-menu-item>
        <el-menu-item index="zhihu-user">用户推荐</el-menu-item>
        <el-menu-item index="zhihu-example">样例展示</el-menu-item>
      </el-submenu>
      <el-submenu index="diy">
        <template slot="title">自定义数据</template>
        <el-menu-item index="diy-word">文本分析</el-menu-item>
        <el-menu-item index="diy-chart">可视化</el-menu-item>
        <el-menu-item index="diy-example">样例展示</el-menu-item>
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
              link: 'readme'
            },
            {
              text: '图表展示',
              link: 'sample'
            }
          ]
        },
        {
          text: '知乎',
          children: [
            {
              text: '答案分析',
              link: 'zhihu-sample'
            }
          ]
        },
        {
          text: '自定义',
          link: '/diy'
        }
      ]
    }
  },
  methods: {
    redirectTo (router) {
      console.log(router.text)
      console.log(router.name)
    },
    handleSelect (val) {
      console.log(JSON.stringify(val))
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
  max-width: 1280px;
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

<template>
  <el-container id="app-header">
    <img src="../assets/img/logo.png">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="home">首页</el-menu-item>
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
          name: 'home'
        },
        {
          text: '知乎案例',
          name: 'zhihu'
        },
        {
          text: '自定义',
          name: 'diy'
        }
      ],
      activeIndex: '1'
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
        color: black !important;
      }
      color: black;
      width: 130px;
    }
    .is-active {
      color: white;
    }
  }
}
</style>

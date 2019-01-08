<template>
  <div id="app">
    <!-- <el-button>element测试</el-button> -->
    <div class="header"></div>
    <div class="content">
      <div class="leftNav">
      <!-- 菜单栏 -->
        <el-menu router default-active="/" class="el-menu-vertical-demo" text-color="" active-text-color="lightblue">
          <el-menu-item index="/user">
            <i class="el-icon-service"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/category">
            <i class="el-icon-tickets"></i>
            <span slot="title">栏目管理</span>
          </el-menu-item>
          <el-menu-item index="/article" disabled>
            <i class="el-icon-edit"></i>
            <span slot="title">文章管理</span>
          </el-menu-item>
          <el-menu-item index="/newArticle">
            <i class="el-icon-edit"></i>
            <span slot="title">文章管理</span>
          </el-menu-item>
        </el-menu>
      <!-- 菜单栏结束 -->
      </div>
      <div class="rightContent">
        <div class="wapper">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html,body,#app{
  height: 100%;
}
body,ul,ol,dl,p{
  padding: 0;
  margin: 0;
}
div{
  box-sizing: border-box;
}
.header{
  position: absolute;
  top:0;
  width: 100%;
  height: 60px;
  /*border-bottom: 1px solid #ccc;*/
  background-color: #409EFF;
}
.content{
  position: absolute;
  top: 60px;
  bottom:0;
  width: 100%;
}
.content > .leftNav{
  float:left;
  height: 100%;
  width: 200px;
}
.content > .rightContent{
  position: absolute;
  /*top:0;*/
  left:0;
  right:0;
  height: 100%;
  padding: .5em;
  margin-left: 200px;
  background-color: #ECF5FF;
}
.rightContent > .wapper{
  overflow-y: auto;
  padding: 0.5em;
  max-height: 100%;
  border-radius: 5px;
  background-color: #fff;
}
</style>
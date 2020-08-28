<template>
  <!-- 头部 -->
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/home-logo.png" alt="">
        <span>杨老板的后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 整个主体 -->
    <el-container>
      <!-- 侧边 -->
      <el-aside :width="isCollapse ? '65px' : '200px'">
        <div class="ss-button" @click="ssCollapse">|||</div>
        <!-- 侧边菜单区 -->
        <el-menu background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="this.$router.history.current.path">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main>
        <!-- 主体占位 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      //侧边菜单初始化
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao',
      },
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
      this.$message.success('退出成功')
    },
    //获取当前权限菜单
    async getMenuList() {
      const {data : res} = await this.$http.get('menus')
      if( res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    //折叠侧边菜单
    ssCollapse() {
      this.isCollapse = ! this.isCollapse
    }
  },
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.home-container {
  height: 100%;
}

.iconfont{
  margin-right: 8px;
}

.ss-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: white;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
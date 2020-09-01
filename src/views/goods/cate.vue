<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table class="treeTable" :data="catelist" border :columns="columns" index-text="#" show-index :expand-type="false" :selection-type="false">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else  style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="removedCateById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%" @close="addCateDialogClosed"
      >
      <!-- 添加分类表单验证 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 指定数据源 -->
          <!-- props 指定配置对象 -->
          <el-cascader
          v-model="selectedKeys"
          :options="parentCateList"
          :props="{ expandTrigger: 'hover',checkStrictly: true, value:'cat_id', label:'cat_name',children:'children'}"
          @change="parentCateChanged" clearable ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="showEditDialogVisible"
      width="50%"
      >
      <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //商品分类数据列表
      catelist: [],
      //总数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //将当前列定义为模板
          type: 'template',
          //使用isok的模板
          template: 'isok'
        },
        {
          label: '排序',
          //将当前列定义为模板
          type: 'template',
          //使用的模板
          template: 'order'
        },
        {
          label: '操作',
          //将当前列定义为模板
          type: 'template',
          //使用的模板
          template: 'opt'
        }
      ],
      //添加分类对话框显示
      addCateDialogVisible: false,
      //添加分类的表单数据
      addCateForm: {
        //要添加的分类名称
        cat_name: '',
        //父级分类的id
        cat_pid: 0,
        //分类的等级，默认添加的是1级分类
        cat_level: 0
      },
      //添加表单验证规则 对象
      addCateFormRules: {
        cat_name: [
        {
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }]
      },
      //父级分类的数据列表
      parentCateList: [],
      //指定级联选择的配置对象
      cascaderProps: {
        value: 'cat_id',
        lable: 'cat_name',
        children: 'children'
      },
      //选择的数组
      selectedKeys: [],
      //编辑分类对话框显示
      showEditDialogVisible: false,
      //编辑分类数据
      editCateForm: {
      },
      //编辑分类表单验证规则 对象
      editCateFormRules: {
        cat_name: [
        {
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      const {data: res} = await this.$http.get('categories', { params: this.querInfo})
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      //把数据列表赋值给catelist
      this.catelist = res.data.result
      //总数据条数赋值
      this.total = res.data.total
    },
    //监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    //监听pagenum改变
    handleCurrentChange(newNum) {
      this.querInfo.pagenum = newNum
      this.getCateList()
    },
    //添加分类对话框显示
    showAddCateDialog() {
      //获取父级分类数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const {data: res} = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if(res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败！')
      }
      
      this.parentCateList = res.data
    },
    //选择项发生变化
    parentCateChanged() {
      // 如果selectedKeys数组大于0有分类
      if(this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length -1]
      
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else {
        //父级分类的id
        this.addCateForm.cat_pid = 0
        //当前分类等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    //确定添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.post('categories', this.addCateForm)
        if(res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    //监听对话框关闭事件
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //编辑分类对话框
    async showEditDialog(id) {
      //获取当前分类名称
      const {data: res} = await this.$http.get('categories/' + id)
      if(res.meta.status !== 200) {
        return this.$message.error('获取分类名称失败！')
      }
       this.editCateForm = res.data
      //显示对话框
      this.showEditDialogVisible = true
    },
    //编辑分类名称提交
    editCateInfo() {
      this.$refs.editCateFormRef.validate(async valid => {
        if(!valid) return
        const {data:res} = await this.$http.put('categories/' + this.editCateForm.cat_id, {
          id: this.editCateForm.cat_id,
          cat_name: this.editCateForm.cat_name
        } )
        if(res.meta.status !== 200) {
          return this.$message.error('更新分类失败！')
        }
        this.getCateList()
        this.showEditDialogVisible = false
        this.$message.success('更新分类成功！')
      })
    },
    //删除分类
    async removedCateById(id) {
      //弹窗询问是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        //如果用户确认删除，则返回值为字符串 confirm
        //如果用户取消了删除，则返回值为字符串 cancel
      //取消删除
      if(confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      //删除分类
      const {data:res} = await this.$http.delete('categories/' + id)
      if(res.meta.status !== 200) {
        return this.$message.error('删除分类失败！')
      }
      //刷新分类列表
      this.getCateList()
      this.$message.success('删除分类成功！')
    }
  },
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开具体权限 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' :'', 'vcernter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二、三级权限 -->
              <el-col :span="19">
                <!-- 通过for 嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcernter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" width="300px">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="修改权限信息"
      :visible.sync="setRightDialogVisible"
      width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightList" :props="treeProps" :default-checked-keys="defKeys"
       default-expand-all show-checkbox node-key="id"
       ref="treeRef"></el-tree>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      //所有权限列表
      rightList: [],
      //树形控件绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //已有权限默认勾上，存在数组中
      defKeys: [],
      //当前即将分配权限的角色id
      roleId: '',
      //添加角色窗口显示
      addDialogVisible: false,
      //添加角色的表单数据
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      addFormRules: {
        roleName: [
          {
            required: true, 
            message: '请输入角色名',
            trigger: 'blur'
          },
          {
            min: 0,
            max: 10,
            message: '角色名不能为空',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true, 
            message: '请输入角色描述',
            trigger: 'blur'
          }
        ]
      },
      //修改用户窗口显示
      editDialogVisible: false,
      //查询到的信息对象
      editForm: {
        
      },
      //修改角色的表单规则对象
      editFormRules: {
        roleName: [
          {
            required: true, 
            message: '请输入角色名',
            trigger: 'blur'
          },
          {
            min: 0,
            max: 10,
            message: '角色名不能为空',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true, 
            message: '请输入角色描述',
            trigger: 'blur'
          }
        ]
      },
      //分配权限对话框显示
      setRightDialogVisible: false
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //获取角色列表
    async getRolesList() {
      const{data : res} = await this.$http.get('roles')
      if(res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.roleList = res.data
    },
    // 添加角色对话框 关闭重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //添加新角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        //表单数据验证后，发送网络请求，添加用户
        const {data: res} = await this.$http.post('roles', this.addForm)
        if(res.meta.status !== 201) {
          this.$message.error('添加角色失败！')
        }

        this.$message.success('添加角色成功！')
        //隐藏添加用户对话框
        this.addDialogVisible = false
        //重新刷新用户表单
        this.getRolesList()
      })
    },
    //展示id 编辑角色对话框
    async showEditDialog(id) {
    const {data: res} = await this.$http.get('roles/' + id)
    if(res.meta.status !== 200) {
      return this.$message.error('查询角色信息失败！')
    }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改橘色信息并提交
    editRoleInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return
        //发起修改角色信息的数据请求
        const {data: res} = await this.$http.put('roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })

        if(res.meta.status !== 200) {
          return this.$message.error('修改角色信息失败！')
        }
        //关闭修改用户信息对话框
        this.editDialogVisible = false
        //更新数据
        this.getRolesList()
        //提示修改成功
        this.$message.success('修改角色信息成功！')
      })
    },
    //删除角色 by id
    async removeRoleById(id){
      //询问是否永久删除
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果用户确认删除，则返回值为字符串 confirm
      //如果用户取消了删除，则返回值为字符串 cancel
      if(confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const{data: res} = await this.$http.delete('roles/' + id)
      if(res.meta.status != 200) {
        return this.$message.error('删除角色失败！')
      }
      //刷新角色列表
      this.getRolesList()
      //提示成功
      this.$message.success('删除角色成功')
    },
    //根据ID删除对应权限
    async removeRightById(role, rightId) {
      //询问是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if(confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      //删除权限
      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if(res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      //刷新权限列表
      //this.getRolesList()
      //只需要更新权限就行，接口data返回了最新的权限
      role.children = res.data
      // 提示成功
      return this.$message.success('删除成功')
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      //获取所有权限列表
      const {data: res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }

      //把获取到的数据放入表内
      this.rightList = res.data
      //调用递归把权限存到defKeys数组中
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    //通过递归形式，获取当前id角色下所有三级权限,并保存到数组中
    getLeafKeys(node, arr) {
      //如果当前node节点不包含children 是三级节点
      if(!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 确定分配权限
    async alotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

    const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
    
    if(res.meta.status !== 200) {
      return this.$message.error('分配权限失败!')
    }
    this.getRolesList()
    this.setRightDialogVisible = false
    this.$message.success('分配权限成功')
    }
  },
}
</script>

<style>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcernter {
  display: flex;
  align-items: center;
}
</style>
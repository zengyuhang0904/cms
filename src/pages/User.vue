<template>
	<div class="User">
		<div class="btns">
		  <el-button type="primary" round size="mini" @click="showModal()">新 增</el-button>
		</div>
		<div class="users" v-loading="loading2">
			<div class="user" v-for="U in allUsers">
				<div class="handle">
					<i title="修改" class="el-icon-edit-outline" @click="reviseUser(U)"></i>
		      <i title="删除" class="el-icon-circle-close-outline" @click="deleteUser(U.id)"></i>
				</div>
				<div class="face">
					<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1541684993751&di=4d6f4a63429bc0e309850349475fc4a8&imgtype=0&src=http%3A%2F%2Fpic.xcarimg.com%2Fdealer%2Fupload%2Fattach%2F20180121%2Ffdfbf6f93d25339fde3783d326228330.jpg" alt="头像未上传">
				</div>
				<div class="property">
					<span class="left_name">用户名</span>
					<span>{{U.username}}</span>
				</div>
				<div class="property">
					<span class="left_name">真实姓名</span>
					<span>{{U.nickname}}</span>
				</div>
				<div class="property">
					<span class="left_name">邮箱地址</span>
					<span>{{U.email}}</span>
				</div>
			</div>
		</div>
		<!-- 新增模态框 -->
		<el-dialog :title="newUser.title" :visible.sync="newUser.visible">
			{{newUser.form}}
		  <el-form :model="newUser.form" size="mini" label-position="left" >
		    <el-form-item label="用户名" label-width="6em">
		      <el-input v-model="newUser.form.username" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="真实姓名" label-width="6em">
		      <el-input v-model="newUser.form.nickname" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="密码" label-width="6em">
		      <el-input type="password" v-model="newUser.form.password" autocomplete="off"></el-input>
		    </el-form-item>
			  <el-form-item label="邮箱地址" label-width="6em">
		      <el-input v-model="newUser.form.email" autocomplete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click="closeModal()">取 消</el-button>
		    <el-button type="primary" size='mini' @click="saveUser()">确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 模态框结束 -->
	</div>
</template>	
<script>
	import axios from '@/http/axios'
	export default{
		data(){
			return{
				loading2: false,
				newUser:{
					title:'',
					visible:false,
					form:{}
				},
				allUsers:[],
			}
		},
		methods:{
			/* 修改用户 */
			reviseUser(U){
				let user =  _.clone(U);;
				console.log(this.newUser.form);
				this.newUser.visible = true;
				this.newUser.title = '修改用户信息';
				for(let key in user){
					let val = user[key]
					if(!val){
						delete user[key];
					}
				};
				this.newUser.form = user
			},
			/* 删除用户 */
			deleteUser(id){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    })
		    .then(()=>{
		    	axios.get('/manager/user/deleteUserById?id='+id)
					.then(()=>{
						this.$message({
		      		message: '删除成功',
		      		type: 'success'
		      	});
		      	this.loadAllUsers()
					})
					.catch()
		    })
				
			},
			/* 保存用户 */
			saveUser(){
				axios.post('/manager/user/saveOrUpdateUser',this.newUser.form)
				.then(()=>{
					this.$message({
		          message: '提交成功',
		          type: 'success'
		        });
	        this.closeModal();
	        this.loadAllUsers();
				})
				.catch(()=>{
					this.$message.error('提交失败');
				});
			},
			/* 关闭并清空模态框 */
			closeModal(){
				this.newUser.visible = false;
				this.newUser.form = {};

			},
			/* 打开新增模态框 */
			showModal(){
				this.newUser.visible = true;
				this.newUser.title = '添加用户';
			},
			loadAllUsers(){
				this.loading2=true;
				axios.get('/manager/user/findAllUser')
				.then(({data:res})=>{
					this.allUsers = res.data;
				})
				.catch(()=>{
					this.$message.error('网络异常,加载数据失败');
				})
				.finally(()=>{
					this.loading2=false;
				})
			},
		},
		created(){
			this.loadAllUsers()
		}
	}
</script>	
<style>
div{
	box-sizing: border-box;
}
.btns{
	margin: .5em;
}
.users::after{
	content:"";
	display: block;
	clear:both;
}
.user{
	box-shadow:10px 10px 10px #ccc;
	width: 30%;
	height: 300px;
	padding: .5em;
	margin: 1em;
	float: left;
}
.face img{
	width:100%;
	height: 100%;
	border-radius: 50%;
}
.face{
	margin: 1em auto;
	width: 100px;
	height: 100px;
	border-radius: 50%;
}
.left_name{
	display: inline-block;
	width: 25%;
	padding-left: 5px;
	margin: 10px;
}
	.user  i{
		cursor: pointer;
		margin: 0 .5em;
		font-size: 16px
	}
	.user  i:last-child{
		color: #F56C6C;
	}

	.user .handle{
		visibility: hidden;
		text-align: right;
	}
	.user:hover .handle{
		visibility:visible;
	}
</style>
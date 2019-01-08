<template>
	<div class="article">
		<!-- 下拉框和按钮组 -->
		<div class="btns">
		  <el-select style="width:6em" v-model="value" placeholder="请选择" size="mini" @change="findAllArticles(+(value))">
		    <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id"></el-option>
		  </el-select>
		  <el-button type="primary" round size="mini" @click='ToAddArticle()'>新增</el-button>
		  <el-button type="primary" round size="mini" @click='batchDelArticle()'>批量删除</el-button>
		</div>

		<!-- 表格开始 -->
		<div class="categoryTab" v-loading="loading">
			<el-table :data="articles" style="width: 100%" size="mini" :border="true" @selection-change="handleSelectionChange" empty-text="请选择栏目">
		      <el-table-column type="selection" label="编号" width="60" align="center">
			  </el-table-column>
		      <el-table-column prop="title" label="文章标题" align="center">
		      </el-table-column>
		      <el-table-column prop="category.name" label="所属栏目" width="300" align="center">
		      </el-table-column>
		      <el-table-column prop="liststyle" label="排列方式" width="120" align="center">
		      </el-table-column>
		      <el-table-column prop="publishtime" label="发布时间" width="170" align="center">
		      </el-table-column>
		      <el-table-column prop="readtimes" label="阅读次数" width="80" align="center">
		      </el-table-column>
		      <el-table-column align="center" label="操作" width="100">
		      	<template slot-scope='{row}'>
		      		<i title="修改" class="el-icon-edit" @click="changeArticle(row)"></i>
		      		<i title="删除" class="el-icon-delete" @click="delArticle(row.id)"></i>
		      	</template>
		      </el-table-column>
		    </el-table>
		</div>
		<!-- 表格结束 -->

		<!-- 模态框开始 -->
		<el-dialog :title="newArticle.title" :visible.sync="newArticle.visible">
		  <el-form :model="newArticle.form" size="mini" label-position="left" >
		    <el-form-item label="标题" label-width="6em">
		      <el-input v-model="newArticle.form.title" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="所属栏目" label-width="6em">
		      <el-select v-model="newArticle.form.categoryId">
		        <el-option :key='c.id' v-for='c in categories' :label="c.name" :value="c.id"></el-option>
		      </el-select>
		    </el-form-item>
		    <el-form-item label="列表样式" label-width="6em">
		      <el-radio v-model="newArticle.form.liststyle" label="style-one" border size="medium">style-one</el-radio>
    		  <el-radio v-model="newArticle.form.liststyle" label="style-two" border size="medium">style-two</el-radio>
		    </el-form-item>
		    <el-form-item label="正文" label-width="6em">
		      <el-input v-model="newArticle.form.content" type="textarea" :rows="3"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click='closeNewArticle()'>取 消</el-button>
		    <el-button type="primary" size='mini' @click='saveOrUpdate()'>确 定</el-button>
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
				categories:[],
				articles:[],
				value:'',
				categoryId:'',
				loading:false,
				multipleSelection:[],
				newArticle:{
					title:'',
					visible:false,
					form:{}
				},
			}
		},
		methods:{

			//显示模态框  新增按钮
			ToAddArticle(){
				this.newArticle.title="新增";
				this.newArticle.form={};
				this.newArticle.visible=true;
			},
			//关闭模态框
			closeNewArticle(){
				this.newArticle.visible=false;
			},

			//修改
			changeArticle(row){
				console.log('row',row);
				this.newArticle.title="修改";
				this.newArticle.form=row;
				this.newArticle.form.categoryId=row.category.id;
				this.newArticle.visible=true;
			},

			//修改或保存
			saveOrUpdate(){
				// alert(JSON.stringify(this.newArticle.form));
				axios.post('/manager/article/saveOrUpdateArticle',this.newArticle.form)
				.then(()=>{
					this.$message({
		          message: '提交成功',
		          type: 'success'
		        });
	        this.closeNewArticle();
	        this.findAllArticles(this.value);
				})
				.catch(()=>{
					this.$message.error('提交失败');
					console.log(123,);
				});
			},
			//多选框
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		      },
			//批量删除
			batchDelArticle(){
		    	let ids=this.multipleSelection.map((item)=>{
		    		return item.id;
		    	});
		    	this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(()=>{
		        	axios.post('/manager/article/batchDeleteArticle',{ids})
		        	.then(()=>{
			    		this.$message({
		          message: '删除成功',
		          type: 'success'
		        });
						this.findAllArticles(this.value);
			    	})
		        	.catch(()=>{
			    		this.$message.error('提交失败')
			    	})
		        })    	
		    },

			//通过id删除信息
			delArticle(id){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(()=>{
		        	axios.get('/manager/article/deleteArticleById?id='+id).then(()=>{
						this.$message({
		          message: '删除成功',
		          type: 'success'
		        });
				     	this.findAllArticles(+(this.value));
					}).catch(()=>{
						this.$notify.error({
				          title: '错误',
				          message: '删除失败!'
				        });
					})
		        })		
			},
			//加载下拉框
			loadCategoryName(){
				axios.get('/manager/category/findAllCategory')
				.then(({data:result})=>{
					this.categories=result.data;
					console.log(this.categories);
				})
				.catch(()=>{
					 this.$notify.error({
			          title: '错误',
			          message: '网络异常！'
			        });
				})
				.finally(()=>{
				})
			},
			//根据下拉菜单的内容获取文章信息
			findAllArticles(id){
				this.loading=true;
				// alert(id);
				axios.get('/manager/article/findArticle?page=0&pageSize=100&categoryId='+id)
				.then(({data:result})=>{
					this.articles=result.data.list;
					// console.log('=======',this.articles)
				})
				.catch(()=>{
					this.$message.error('数据加载失败,请重新尝试加载数据')
				})
				.finally(()=>{
					this.loading=false;
				})
			},
		},
		created(){
			this.loadCategoryName();
		},
	}
</script>

<style>
	.btns{
		margin: .5em;
	}
	.categoryTab  i{
		cursor: pointer;
		margin: 0 .3em;
		font-size: 18px
	}
	.categoryTab  i:last-child{
		color: #F56C6C;
	}
</style>
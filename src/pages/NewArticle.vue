<template>
	<div class="article">
	<!-- 按钮区 -->
		<div class="btns">
		<el-select v-model="params.categoryId" placeholder="选择栏目" clearable v-loading="loading2"element-loading-text="栏目加载中" element-loading-spinner="el-icon-loading" element-loading-background="#ECF5FF" style="margin-right:.7em">
	    <el-option v-for="c in allCategory" :key="c.id" :label="c.name" :value="c.id">
	    </el-option>
  	</el-select>
		  <el-button type="primary" round size="mini" @click="addToShowModal()">新增</el-button>
		  <el-button type="primary" round size="mini" @click="batchDeleteArticle()">批量删除</el-button>
		</div>
	<!-- 按钮区结束 -->
	<!-- 表格区 -->
		<div class="articleTab" v-loading="loading">
			<el-table :data="articles" style="width: 100%" size="mini" :border="true" @selection-change="handleSelectionChange" empty-text="该栏目下没有文章">
		      <el-table-column type="selection" label="编号" width="60" align="center">
			  	</el-table-column>
		      <el-table-column prop="title" label="文章标题" align="center">
		      </el-table-column>
		      <el-table-column prop="category.name" label="所属栏目" width="100" align="center">
		      </el-table-column>
		      <el-table-column prop="liststyle" label="排列方式" width="150" align="center">
		      </el-table-column>
		      <el-table-column prop="publishtime" label="发布时间" width="250" align="center">
		      </el-table-column>
		      <el-table-column prop="readtimes" label="阅读次数" width="100" align="center">
		      </el-table-column>
		      <el-table-column align="center" label="操作" width="120">
		      	<template slot-scope='{row}'>
		      		<i title="修改" class="el-icon-edit" @click="reviseToShowModal(row)"></i>
		      		<i title="删除" class="el-icon-delete" @click="deleteArticle(row.id)"></i>
		      	</template>
		      </el-table-column>
		    </el-table>
		</div>
	<!-- 表格区结束 -->
	<!-- 分页区 -->
		<div class="page">
			<el-pagination @current-change='handleCurrentChange' :page-size="params.pageSize" layout="prev, pager, next" :total="total">
		  </el-pagination>
		</div>
	<!-- 分页区结束 -->
	<!-- 模态框 -->
		<div class="modal">
			<el-dialog :title="newArticle.title" :visible.sync="newArticle.visible" fullscreen>
			{{newArticle.form}}
			  <el-form :model="newArticle.form" size="mini" label-position="left" >
			    <el-form-item label="标题" label-width="6em">
			      <el-input v-model="newArticle.form.title" autocomplete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="所属栏目" label-width="6em">
			      <el-select v-model="newArticle.form.categoryId">
			        <el-option :key='c.id' v-for='c in allCategory' :label="c.name" :value="c.id"></el-option>
			      </el-select>
			    </el-form-item>
			    <el-form-item label="列表样式" label-width="6em">
			      <ul class="liststyle">
			      	<li class="style-one" :class="{current:newArticle.form.liststyle =='style-one'}" @click="newArticle.form.liststyle = 'style-one'">
			      		<img src="@/assets/1.jpg" alt="">
			      	</li>
			      	<li class="style-two" :class="{current:newArticle.form.liststyle =='style-two'}" @click="newArticle.form.liststyle = 'style-two'">
			      		<img src="@/assets/2.jpg" alt="">
			      	</li>
			      </ul>
			    </el-form-item>
			    <el-form-item label="缩略图" label-width="6em">
				    <el-upload
						  action="http://120.78.164.247:8099/manager/file/upload"
						  :on-success='handleUploadSuccess'
						  list-type="picture">
						  <el-button size="small" type="primary">点击上传</el-button>
						  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
						</el-upload>
					</el-form-item>
			    <el-form-item label="正文" label-width="6em">
			      <!-- <el-input v-model="newArticle.form.content" type="textarea" :rows="6"></el-input> -->
			      <mavon-editor ref="articleContent" v-model="newArticle.form.content"/>
			    </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button size='mini' @click="closeModal()">取 消</el-button>
			    <el-button type="primary" size='mini' @click="saveOrUpdate()">确 定</el-button>
			  </div>
			</el-dialog>
		</div>
	<!-- 模态框结束 -->

	</div>
</template>
<script>
	import axios from '@/http/axios'
	export default{
		data(){
			return{
				newArticle:{
					title:'',
					visible:false,
					form:{
						liststyle:'style-one',
					}
				},
				ids:[],
				class:'',
				loading:false,
				loading2:false,
				articles:[],
				allCategory:[],
				multipleSelection:[],
				total:10,
				params:{
					page:0,
					pageSize:9,
					categoryId:undefined,
				}
			}
		},
		methods:{
			/* 文件上传 */
			handleUploadSuccess(response, file, fileList){
				this.articleDialog.form.fileIds.push(response.data.id);
			},
			/* 点击修改显示模态框并将title值设置为修改文章 */
			reviseToShowModal(row){
				let article = _.clone(row);
				// console.log(123,article);
				article.categoryId = article.category.id;
				delete article.category;
				for(let key in article){
					let val = article[key]
					if(!val){
						delete article[key];
					}
				};
				this.newArticle.title = "修改";
				this.newArticle.visible = true;
				this.newArticle.form = article;
				// this.newArticle.form.categoryId = row.name;
			},
			/* 点击新增显示模态框并将title值设置为新增文章 */
			addToShowModal(){
				this.newArticle.form = {liststyle:'style-one'};
				this.newArticle.title = "新增文章";
				this.newArticle.visible = true;
				// this.newArticle.form = {liststyle:'style-one'};
			},
			/* 关闭模态框并清空表单内容 */
			closeModal(){
				this.newArticle.visible = false;
				// this.clearForm();
			},
			/* 保存或修改,提交后关闭模态框 */
			saveOrUpdate(){
				/* 将富文本编辑器的html代码绑定到form.source上 */
				this.newArticle.form.source = this.$refs.articleContent.d_render
				axios.post('/manager/article/saveOrUpdateArticle',this.newArticle.form)
				.then(()=>{
					this.$message({
		        message: '提交成功',
		        type: 'success'
		      });
		      this.loadAllArticle();
					this.closeModal();
				})
				.catch(()=>{
					this.$message.error('提交失败');
				});
			}, 
			/* 批量删除 */
			batchDeleteArticle(){
				let ids = this.multipleSelection.map((item)=>{
					return item.id;
				});
				this.ids = ids;
				this.$confirm('是否永久删除这些数据?', '注意,批量删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(()=>{
        	axios.post('/manager/article/batchDeleteArticle',{ids})
						.then(()=>{
							this.$message({
		         	 message: '删除成功',
		         	 type: 'success'
		       	 });
						})
						this.loadAllArticle()
						.catch()
        })
			},
			/* 通过id删除 */
			deleteArticle(id){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    })
		    .then(()=>{
		      axios.get('/manager/article/deleteArticleById?id='+id).then(()=>{
						this.$message({
		      		message: '删除成功',
		      		type: 'success'
		      	});
				  this.loadAllArticle();
					})
					.catch(()=>{
						this.$notify.error({
				      title: '错误',
				      message: '删除失败!'
				    });
					})
		    })
			},
			handleCurrentChange(page){
				this.params.page = page -1;
			},
			/* 获取所有文章 */
			loadAllArticle(){
				// console.log(456,this.params);
				this.loading = true;
				axios.get('/manager/article/findArticle',{params:
					this.params
				})
				.then(({data:res})=>{
					// console.log(123,res.data);
					this.articles = res.data.list;
					this.total = res.data.total;
				})
				.catch(()=>{
					this.$message.error('网络异常,加载数据失败');
				})
				.finally(()=>{
					this.loading = false;
				})
			},
			/* 加载所有category */
			loadAllCategory(){
				this.loading2 = true;
				axios.get('/manager/category/findAllCategory')
				.then(({data:res})=>{
					// console.log(res.data);
					this.allCategory = res.data;
				})
				.catch(()=>{
					this.$message.error('网络异常,加载数据失败');
				})
				.finally(()=>{
					this.loading2 = false;
				})
			},
			handleSelectionChange(val) {
        this.multipleSelection = val;
      },
		},
		watch:{
			params:{
				handler:function(){
				this.loadAllArticle();
				},
				deep:true
			},
		},
		created(){
			this.loadAllArticle();
			this.loadAllCategory();
		}
	}
</script>
<style>
	.btns{
		margin: .5em;
	}
	.articleTab  i{
		cursor: pointer;
		margin: 0 .5em;
		font-size: 16px
	}
	.articleTab  i:last-child{
		color: #F56C6C;
	}
	.page{
		width:100%;
		margin: 2em auto;
		text-align: center;
	}
	.liststyle{
		list-style: none;
		overflow:hidden;
	}

	.liststyle > li{
		width: 200px;
		height: 80px;
		border:1px solid #f0f0f0;
		border-radius: 5px;
		float: left;
		margin: 0 2em 0 0;
	}
	.liststyle >li.current {
		border-color: #409eff;
	}
	.liststyle img{
		width: 100%;
		border-radius: 5px;
	}
</style>
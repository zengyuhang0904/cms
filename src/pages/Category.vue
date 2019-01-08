<template>
	<div class="category">
		<div class="btns">
		  <el-button type="primary" round size="mini" @click="addDate()">新 增</el-button>
		  <el-button type="primary" round size="mini" @click="batchDeleteCategory()">批量删除</el-button>
		</div>
		<!-- category表格 -->
			<div class="categoryTab">
			 	<el-table :data="allCategory" style="width: 100%" border v-loading="loading" @selection-change="handleSelectionChange">
				 	<el-table-column align="center" type="selection" width="55">
		   		</el-table-column>
		      <el-table-column align="center" prop="name" label="栏目名称" width="120">
		      </el-table-column>
		      <el-table-column align="center" prop="parent.name" label="父栏目" width="140">
		      </el-table-column>
		      <el-table-column align="center" prop="comment" label="描述">
		      </el-table-column>
		      <el-table-column align="center" label="操作" width="120">
		      	<template slot-scope='{row}'>
		      		<i title="修改" class="el-icon-edit" @click="toUpdateCategory(row)"></i>
		      		<i title="删除" class="el-icon-delete" @click="deleteCatrgory(row.id)"></i>
		      	</template>
		      </el-table-column>
		    </el-table>
		  </div>
		<!-- category表格结束 -->
		<!-- 模态框 -->
		<el-dialog :title="newCategory.title" :visible.sync="newCategory.visible">
			<!-- {{newCategory.form}} -->
		  <el-form :model="newCategory.form" size="mini" label-position="left" >
		    <el-form-item label="栏目名称" label-width="6em">
		      <el-input v-model="newCategory.form.name" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="父栏目" label-width="6em">
		      <el-select v-model="newCategory.form.parentId" placeholder="父栏目">
		        <el-option :key='c.id' v-for='c in allCategory' :label="c.name" :value="c.id"></el-option>
		      </el-select>
		    </el-form-item>
		    <el-form-item label="栏目描述" label-width="6em">
		      <el-input v-model="newCategory.form.comment" type="textarea" :rows="2"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click="closeModal()">取 消</el-button>
		    <el-button type="primary" size='mini' @click="saveOrUpdateCategory()">确 定</el-button>
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
				newCategory:{
					title:'',
					visible:false,
					form:{}
				},
				ids:[],
				loading:false,
				allCategory:[],
				multipleSelection: [],
			}
		},
		methods:{
			/* 新增或保存数据 */
			saveOrUpdateCategory(){
				axios.post('/manager/category/saveOrUpdateCategory',this.newCategory.form)
				.then(()=>{
					this.$message({
		          message: '提交成功',
		          type: 'success'
		        });
	        this.closeModal();
	        this.loadAllCategory();
				})
				.catch(()=>{
					this.$message.error('提交失败');
				});
			} ,
			/* 关闭模态框 */
			closeModal(){
				this.newCategory.visible = false;
				this.newCategory.form = {}
			},
			/* 修改显示模态框 */
			toUpdateCategory(row){
				this.newCategory.title='修改栏目';

				let category = _.clone(row);
				category.parentId = category.parent.id;
				delete category.parent
				// row.parentId = row.parent.id;
				this.newCategory.form=category;
				this.newCategory.visible = true;
			},
			/* 新增显示模态框 */
			addDate(){
				this.newCategory.title = '新增栏目';
				this.newCategory.visible = true;
			},
			/* 批量删除 */
			batchDeleteCategory(){
				let ids = this.multipleSelection.map((item)=>{
					return item.id;
				})
				this.ids = ids;
				this.$confirm('是否永久删除这些数据?', '注意,批量删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	axios.post('/manager/category/batchDeleteCategory',{ids})
					.then(()=>{
						this.$message({
		          message: '删除成功',
		          type: 'success'
		        });
					})
					this.loadAllCategory()
				.catch()
        })
			},
			/* 通过id删除一个category */
			deleteCatrgory(id){
				// alert(id);
				this.$confirm('是否永久删除此数据?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	axios.get('/manager/category/deleteCategoryById?id='+id)
					.then(()=>{
						this.$message({
		          message: '删除成功',
		          type: 'success'
		        });
					})
					this.loadAllCategory()
				.catch()
        })
				
			},
			/* 加载所有category */
			loadAllCategory(){
				this.loading = true;
				axios.get('/manager/category/findAllCategory')
				.then(({data:res})=>{
					console.log(res.data);
					this.allCategory = res.data;
				})
				.catch(()=>{
					this.$message.error('网络异常,加载数据失败');
				})
				.finally(()=>{
					this.loading = false;
				})
			},
			handleSelectionChange(val) {
      	this.multipleSelection = val;
      }
		},
		created(){
			this.loadAllCategory();
		}
	}
</script>
<style>
	.btns{
		margin: .5em;
	}
	.categoryTab  i{
		cursor: pointer;
		margin: 0 .5em;
		font-size: 16px
	}
	.categoryTab  i:last-child{
		color: #F56C6C;
	}
</style>
<template>
    <div class="bg h-screen px-4 pt-[20vh]">

<div class="bg-white shadow rounded-lg border w-[300px] mx-auto flex flex-col items-center justify-center py-8 px-4">
    <h1 class="font-bold text-2xl text-center mb-4 text-blue-700">抽獎人數設置</h1>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      label-position="left"
      
      class="demo-ruleForm"
    >
      <el-form-item label="抽獎人數" prop="num">
        <el-select v-model="ruleForm.num" style="width: 100px; border-radius: 400px; overflow: hidden; font-size: 20px;">
          <el-option :value="30" label="30人">30人</el-option>
          <el-option :value="45" label="45人">45人</el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="flex flex-col gap-4 w-full">
        <el-button type="primary"  style="margin: 0;height: 48px;" @click="submitForm(ruleFormRef)"
          >送出</el-button
        >
    </div>
   </div>
    </div>
 
  </template>
  
  <script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import axios from 'axios'
  import { useRoute } from 'vue-router' 
  
  const ruleFormRef = ref<FormInstance>()
  

  const ruleForm = reactive({
    num: 30,
  })
  
  const rules = reactive<FormRules<typeof ruleForm>>({
    num: [{ required: true, message: '請選擇人數', trigger: 'change' }],
  })
  
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        try {
            const { data } = await axios.post('https://propartnerbe.vercel.app/setNum', ruleForm)
            console.log(data)
            ElMessage.success('成功')
        } catch (err) {
            console.log(err)
            ElMessage.error(err?.response?.data?.message ?? '失敗')
        }
      } 
    })
  }

  const route = useRoute()

  </script>

  <style lang="scss" scoped>
.bg {
    background-color: #dbdbdb;
}</style>
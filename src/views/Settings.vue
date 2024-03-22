<template>
    <div class="bg h-screen px-4 pt-[20vh] flex flex-col gap-10">

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
          <el-option :value="10" label="10人">10人</el-option>
          <el-option :value="15" label="15人">15人</el-option>
          <el-option :value="20" label="20人">20人</el-option>
          <el-option :value="25" label="25人">25人</el-option>
          <el-option :value="30" label="30人">30人</el-option>
          <el-option :value="35" label="35人">35人</el-option>
          <el-option :value="40" label="40人">40人</el-option>
          <el-option :value="45" label="45人">45人</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="兌換時間">
        <el-input v-model="ruleForm.time" />
      </el-form-item>
    </el-form>

    <div class="flex flex-col gap-4 w-full">
        <el-button type="primary"  style="margin: 0;height: 48px;" @click="submitForm(ruleFormRef)"
          >送出</el-button
        >
    </div>
   </div>

   <div class="bg-white shadow rounded-lg border w-[300px] mx-auto flex flex-col items-center justify-center py-8 px-4">
    <h1 class="font-bold text-2xl text-center mb-4 text-red-700">重置得獎名單</h1>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      label-position="left"
      
      class="demo-ruleForm"
    >
      <el-form-item label="場次" prop="event">
        <el-select v-model="ruleForm2.event" style="width: 100px; border-radius: 400px; overflow: hidden; font-size: 20px;">
          <el-option :value="1" label="1">1</el-option>
          <el-option :value="2" label="2">2</el-option>
          <el-option :value="3" label="3">3</el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="flex flex-col gap-4 w-full">
        <el-button type="warning"  style="margin: 0;height: 48px;" @click="reset"
          >重置得獎者</el-button
        >
    </div>
   </div>
    </div>
 
  </template>
  
  <script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage, ElLoading } from 'element-plus';
  import axios from 'axios'
  import { useRoute } from 'vue-router' 
  
  const ruleFormRef = ref<FormInstance>()
  

  const ruleForm = reactive({
    num: 30,
    time: '16:00'
  })
  const ruleForm2 = reactive({
    event: 1,
  })
  
  const rules = reactive<FormRules<typeof ruleForm>>({
    num: [{ required: true, message: '請選擇人數', trigger: 'change' }],
  })
  
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
     const loading = ElLoading.service({
      lock: true,
      customClass: 'spinner',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    formEl.validate(async (valid) => {
      if (valid) {
        try {
            const { data } = await axios.post('https://propartnerbe.vercel.app/setNum', ruleForm)
            await axios.post('https://propartnerbe.vercel.app/setTime', ruleForm)
            console.log(data)
            ElMessage.success('成功')
            loading.close()
        } catch (err) {
            console.log(err)
            ElMessage.error(err?.response?.data?.message ?? '失敗')
            loading.close()
        }
      } 
    })
  }

  const route = useRoute()

  const reset = async () => {
      const loading = ElLoading.service({
      lock: true,
      customClass: 'spinner',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  try {
    
    await axios.get(`https://propartnerbe.vercel.app/reset?event=${ruleForm2.event}`)
    ElMessage.success('成功')
    loading.close()
  } catch(e) {
    ElMessage.error('失敗')
    loading.close()
  }

}

onMounted(async() => {
  const res1 = await axios.get('https://propartnerbe.vercel.app/getNum')
  ruleForm.num = res1.data.num
  const res2 = await axios.get('https://propartnerbe.vercel.app/getTime')
  ruleForm.time = res2.data.time
})


  </script>

  <style lang="scss" scoped>
.bg {
    background-color: #dbdbdb;
}</style>
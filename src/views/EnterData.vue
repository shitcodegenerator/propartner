<template>
  <div class="bg h-screen px-4 pt-[20vh]">
    <div
      class="bg-white shadow rounded-lg border flex flex-col items-center justify-center py-8 px-4"
    >
      <h1 v-if="!done" class="font-bold text-xl text-center mb-4 text-blue-700">
        {{ eventName }}<br />
        葡眾珍鑽經理贈車表揚大會<br />參加者基本資料（僅限個人參與）
      </h1>
      <el-form
        v-if="!done"
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="140px"
        label-position="left"
        class="demo-ruleForm"
      >
        <!-- <el-form-item label="場次" prop="event">
        <el-input disabled v-model="ruleForm.event"  autocomplete="off" />
      </el-form-item> -->
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手機號碼" prop="mobile">
          <el-input v-model="ruleForm.mobile" autocomplete="off" />
        </el-form-item>
        <el-form-item label="身分證字號" prop="userId">
          <el-input v-model="ruleForm.userId" autocomplete="off" />
        </el-form-item>
      </el-form>

      <div v-if="!done" class="flex flex-col gap-4 w-full">
        <el-button
          type="primary"
          style="margin: 0; height: 48px"
          @click="submitForm(ruleFormRef)"
          >送出</el-button
        >
        <el-button
          style="margin: 0; height: 48px"
          @click="resetForm(ruleFormRef)"
          >重置</el-button
        >
        <p class="text-gray-500" v-html="note"></p>
      </div>

      <div
        v-else
        class="text-green-500 flex flex-col items-center justify-center gap-10 font-bold text-4xl"
      >
        <CircleCheckFilled />
        <span>報名成功</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElLoading } from "element-plus";
import axios from "axios";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

const ruleFormRef = ref<FormInstance>();
const done = ref(false);

const eventName = computed(() => {
  if (ruleForm.event === 1) {
    return `8/9 台中 (中興大學) 場`;
  }

  if (ruleForm.event === 2) {
    return ` 8/30 高雄 (高雄展覽館) 場`;
  }

  if (ruleForm.event === 3) {
    return `9/27 林口 (林口體育館) 場`;
  }
});

const note = computed(() => {
  return `備註:<br>
得獎者請於當日公告時間內，攜帶有照證件至服務台領取獎品，逾期或資料錯誤，視同放棄得獎資格。`;
});

const ruleForm = reactive({
  name: "",
  userId: "",
  mobile: "",
  event: 1,
});

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [
    {
      required: true,
      message: "請輸入姓名以驗證中獎人身份",
      trigger: "change",
    },
  ],
  mobile: [
    {
      required: true,
      message: "請輸入電話以驗證中獎人身份",
      trigger: "change",
    },
  ],
  event: [{ required: true }],
  userId: [{ required: true, message: "請輸入身分證字號", trigger: "change" }],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const loading = ElLoading.service({
    lock: true,
    customClass: "spinner",
    background: "rgba(0, 0, 0, 0.7)",
  });
  formEl.validate(async (valid) => {
    if (!valid) {
      loading.close();
    }
    if (valid) {
      try {
        ruleForm.userId = ruleForm.userId.toUpperCase();
        const { data } = await axios.post(
          "https://propartnerbe.vercel.app/enroll",
          ruleForm
        );
        ElMessage.success("參加成功，每位來賓僅能參加一次");
        done.value = true;
        loading.close();
      } catch (err) {
        console.log(err);
        done.value = false;
        ElMessage.error(err?.response?.data?.message ?? "參加失敗");
        loading.close();
      }
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const route = useRoute();

onMounted(() => {
  if (route.query.event) {
    ruleForm.event = +route.query.event;
  }
});
</script>

<style lang="scss" scoped>
.bg {
  background-color: #fdfdfd;
  opacity: 1;
  background-image: linear-gradient(
    to right,
    #fff7ce,
    #fff7ce 6px,
    #fdfdfd 6px,
    #fdfdfd
  );
  background-size: 12px 100%;
}
</style>

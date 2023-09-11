<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { watch, ref, nextTick } from 'vue'
let layOutSettingStore = useLayOutSettingStore()
const flag = ref(true)
watch(
  () => layOutSettingStore.refsh,
  () => {
    //点击刷新按钮，路由组件销毁
    flag.value = false
    //获取更新后的dom
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" v-if="flag"></component>
    </transition>
  </router-view>
</template>

<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  translation: all 0.3s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>

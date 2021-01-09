<template>
  <div>
    <a-carousel autoplay>
      <div class="box"><h3>1</h3></div>
      <div class="box"><h3>2</h3></div>
      <div class="box"><h3>3</h3></div>
      <div class="box"><h3>4</h3></div>
    </a-carousel>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.box {
  width: 500px;
  height: 200px;
  border: 1px solid red;
  font-size: 28px;
  font-weight: bolder;
  line-height: 200px;
  text-align: center;
  background-color: aquamarine;
  user-select: none;
}
</style>

<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-09 19:48:29
 * @LastEditTime: 2021-01-12 14:32:53
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\home\index.vue
-->
<template>
  <div class="home-page">
    <div class="fav-pages-wrapper">
      <div class="fav-pages-title">
        <span>{{ $t('home.quickNav') }}</span>
        <svg
          t="1609309374556"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="3464"
          width="16"
          height="16"
        >
          <path
            d="M86.96201 729.043695a26.022285 26.022285 0 0 1 38.613713 0 27.701142 27.701142 0 0 1 0 38.613713L58.001725 835.231406a26.861714 26.861714 0 0 1-39.033427 0 27.701142 27.701142 0 0 1 0-38.613713z"
            fill="#4E8CEE"
            p-id="3465"
          ></path>
          <path
            d="M171.744294 597.673127c-3.357714 26.022285-3.357714 52.883999-5.876 78.906284l180.057424 180.477138c26.022285 0 52.464284-2.938 78.906283-6.295714a633.768555 633.768555 0 0 0 95.694855-19.306857 41.971427 41.971427 0 0 1 14.689999 0 46.16857 46.16857 0 0 1 44.489713 47.847427 306.39142 306.39142 0 0 1-23.084285 105.348283c-5.456286 11.752-10.912571 23.923714-17.627999 35.255999a182.155995 182.155995 0 0 0 76.807712 0 214.473994 214.473994 0 0 0 115.421426-57.500855v-2.098572a206.079709 206.079709 0 0 0 57.500855-106.187711 209.857137 209.857137 0 0 0-9.233714-121.297426 46.588284 46.588284 0 0 1 12.591428-49.945998l14.69-13.850571 11.752-11.752a679.097696 679.097696 0 0 0 177.119424-307.230849A685.39341 685.39341 0 0 0 1007.815129 16.788571a692.528553 692.528553 0 0 0-330.315135 6.715428 684.134268 684.134268 0 0 0-309.749134 178.378567l-13.011143 12.171714-13.011142 13.850571a45.329142 45.329142 0 0 1-51.624856 13.850571A209.857137 209.857137 0 0 0 168.386579 232.941422a204.400852 204.400852 0 0 0-105.348283 57.500856A216.99228 216.99228 0 0 0 4.698012 483.930559a280.78885 280.78885 0 0 1 37.774285-17.628 331.574277 331.574277 0 0 1 104.08914-23.503999 38.613713 38.613713 0 0 1 15.529428 0A45.329142 45.329142 0 0 1 192.310293 503.65713a713.514267 713.514267 0 0 0-20.565999 96.114568z"
            fill="#1296db"
            p-id="3466"
          ></path>
          <path
            d="M255.687149 897.349119a27.281428 27.281428 0 0 1 38.613713 38.613713l-68.833141 67.993713a26.441999 26.441999 0 0 1-37.774285 0 26.022285 26.022285 0 0 1 0-38.613713zM171.324579 812.566836a27.281428 27.281428 0 1 1 38.613714 39.033427L55.48344 1007.314259a27.281428 27.281428 0 0 1-38.193999 0 26.861714 26.861714 0 0 1 0-41.971427z"
            fill="#4E8CEE"
            p-id="3467"
          ></path>
          <path
            d="M878.962846 313.946277a170.403995 170.403995 0 1 1-169.984281-169.984281 167.88571 167.88571 0 0 1 169.984281 169.984281z"
            fill="#FFFFFF"
            p-id="3468"
          ></path>
          <path
            d="M708.978565 198.524852a115.001711 115.001711 0 1 0 115.421426 115.421425 115.001711 115.001711 0 0 0-115.421426-115.421425z"
            fill="#4E8CEE"
            p-id="3469"
          ></path>
        </svg>
      </div>
      <div class="fav-pages">
        <div
          class="fav-page-card"
          v-for="(item, idx) in favPages"
          :key="idx"
          @click="$router.push({ path: menuList.find(menu => menu.id == item.ifp_menu_id).mnu_path })"
        >
          <div class="fav-page-name" :title="`${$t(menuList.find(menu => menu.id == item.ifp_menu_id).mnu_code)}`">
            {{ `${$t(menuList.find(menu => menu.id == item.ifp_menu_id).mnu_code)}` }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      favPages: state => state.user.favPages,
      menuList: state => state.permission.addRouters
    })
  }
}
</script>

<style lang="less" scoped>
.fav-pages-wrapper {
  width: 22%;
  min-width: 160px;
  height: 100%;
  position: absolute;
  background-color: #f5f3f3;
  overflow: auto;

  .fav-pages-title {
    user-select: none;
    font-size: 18px;
    font-weight: bolder;
    text-align: center;
  }

  .fav-pages {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    .fav-page-card {
      border: 1px solid #e9e5e5;
      cursor: pointer;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      align-items: center;
      width: 80px;
      height: 60px;
      margin: 20px 0 0 0;
      transition: box-shadow 0.2s ease-in-out;
      position: relative;
      box-shadow: 18px 18px 30px rgba(0, 0, 0, 0.1), -18px -18px 30px rgba(255, 255, 255, 1);
      border-radius: 20px;
      word-break: break-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background-color: #efeeee;

      .fav-page-name {
        transition: width 0.2s ease-out;
        letter-spacing: 2px;
        font-weight: bold;
        user-select: none;
      }
    }

    .fav-page-card:hover {
      box-shadow: 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 rgba(255, 255, 255, 1), inset 18px 18px 30px rgba(0, 0, 0, 0.1),
        inset -18px -18px 30px rgba(255, 255, 255, 1);
      transition: box-shadow 0.2s ease-out;

      .fav-page-name {
        transition: box-shadow 0.2s ease-out;
      }
    }
  }
}
</style>

<template>
  <div class="e500">
    <svg height="500px" version="1.1" viewBox="0 0 837 1045" width="380px" xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Page-1" fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
        <path id="Polygon-1"
              d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z"
              stroke="#007FB2" stroke-width="6"/>
        <path id="Polygon-2"
              d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z"
              stroke="#EF4A5B" stroke-width="6"/>
        <path id="Polygon-3"
              d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z"
              stroke="#795D9C" stroke-width="6"/>
        <path id="Polygon-4"
              d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z"
              stroke="#F2773F" stroke-width="6"/>
        <path id="Polygon-5"
              d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z"
              stroke="#36B455" stroke-width="6"/>
      </g>
    </svg>
    <div class="message-box">
      <h1>500</h1>
      <p>{{ text.message }}</p>
      <div class="content">
        <p>{{ msg }}</p>
      </div>
      <div class="buttons-con">
        <div class="action-link-wrap">
          <a @click="goBack">{{ text.backButton }}</a>
          <a @click="goHome">{{ text.homeButton }}</a>
          <a @click="goLogin">{{ text.loginButton }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.e500 {
  background-color: #404040;
  width: 100%;
  height: 100%;
}

svg {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -250px;
  margin-left: -400px;
}

.message-box {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -100px;
  margin-left: 50px;
  color: #FFF;
  font-weight: 300;
}

.message-box h1 {
  font-size: 60px;
  line-height: 46px;
  margin-bottom: 40px;
  color: #fff;
  text-shadow: 0 0 80px #ffffff, 0 0 30px #008000, 0 0 6px #0000ff;
}

.message-box .content {
  overflow: auto;
  max-height: 200px
}

.buttons-con .action-link-wrap a {
  background: #fff;
  padding: 8px 25px;
  border-radius: 2px;
  color: #404040;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s linear;
  cursor: pointer;
  text-decoration: none;
  margin-right: 10px
}

.buttons-con .action-link-wrap a:hover {
  background: #ddd;
  color: #404040;
}

#Polygon-1,
#Polygon-2,
#Polygon-3,
#Polygon-4,
#Polygon-4,
#Polygon-5 {
  animation: float 1s infinite ease-in-out alternate;
}

#Polygon-2 {
  animation-delay: .2s;
}

#Polygon-3 {
  animation-delay: .4s;
}

#Polygon-4 {
  animation-delay: .6s;
}

#Polygon-5 {
  animation-delay: .8s;
}

@keyframes float {
  100% {
    transform: translateY(20px);
  }
}

@media (max-width: 450px) {
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -250px;
    margin-left: -190px;
  }

  .message-box {
    top: 50%;
    left: 50%;
    margin-top: -100px;
    margin-left: -190px;
    text-align: center;
  }
}
</style>
<script>
import {getRouteParams} from "@/libs/tools";

export default {
  name: 'E500',
  data() {
    return {
      text: {
        message: this.$i18n.t('errorPage.message500'),
        backButton: this.$i18n.t('errorPage.buttons.back'),
        homeButton: this.$i18n.t('errorPage.buttons.home'),
        loginButton: this.$i18n.t('errorPage.buttons.login')
      }
    }
  },
  computed: {
    msg() {
      const params = getRouteParams(this.$route)
      return params.msg
    }
  },
  methods: {
    goBack() {
      const params = getRouteParams(this.$route)
      if (params.redirect) {
        this.$router.replace(params.redirect)
      } else {
        this.goHome()
      }
    },
    goHome() {
      this.$api.redirectHome()
    },
    goLogin() {
      this.$api.redirectLogin()
    }
  }
}
</script>

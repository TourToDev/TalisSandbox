<template>
  <div class="bill-redpacket-wrapper">
    <div
      id="bill-redpacket"
      class="bill-redpacket"
      :class="{
        'bill-redpacket-smallphone': isSmallIphone()
      }"
    >
      <div
        v-show="contentVisible"
        id="bill-redpacket-container"
        ref="billRedpacketContainer"
        class="bill-redpacket-container"
        :class="{
          'animation-scale': withAnimationScale && !isSmallIphone(),
          'animation-scale-smallphone': withAnimationScale && isSmallIphone(),
          'animation-opacity-inversed': withInverseOpacityAnimation,
          'bill-redpacket-container-sharing': isInSharingMode
        }"
        @animationend="firstGroupEnded"
      >
        <div class="bill-redpacket-content">
          <div class="bill-redpacket-title">
            <img :src="titleUrl" alt="" />
          </div>
          <div class="bill-redpacket-cover">
            <img class="bill-redpacket-cover-img" :src="redpacketCoverUrl" alt="" />
            <img
              v-if="!isInSharingMode"
              src="https://u.thsi.cn/imgsrc/neican/963d75325ba2ae4cdb17e77a0f7c0217.png"
              class="bill-redpacket-logo"
              alt=""
            />
            <img
              v-if="!isInSharingMode"
              src="https://u.thsi.cn/imgsrc/neican/0716336f148e7911b3b63194673e0ed9.png"
              class="bill-redpacket-download"
              @click="downloadRedpacketCover"
            />
          </div>
          <div v-if="!isInSharingMode" class="bill-redpacket-share" @click="handleShareClick">
            分享祝福给好友
          </div>
          <div v-show="isInSharingMode" class="bill-redpacket-visitCard">
            <div class="bill-redpacket-visitCard-left">
              <img src="//u.thsi.cn/imgsrc/neican/f46cd1ff01db71cfb1d620083d2c6fa3.png" alt="" />
              <span>扫描右侧二维码 </span>
              <span>或同花顺APP搜索『年度报告』</span>
              <span>抽取你的专属新年福运</span>
            </div>
            <div class="bill-redpacket-visitCard-right">
              <div ref="redpacket-qrcode" class="bill-redpacket-visitCard-qrcode"></div>
            </div>
          </div>
        </div>
        <div v-show="!isInSharingMode && isFirstGroupEnded" class="bill-redpacket-footer">
          <div class="bill-redpacket-ghost" @click="handleSummaryClicked">
            查看盘点
          </div>
          <div class="bill-redpacket-gift" @click="handleGiftClicked">
            <span> 打开新年礼包 </span>
          </div>
        </div>
      </div>
      <van-dialog
        v-model="shareGuidanceDialogVisible"
        :show-confirm-button="false"
        :close-on-click-overlay="true"
        className="bill-redpacket-guidance-dialog"
        width="7.5rem"
      >
        <div class="bill-redpacket-guidance-content">
          <div class="bill-redpacket-guidance-content-inner">
            <span class="bill-redpacket-guidance-content-inner-title">
              分享年度报告后可打开
            </span>
            <div class="bill-redpacket-share" @click="handleShareClick({ location: 'dialog' })">
              立即分享
            </div>
          </div>
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script>
import { Dialog,Toast,showLoadingToast } from 'vant';
import 'vant/lib/index.css';
import { redpacketCoverList, titleImageUrlList } from './consts';
import { getBase64FromCanvas, jumpBy2804, saveImg, thsShareImg, accessRandomElement } from './utils';
const USER_SHARING_STATUS = `activity-annual-bill-share-2024-}`;
function isSmallIphone() {
  // const ratio = window.screen.width / window.screen.height;
  // // 此处判断小机型的方式不能处理特殊宽高比的机型
  // const minRatio = 0.47;
  // if (ratio >= minRatio) {
  //   return true;
  // }
  return false;
}

export default {
  name: 'BillRedpacket',
  components: { [Dialog.Component.name]: Dialog.Component },
  props: {
    summaryUrl: {
      type: String
    },
    giftUrl: {
      type: String
    },
    qrcodeTargetUrl: { type: String, default: '' },
    eventAndStat: { type: Function }
  },
  data() {
    return {
      isShared: JSON.parse(window.localStorage.getItem(USER_SHARING_STATUS)) || false,
      isInSharingMode: false,
      shareGuidanceDialogVisible: false,
      isFirstGroupEnded: false,
      withAnimationScale: true,
      withInverseOpacityAnimation: false,
      redpacketCoverUrl: null,
      titleUrl: null,
      contentVisible: true
    };
  },
  watch: {
    isInSharingMode(newVal) {
      if (newVal) {
        this.renderQrCode();
      }
    }
  },
  created() {
    const path = 'https://s.thsi.cn/js/mall/product/201811291552/qrcode.min.js';
    const fileref = document.createElement('script');
    fileref.setAttribute('type', 'text/javascript');
    fileref.setAttribute('src', path);
    document.getElementsByTagName('head')[0].appendChild(fileref);
    this.titleUrl = accessRandomElement(titleImageUrlList);
    this.redpacketCoverUrl = accessRandomElement(redpacketCoverList);
  },
  methods: {
    isSmallIphone,
    // 监听分享状态
    listenShareRes() {
      callNativeHandler('NotifyNativeEventToWeb', ''),
        registerWebHandler('NotifyNativeEventToWeb', data => {
          console.log('notify native event');
          console.log(data);
          if (!data.key.startsWith('share')) {
            console.log('not sharing notification');
            return;
          }
          this.isInSharingMode = false;
          if (data.key === 'share_1') {
            return;
          }
          console.log('successfully shared');
          this.isShared = true;
          window.localStorage.setItem(USER_SHARING_STATUS, true);
        });
    },
    downloadRedpacketCover() {
      this.eventAndStat('ypendpage.img.save');
      saveImg(this.redpacketCoverUrl);
    },
    handleSummaryClicked() {
      // if (!(this.summaryUrl && this.summaryUrl.length)) {
      //   Toast.info('未配置盘点链接');
      //   return;
      // }
      // showLoadingToast({
      //   message: 'Loading...',
      //   forbidClick: true,
      // });
      Toast('Heelo')
      this.eventAndStat('ypendpage.lbutton.click');
      jumpBy2804(this.summaryUrl);
    },
    handleGiftClicked() {
      if (!this.isShared) {
        this.eventAndStat('ypendpage.gift.click.fail');
        this.shareGuidanceDialogVisible = true;
        return;
      }
      if (!this.giftUrl.length) {
        Toast.info('未配置礼品链接');
        return;
      }
      this.eventAndStat('ypendpage.gift.click.succ');
      jumpBy2804(this.giftUrl);
    },
    async handleShareClick({ location = 'window' }) {
      const redpacketContainerDOM = this.$refs['billRedpacketContainer'];
      this.withInverseOpacityAnimation = true;
      if (location === 'dialog') {
        this.eventAndStat('ypendpage.share.window.click');
      } else {
        this.eventAndStat('ypendpage.share.click');
      }

      const opacityFinishedHandler = () => {
        console.log('opacity animation-ended');
        this.contentVisible = false;
        this.isInSharingMode = true;
        this.shareGuidanceDialogVisible = false;
        this.withAnimationScale = true;
        this.withInverseOpacityAnimation = false;
        const sharingAnimationEndedHandler = async e => {
          console.log('on the fly animation-ended');
          console.log(e);
          this.renderQrCode();
          this.withAnimationScale = false;
          setTimeout(async () => {
            const binaryStr = await getBase64FromCanvas({
              selector: '.bill-redpacket',
              isSmallScreen: isSmallIphone()
            });
            console.log('screenshot complete, calling the shareing protocol');
            //console.log('binarystr');
            //console.log(binaryStr);
            thsShareImg(binaryStr);
            this.listenShareRes();
          });
          redpacketContainerDOM.removeEventListener('animationend', sharingAnimationEndedHandler);
        };
        setTimeout(() => {
          this.contentVisible = true;
          redpacketContainerDOM.addEventListener('animationend', sharingAnimationEndedHandler);
        });
        redpacketContainerDOM.removeEventListener('animationend', opacityFinishedHandler);
      };
      redpacketContainerDOM.addEventListener('animationend', opacityFinishedHandler);
    },
    renderQrCode() {
      const qrcodeElm = this.$refs['redpacket-qrcode'];
      const qrcodeRect = qrcodeElm.getClientRects()[0];
      if (!(qrcodeElm && qrcodeRect)) {
        return;
      }
      const compensator = isSmallIphone() ? 1.2 : 1;
      if (!this.qrcodeTargetUrl.length) {
        Toast.info('未配置二维码调整页面链接');
        return;
      }
      const qrcodeConfig = {
        text: this.qrcodeTargetUrl,
        width: (qrcodeRect.width - 6) * compensator,
        height: (qrcodeRect.height - 6) * compensator,
        correctLevel: QRCode.CorrectLevel.M
      };
      if (qrcodeElm.childNodes[0]) {
        qrcodeElm.removeChild(qrcodeElm.childNodes[0]);
        qrcodeElm.removeChild(qrcodeElm.childNodes[0]);
      }

      new QRCode(qrcodeElm, qrcodeConfig);
    },
    firstGroupEnded() {
      console.log('animation ended callback');
      this.isFirstGroupEnded = true;
    }
  }
};
</script>

<style lang="less" scoped>
@keyframes transformer {
  from {
    opacity: 0;
    transform: scale(0.1);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes transformer-smallphone {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(0.82);
  }
}

@keyframes opacity-transformer {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes inversed-opacity-transformer {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.animation-scale {
  animation: transformer 0.8s ease-in-out;
}
.animation-scale-smallphone {
  animation: transformer-smallphone 0.8s ease-in-out !important;
}
.animation-opacity-inversed {
  animation: inversed-opacity-transformer 0.8s ease-in-out !important;
}

.bill-redpacket-wrapper {
  background-image: linear-gradient(-15deg, #fee9c9 0%, #ff5151 26%, #fd040e 100%);
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
}

.bill-redpacket {
  width: 100%;
  box-sizing: border-box;
  height: 100vh;
  padding-top: 1.76rem;
  background-image: linear-gradient(-15deg, #fee9c9 0%, #ff5151 26%, #fd040e 100%);
  background-size: cover;
  display: flex;
  justify-content: center;
  position: relative;
  * {
    box-sizing: border-box;
  }

  &-container {
    width: 7.5rem;
    height: 13.6rem;
    max-height: 100vh;
    border-radius: 5px;
    background-size: 100%;
    background-position-x: center;
    background-repeat: no-repeat;
    background-image: url('https://u.thsi.cn/imgsrc/neican/8d37c6b86b45178ef4f9cc5b2b8689be.png');

    &-sharing {
      background-image: url('http://u.thsi.cn/imgsrc/neican/d0bfb863352b759841670476a277ea44.png');
      background-size: 100%;
      .bill-redpacket-cover {
        height: 7.6rem;
      }
    }
  }

  &-content {
    padding-top: 0.9rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .bill-redpacket-title {
      width: 100%;
      img {
        width: 100%;
      }
    }
  }

  &-cover {
    width: 5.9rem;
    height: 7.2rem;
    overflow: hidden;
    border-radius: 6px;
    position: relative;
    margin-bottom: 0.24rem;
    &-img {
      width: 100%;
    }
  }

  &-share {
    width: 5.9rem;
    height: 1.09rem;
    background-image: url('https://u.thsi.cn/imgsrc/neican/a9ff5773fdcc711040f5c4232e2b445d.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.4rem;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
    font-weight: 600;
  }

  &-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.88rem;
    animation: opacity-transformer 0.5s ease-in 0s 1;
  }

  &-ghost {
    width: 2.7rem;
    height: 0.96rem;
    border: 1px solid #ffffff;
    border-radius: 8px;
    font-size: 18px;
    color: #fff9f7;
    letter-spacing: 0;
    text-align: center;
    font-weight: 400;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0.26rem;
  }

  &-gift {
    width: 4rem;
    height: 0.96rem;
    background-image: url('https://u.thsi.cn/imgsrc/neican/4ec900cc1ee3d640e8264bad6fc5b962.png');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    span {
      position: relative;
      left: 1.45rem;
      font-size: 18px;
      color: #ff2436;
      letter-spacing: 0;
      font-weight: 600;
    }
  }

  &-logo {
    width: 1.34rem;
    position: absolute;
    top: 0.2rem;
    right: 0.24rem;
  }

  &-download {
    width: 0.72rem;
    height: 0.72rem;
    position: absolute;
    bottom: 0.24rem;
    right: 0.24rem;
  }

  &-visitCard {
    display: flex;
    width: 5.9rem;
    justify-content: space-between;
    &-left {
      display: flex;
      flex-direction: column;

      img {
        display: block;
        width: 1.34rem;
        height: 0.32rem;
        margin-bottom: 0.12rem;
      }
      span {
        font-size: 14px;
        color: #030303;
        font-weight: 400;
        margin-bottom: 4px;
      }
    }
    &-qrcode {
      width: 1.6rem;
      height: 1.6rem;
      padding: 3px;
      background-color: #fff;
      border-radius: 2px;
    }
  }
}

.bill-redpacket-smallphone {
  height: 100vh;
  padding-top: 0;
  .bill-redpacket-container {
    transform: scale(0.82);
    max-height: unset;
    &-sharing {
    }
  }
}
</style>
<style lang="less">
.bill-redpacket-guidance {
  &-dialog {
    background-color: transparent !important;
  }
  &-content {
    width: 7.5rem;
    height: 6.36rem;
    display: flex;
    background-position-x: center;
    background-size: contain;
    background-repeat: no-repeat;
    justify-content: center;
    align-items: center;
    background-image: url('https://u.thsi.cn/imgsrc/neican/b972d0aceb093f3eb2b1354d14ad17fc.png');

    &-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      top: 0.36rem;
      &-title {
        font-size: 0.44rem;
        color: rgba(0, 0, 0, 0.84);
        letter-spacing: 0;
        text-align: center;
        font-weight: 600;
        margin-bottom: 0.4rem;
      }
      .bill-redpacket-share {
        width: 4.28rem;
        height: 1.06rem;
        background-image: url('https://u.thsi.cn/imgsrc/neican/caaaa1738815888d5da68236d577a65b.png');
        font-size: 0.4rem;
        color: #ffffff;
        letter-spacing: 0;
        text-align: center;
        font-weight: 600;
      }
    }
  }
}
</style>

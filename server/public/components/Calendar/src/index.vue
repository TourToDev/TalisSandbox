<template>
  <div>
    <a-button type="primary" loading>
      Loading12121212
    </a-button>
    <a-button type="primary" size="small" loading>
      Loading
    </a-button>
    <br />
    <a-button type="primary" :loading="loading" @mouseenter="enterLoading">
      mouseenter me!
    </a-button>
    <a-button type="primary" icon="poweroff" :loading="iconLoading" @click="enterIconLoading">
      延迟1s
    </a-button>
    <br />
    <a-button type="primary" loading />
    <a-button type="primary" shape="circle" loading />
    <a-button type="danger" shape="round" loading />
    
      <a-timeline mode="alternate">
    <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
    <a-timeline-item color="green">
      Solve initial network problems 2015-09-01
    </a-timeline-item>
    <a-timeline-item>
      <a-icon slot="dot" type="clock-circle-o" style="font-size: 16px;" />
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
      laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
      beatae vitae dicta sunt explicabo.
    </a-timeline-item>
    <a-timeline-item color="red">
      Network problems being solved 2015-09-01
    </a-timeline-item>
    <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
    <a-timeline-item>
      <a-icon slot="dot" type="clock-circle-o" style="font-size: 16px;" />
      Technical testing 2015-09-01
    </a-timeline-item>
  </a-timeline>
  </div>
</template>

<script>
import { Button, Timeline as ATimeline, Icon as AIcon} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
export default {
  name: 'Calendar',
    components: {
        AButton: Button,
        ATimeline,
        ATimelineItem: ATimeline.Item
    },
  data() {
    return {
      loading: false,
      iconLoading: false,
    };
  },
  methods: {
    enterLoading() {
      this.loading = true;
    },
    enterIconLoading() {
      this.iconLoading = { delay: 1000 };
    },
  },
};
</script>
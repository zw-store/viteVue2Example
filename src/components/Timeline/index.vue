<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-10-08
 -->

<template>
  <div class="timeline" :class="`timeline-${layout} timeline-${align}`">
    <div v-for="(item, index) of value" :key="index" class="timeline-event">
      <div class="timeline-event-opposite">
        <slot name="opposite" :item="item" :index="index"></slot>
      </div>

      <div class="timeline-event-separator">
        <slot name="marker" :item="item" :index="index">
          <div class="timeline-event-marker"></div>
        </slot>

        <slot v-if="index !== value.length - 1" name="connector" :item="item" :index="index">
          <div class="timeline-event-connector"></div>
        </slot>
      </div>

      <div class="timeline-event-content">
        <slot name="content" :item="item" :index="index"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Timeline',
  props: {
    value: null,
    align: { type: String, default: 'left', validator: value => ['left', 'right', 'alternate', 'top', 'bottom'].includes(value) },
    layout: { type: String, default: 'vertical' },
  },
}
</script>

<style lang="scss" scoped>
.timeline {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

.timeline-left .timeline-event-opposite {
  text-align: right;
}

.timeline-left .timeline-event-content {
  text-align: left;
}

.timeline-right .timeline-event {
  flex-direction: row-reverse;
}

.timeline-right .timeline-event-opposite {
  text-align: left;
}

.timeline-right .timeline-event-content {
  text-align: right;
}

.timeline-vertical.timeline-alternate .timeline-event:nth-child(even) {
  flex-direction: row-reverse;
}

.timeline-vertical.timeline-alternate .timeline-event:nth-child(odd) .timeline-event-opposite {
  text-align: right;
}

.timeline-vertical.timeline-alternate .timeline-event:nth-child(odd) .timeline-event-content {
  text-align: left;
}

.timeline-vertical.timeline-alternate .timeline-event:nth-child(even) .timeline-event-opposite {
  text-align: left;
}

.timeline-vertical.timeline-alternate .timeline-event:nth-child(even) .timeline-event-content {
  text-align: right;
}

.timeline-vertical .timeline-event-opposite,
.timeline-vertical .timeline-event-content {
  padding: 0px 1rem;
}

.timeline-vertical .timeline-event-connector {
  width: 2px;
}

.timeline-event {
  display: flex;
  position: relative;
  min-height: 5rem;
}

.timeline-event:last-child {
  min-height: 0;
}

.timeline-event-opposite {
  flex: 1;
}

.timeline-event-content {
  flex: 1;
}

.timeline-event-separator {
  flex: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.timeline-event-marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  align-self: baseline;
  border-width: 2px;
  border-style: solid;
  border-color: #e2e8f0;
  border-radius: 50%;
  width: 1.125rem;
  height: 1.125rem;
  background: #fff;
}

.timeline-event-marker::before {
  content: ' ';
  border-radius: 50%;
  width: 0.375rem;
  height: 0.375rem;
  background: #020617;
}

.timeline-event-marker::after {
  content: ' ';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow:
    0px 0.5px 0px 0px rgba(0, 0, 0, 0.06),
    0px 1px 1px 0px rgba(0, 0, 0, 0.12);
}

.timeline-event-connector {
  flex-grow: 1;
  background: #e2e8f0;
}

.timeline-horizontal {
  flex-direction: row;
}

.timeline-horizontal .timeline-event {
  flex-direction: column;
  flex: 1;
}

.timeline-horizontal .timeline-event:last-child {
  flex: 0;
}
.timeline-horizontal .timeline-event:last-child .timeline-event-opposite {
  flex: 0;
}

.timeline-horizontal .timeline-event-separator {
  flex-direction: row;
}

.timeline-horizontal .timeline-event-connector {
  width: 100%;
  height: 2px;
}

.timeline-horizontal .timeline-event-opposite,
.timeline-horizontal .timeline-event-content {
  padding: 1rem 0px;
}

.timeline-horizontal.timeline-alternate .timeline-event:nth-child(even) {
  flex-direction: column-reverse;
}

.timeline-bottom .timeline-event {
  flex-direction: column-reverse;
}
</style>

<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-19
 -->

<template>
  <div ref="calendar" class="h-full"></div>
</template>

<script>
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
// import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import multiMonthPlugin from '@fullcalendar/multimonth'

export default {
  name: 'index',
  data() {
    return {
      events: [
        {
          title: 'Meeting',
          start: '2024-08-12T14:30:00',
          extendedProps: {
            status: 'done',
          },
        },
        {
          title: 'Birthday Party',
          start: '2024-08-13T07:00:00',
          backgroundColor: 'green',
          borderColor: 'green',
        },
      ],
    }
  },

  mounted() {
    const calendar = new Calendar(this.$refs.calendar, {
      plugins: [
        dayGridPlugin, // 天
        timeGridPlugin,
        multiMonthPlugin, // 月
        listPlugin,
      ],
      initialView: 'multiMonthYear',
      locale: 'cn',
      timeZone: 'UTC',
      firstDay: 1,
      events: this.events,
      ventDidMount: function (info) {
        if (info.event.extendedProps.status === 'done') {
          // Change background color of row
          info.el.style.backgroundColor = 'red'

          // Change color of dot marker
          var dotEl = info.el.getElementsByClassName('fc-event-dot')[0]
          if (dotEl) {
            dotEl.style.backgroundColor = 'white'
          }
        }
      },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'multiMonthYear,dayGridMonth timeGridWeek,timeGridDay listWeek',
      },
      showNonCurrentDates: true,
      // multiMonthMaxColumns: 1,
      views: {
        multiMonthFourMonth: {
          type: 'multiMonth',
          duration: { months: 3 },
        },
        dayGridFourWeek: {
          type: 'dayGrid',
          duration: { weeks: 4 },
          monthStartFormat: { month: 'numeric', year: 'numeric' },
        },
      },
    })
    calendar.render()
  },

  methods: {},
  //  End
}
</script>

<style lang="css" scoped></style>

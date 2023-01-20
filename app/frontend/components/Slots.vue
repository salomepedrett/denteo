<template>
  <div>
    Hello World from Vue-Router
    <br />
    <br />
    <Slot v-for="slot in slots" :slot="slot" />
  </div>
</template>

<script>

import Slot from "./Slot.vue"

export default {
  name: "Slots",
  data() {
    return {
      slots: [
        { start: 1, stop: 2 },
        { start: 5, stop: 7 },
        { start: 9, stop: 12 }
      ]
    }
  },
  components: {
    Slot
  }
}

</script>

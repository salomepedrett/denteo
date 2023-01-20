<template>
  <div>
    {{ slot.start }} - {{ slot.stop }}
  </div>
</template>

<script>

export default {
  props: ["slot"]
}

</script>

<template>
  <div>
    {{ slot.from.toISO() }} - {{ slot.to.toISO() }}
  </div>
</template>

<script>

export default {
  props: ["slot"]
}

</script>

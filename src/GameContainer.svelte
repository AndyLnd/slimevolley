<script>
  export let width = 800;
  export let height = 600;
</script>

<style>
  svg {
    background-color: rgb(116, 116, 240);
  }
</style>

<svg viewbox="0 0 {width} {height}" {width} {height}>
  <slot />
</svg>

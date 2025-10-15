<script lang="ts">
  const { title } = $props();
</script>

<h2>{title}</h2>

<style>
  h2 {
    margin-bottom: 2rem;
    font-size: 2rem;
    color: var(--text-secondary);
    text-transform: capitalize;
  }
</style>

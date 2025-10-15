<script lang="ts">
  import { cubicOut } from "svelte/easing";
  import { fly } from "svelte/transition";

  const { title, value, delay } = $props();
</script>

<div
  in:fly|global={{
    duration: 500,
    x: -20,
    delay: delay * 150,
    easing: cubicOut,
  }}
  class="stat-card"
>
  <h3>{title}</h3>
  <p class="stat-number">{value}</p>
</div>

<style type="scss">
  .stat-card {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: 8px;
    border-left: 2px solid #007bff;

    h3 {
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
    }

    .stat-number {
      color: var(--text-primary);
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
    }
  }
</style>

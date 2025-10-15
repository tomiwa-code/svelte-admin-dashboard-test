<script lang="ts">
  import { alerts } from "../../stores/alerts.store";
  import AlertUi from "./alert-ui.svelte";
</script>

<div class="alert-container">
  {#each $alerts as item (item.id)}
    <AlertUi
      message={item.message}
      type={item.type}
      duration={item.duration}
      isVisible={true}
      onclose={() => alerts.remove(item.id)}
    />
  {/each}
</div>

<style type="scss">
  .alert-container {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 10000; /* Very high to ensure it's above everything */
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    pointer-events: none;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .alert-container {
      bottom: 0.5rem;
      right: 0.5rem;
      left: 0.5rem;
      align-items: stretch;
    }
  }
</style>

<script>
  import SectionTitle from "./section-title.svelte";
</script>

<div class="page">
  <SectionTitle title="Page Not Found" />
  <p>The requested page doesn't exist.</p>
</div>

<style type="scss">
  .page {
    p {
      color: #6c757d;
      line-height: 1.6;
    }
  }
</style>

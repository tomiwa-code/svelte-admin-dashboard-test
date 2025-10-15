<script lang="ts">
  import Analytics from "./analytics/analytics-wrapper.svelte";
  import DashboardWrapper from "./dashboard/dashboard-wrapper.svelte";
  import PageNotFound from "./page-not-found.svelte";
  import Setting from "./settings/settings-wrapper.svelte";
  import UserWrapper from "./users/user-wrapper.svelte";

  const { currentPage, isSidebarCollapsed } = $props();
  const contentPadding = $derived(isSidebarCollapsed ? "2rem 1rem" : "2rem");
</script>

<main class="content {isSidebarCollapsed ? 'expanded' : ''}">
  <div class="content-inner" style="padding: {contentPadding}">
    {#if currentPage === "dashboard"}
      <DashboardWrapper />
    {:else if currentPage === "users"}
      <UserWrapper />
    {:else if currentPage === "settings"}
      <Setting />
    {:else if currentPage === "analytics"}
      <Analytics />
    {:else}
      <PageNotFound />
    {/if}
  </div>
</main>

<style>
  .content {
    flex: 1;
    overflow-y: auto;
    transition: margin-left 0.3s ease;
  }

  .content-inner {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>

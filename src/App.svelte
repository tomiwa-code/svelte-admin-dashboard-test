<script lang="ts">
  import AlertWrapper from "./lib/components/alert/alert-wrapper.svelte";
  import ContentArea from "./lib/components/content-area.svelte";
  import Header from "./lib/components/header.svelte";
  import Sidenav from "./lib/components/sidebar/sidenav.svelte";
  import { theme } from "./lib/stores/themes.store";

  let currentPage = $state("dashboard");
  let isSidebarCollapsed = $state(false);

  const handleNavigation = (page: string) => {
    currentPage = page;
  };

  const toggleSidebar = () => {
    isSidebarCollapsed = !isSidebarCollapsed;
  };

  $effect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", $theme);
    }
  });
</script>

<main>
  <div class="app">
    <Sidenav {currentPage} {isSidebarCollapsed} onNavigate={handleNavigation} />

    <div class="main-layout">
      <Header onToggleSidebar={toggleSidebar} />
      <ContentArea {currentPage} {isSidebarCollapsed} />
    </div>
  </div>

  <AlertWrapper />
</main>



<style>
  .app {
    height: 100vh;
    display: flex;
    flex-direction: row;
    background-color: var(--bg-tertiary);
  }

  .main-layout {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
  }
</style>

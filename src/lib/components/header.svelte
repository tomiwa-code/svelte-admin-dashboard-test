<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { theme } from "../stores/themes.store";

  const { onToggleSidebar } = $props();
  let currentTime = $state(new Date().toLocaleTimeString());
  let intervalId: number;

  onMount(() => {
    intervalId = setInterval(() => {
      currentTime = new Date().toLocaleTimeString();
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });

  const toggleTheme = () => {
    theme.toggleTheme();
  };
</script>

<header class="header">
  <div class="header-left">
    <button class="menu-btn" onclick={onToggleSidebar}> ☰ </button>
  </div>

  <div class="header-right">
    <span class="time">{currentTime}</span>

    <!-- Theme Toggle Button -->
    <button
      class={`theme-toggle ${$theme === "dark" ? "dark" : "light"}`}
      onclick={toggleTheme}
    >
      <span></span>
      {#if $theme === "light"}
        🌙 Dark Mode
      {:else}
        ☀️ Light Mode
      {/if}
    </button>

    <div class={`user-info ${$theme === "dark" ? "dark" : "light"}`}>
      <span>Welcome, Admin</span>
    </div>
  </div>
</header>

<style type="scss">
  .header {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .menu-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .menu-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .time {
    font-weight: 500;
  }

  .theme-toggle {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-secondary);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &.dark {
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    &.light {
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  .theme-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  .user-info {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 500;
    backdrop-filter: blur(10px);

    &.dark {
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    &.light {
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  @media (max-width: 768px) {
    .header {
      padding: 1rem;
    }

    .header-right {
      gap: 1rem;
    }

    .theme-toggle {
      padding: 0.5rem;
    }
  }
</style>

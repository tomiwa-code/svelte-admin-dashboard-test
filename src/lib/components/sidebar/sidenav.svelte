<script>
  const { currentPage, isSidebarCollapsed, onNavigate } = $props();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "settings", label: "Settings", icon: "⚙️" },
    { id: "analytics", label: "Analytics", icon: "📈" },
  ];
</script>

<aside class="sidebar {isSidebarCollapsed ? 'collapsed' : ''}">
  <nav class="nav">
    <ul class="nav-list">
      <li class="logo">
        <span>
          {isSidebarCollapsed ? "UH" : "UserHub"}
        </span>
      </li>

      {#each menuItems as item}
        <li class="nav-item">
          <button
            class="nav-link {currentPage === item.id ? 'active' : ''}"
            onclick={() => onNavigate(item.id)}
          >
            <span class="nav-icon">{item.icon}</span>
            {#if !isSidebarCollapsed}
              <span class="nav-label">{item.label}</span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  </nav>

  {#if !isSidebarCollapsed}
    <div class="sidebar-footer">
      <div class="status-indicator">
        <div class="status-dot"></div>
        <span>System Online</span>
      </div>
    </div>
  {/if}
</aside>

<style type="scss">
  .sidebar {
    width: 250px;
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease;
    border-right: 1px solid var(--border-color);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);

    &.collapsed {
      width: 70px;

      .nav-label {
        display: none;
      }
    }

    .logo {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--accent-color);
      }
    }

    .nav {
      flex: 1;
      padding: 1rem 0;
    }

    .nav-list {
      list-style: none;
      padding: 0;
    }

    .nav-item {
      margin-bottom: 0.25rem;
    }

    .nav-link {
      width: 100%;
      background: none;
      border: none;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.3s;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 0;

      &:hover {
        background-color: var(--bg-tertiary);
        color: var(--text-secondary);
      }

      &.active {
        background-color: var(--bg-tertiary);
        color: var(--text-primary);
        border-right: 3px solid var(--accent-color);
      }
    }

    .nav-icon {
      font-size: 1.25rem;
      min-width: 24px;
    }

    .nav-label {
      font-weight: 500;
      white-space: nowrap;
    }

    .sidebar-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border-color);

      .status-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: #28a745;

        .status-dot {
          width: 8px;
          height: 8px;
          background-color: #28a745;
          border-radius: 50%;
        }
      }
    }
  }
</style>

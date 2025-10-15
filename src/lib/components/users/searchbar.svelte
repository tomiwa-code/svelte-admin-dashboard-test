<script>
  let { value = $bindable(), placeholder = "Search..." } = $props();

  let searchId = `search-${Math.random().toString(36).slice(2, 15)}`;
</script>

<div class="search-bar">
  <label for={searchId} class="sr-only">Search</label>
  <div class="search-input-wrapper">
    <span class="search-icon">🔍</span>
    <input
      id={searchId}
      type="text"
      class="search-input"
      bind:value
      {placeholder}
    />
    {#if value}
      <button
        class="clear-btn"
        onclick={() => (value = "")}
        title="Clear search"
      >
        &times;
      </button>
    {/if}
  </div>
</div>

<style type="scss">
  .search-bar {
    width: 100%;
    margin-bottom: 1.5rem;

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      .search-icon {
        position: absolute;
        left: 0.75rem;
        color: var(--text-secondary);
        pointer-events: none;
      }

      .search-input {
        width: 100%;
        padding: 0.75rem 2.5rem 0.75rem 2.5rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.2s ease;

        &:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        &::placeholder {
          color: var(--text-muted);
        }
      }

      .clear-btn {
        position: absolute;
        right: 0.75rem;
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        font-size: 1.25rem;
        transition: color 0.2s ease;

        &:hover {
          color: var(--text-primary);
          background: var(--bg-tertiary);
        }
      }
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  }
</style>

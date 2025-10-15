<script lang="ts">
  import { fly } from "svelte/transition";
  import type { AlertTypeType } from "../../types/alert.type";
  import { onMount } from "svelte";

  let { message, type = "default", duration, isVisible, onclose } = $props();

  let timer = $state(0);
  let progress = $state(100);
  let startTime = $state(0);

  // Start progress bar animation
  const startProgressBar = () => {
    if (duration > 0) {
      startTime = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        progress = Math.max(0, 100 - (elapsed / duration) * 100);

        if (progress > 0) {
          requestAnimationFrame(updateProgress);
        }
      };
      requestAnimationFrame(updateProgress);
    }
  };

  // Auto-dismiss after duration
  onMount(() => {
    if (isVisible && duration > 0) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleClose();
      }, duration);

      startProgressBar();
    }
  });

  const handleClose = () => {
    clearTimeout(timer);
    isVisible = false;
    // Wait for exit animation to complete before removing
    setTimeout(() => {
      onclose();
    }, 300);
  };

  const getIcon = () => {
    const icons = {
      success: "✅",
      error: "❌",
      default: "ℹ️",
    };
    return icons[type as AlertTypeType] || icons.default;
  };

  const getTitle = () => {
    const titles = {
      success: "Success",
      error: "Error",
      default: "Information",
    };
    return titles[type as AlertTypeType] || titles.default;
  };

  // Pause timer on hover
  const handleMouseEnter = () => {
    clearTimeout(timer);
  };

  const handleMouseLeave = () => {
    if (duration > 0) {
      timer = setTimeout(
        () => {
          handleClose();
        },
        duration * (progress / 100)
      );
    }
  };
</script>

{#if isVisible}
  <div
    class="alert alert-{type}"
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    role="alert"
    aria-live="polite"
    transition:fly={{ y: 100, x: 100, duration: 400 }}
  >
    <div class="alert-content">
      <div class="alert-icon">{getIcon()}</div>

      <div class="alert-body">
        <div class="alert-title">{getTitle()}</div>
        <div class="alert-message">{message}</div>
      </div>

      <button
        class="alert-close"
        onclick={handleClose}
        title="Dismiss notification"
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>

    <!-- Progress Bar -->
    {#if duration > 0}
      <div class="alert-progress">
        <div class="alert-progress-bar" style="width: {progress}%"></div>
      </div>
    {/if}
  </div>
{/if}

<style type="scss">
  .alert {
    position: relative;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    margin-bottom: 0.75rem;
    min-width: 300px;
    max-width: 400px;
    overflow: hidden;
    border-left: 4px solid;

    .alert-content {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
    }

    .alert-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    .alert-body {
      flex: 1;
      min-width: 0; /* Allow text truncation */
    }

    .alert-title {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .alert-message {
      color: var(--text-primary);
      font-size: 0.875rem;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .alert-close {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      font-size: 1.25rem;
      line-height: 1;
      transition: all 0.2s ease;
      flex-shrink: 0;
      margin-top: -0.25rem;
      margin-right: -0.25rem;
    }

    .alert-close:hover {
      color: var(--text-primary);
      background: var(--bg-tertiary);
    }

    /* Progress Bar */
    .alert-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: var(--bg-tertiary);
    }

    .alert-progress-bar {
      height: 100%;
      transition: width 0.1s linear;
      border-radius: 0 2px 2px 0;
    }

    /* Type-specific styles */
    &.alert-success {
      border-left-color: var(--success-color);
      background: var(--bg-secondary);

      .alert-progress-bar {
        background: var(--success-color);
      }

      .alert-title {
        color: var(--success-color);
      }
    }

    &.alert-error {
      border-left-color: var(--danger-color);
      background: var(--bg-secondary);

      .alert-progress-bar {
        background: var(--danger-color);
      }

      .alert-title {
        color: var(--danger-color);
      }
    }

    &.alert-default {
      border-left-color: var(--accent-color);
      background: var(--bg-secondary);

      .alert-progress-bar {
        background: var(--accent-color);
      }

      .alert-title {
        color: var(--accent-color);
      }
    }

    /* Animation for new alerts */
    &.alert {
      animation: slideInUp 0.4s ease-out;
    }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(100%) translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0) translateX(0);
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .alert {
      min-width: 280px;
      max-width: calc(100vw - 2rem);
      margin-left: 1rem;
      margin-right: 1rem;
    }
  }

  @media (max-width: 480px) {
    .alert {
      min-width: 250px;
    }

    .alert-content {
      padding: 0.75rem;
    }

    .alert-icon {
      font-size: 1.125rem;
    }
  }
</style>

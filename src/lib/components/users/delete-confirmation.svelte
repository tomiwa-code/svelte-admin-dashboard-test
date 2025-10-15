<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { users } from "../../stores/users.store";
  import { alerts } from "../../stores/alerts.store";

  const { user, oncancel } = $props();
  let isDeleting = $state(false);

  const handleConfirm = () => {
    isDeleting = true;
    // Small delay to show loading state
    setTimeout(() => {
      users.deleteUser(user.id);
      alerts.success(`User ${user?.name} has been deleted.`);
      handleCancel();
      isDeleting = false;
    }, 500);
  };

  const handleCancel = () => {
    oncancel();
  };

  const handleBackdropClick = (event: Event) => {
    if (event.target === event.currentTarget && !isDeleting) {
      handleCancel();
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && !isDeleting) {
      handleCancel();
    }
  };
</script>

<div
  class="modal-overlay"
  onclick={handleBackdropClick}
  role="button"
  tabindex="0"
  onkeydown={handleKeydown}
  transition:fade
>
  <div class="delete-modal" transition:scale={{ duration: 300 }}>
    {#if isDeleting}
      <!-- Loading State -->
      <div class="loading-state">
        <div class="spinner"></div>
        <h3>Deleting User</h3>
        <p>Please wait while we remove {user?.name} from the system...</p>
      </div>
    {:else}
      <!-- Confirmation State -->
      <div class="confirmation-state">
        <div class="warning-icon">⚠️</div>

        <div class="content">
          <h3>Delete User</h3>
          <p class="warning-text">
            Are you sure you want to delete <strong>{user?.name}</strong>? This
            action cannot be undone.
          </p>

          <div class="user-details">
            <div class="detail-item">
              <span class="label">Email:</span>
              <span class="value">{user?.email}</span>
            </div>
            <div class="detail-item">
              <span class="label">Role:</span>
              <span class="value">{user?.role}</span>
            </div>
            <div class="detail-item">
              <span class="label">Join Date:</span>
              <span class="value">
                {user?.joinDate
                  ? new Date(user.joinDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          <div class="consequences">
            <h4>This will permanently:</h4>
            <ul>
              <li>Remove user account and all associated data</li>
              <li>Revoke all system access immediately</li>
              <li>Delete user profile and preferences</li>
            </ul>
          </div>
        </div>

        <div class="actions">
          <button
            class="btn btn-secondary"
            onclick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            class="btn btn-danger"
            onclick={handleConfirm}
            disabled={isDeleting}
          >
            🗑️ Delete User
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style type="scss">
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001; /* Higher than other modals */
    padding: 1rem;
    backdrop-filter: blur(4px);

    .delete-modal {
      background: var(--bg-secondary);
      border-radius: 12px;
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      border: 1px solid var(--border-color);

      .loading-state {
        padding: 3rem 2rem;
        text-align: center;
        color: var(--text-primary);

        h3 {
          margin: 1.5rem 0 0.5rem 0;
          color: var(--text-primary);
        }

        p {
          color: var(--text-secondary);
          margin: 0;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid var(--bg-tertiary);
          border-top: 3px solid var(--danger-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
      }

      .confirmation-state {
        padding: 2rem;

        .warning-icon {
          font-size: 3rem;
          text-align: center;
          margin-bottom: 1rem;
          animation: pulse 2s infinite;
        }

        .content {
          h3 {
            color: var(--text-primary);
            margin: 0 0 1rem 0;
            text-align: center;
            font-size: 1.5rem;
          }

          .warning-text {
            text-align: center;
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            line-height: 1.6;

            strong {
              color: var(--text-primary);
            }
          }

          .user-details {
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;

            .detail-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0.5rem 0;
              border-bottom: 1px solid var(--border-color);

              &:last-child {
                border-bottom: none;
              }

              .label {
                font-weight: 600;
                color: var(--text-secondary);
              }

              .value {
                color: var(--text-primary);
                font-weight: 500;
              }
            }
          }

          .consequences {
            background: rgba(220, 53, 69, 0.05);
            border: 1px solid rgba(220, 53, 69, 0.2);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;

            h4 {
              color: var(--danger-color);
              margin: 0 0 0.75rem 0;
              font-size: 1rem;
            }

            ul {
              margin: 0;
              padding-left: 1.25rem;
              color: var(--text-secondary);
            }

            li {
              margin-bottom: 0.5rem;
              line-height: 1.4;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
      }

      .actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        &.btn-secondary {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-primary);

          &:hover:not(:disabled) {
            background: var(--bg-tertiary);
          }
        }

        &.btn-danger {
          background: var(--danger-color);
          color: white;

          &:hover:not(:disabled) {
            background: #c82333;
            transform: translateY(-1px);
          }
        }
      }
    }
  }

  /* Animations */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .delete-modal {
      margin: 1rem;
      max-height: calc(100vh - 2rem);
    }

    .confirmation-state {
      padding: 1.5rem;
    }

    .actions {
      flex-direction: column-reverse;
    }

    .btn {
      justify-content: center;
    }

    .user-details {
      padding: 1rem;
    }

    .detail-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }
  }

  @media (max-width: 480px) {
    .confirmation-state {
      padding: 1rem;
    }

    .warning-icon {
      font-size: 2.5rem;
    }

    .content h3 {
      font-size: 1.25rem;
    }
  }
</style>

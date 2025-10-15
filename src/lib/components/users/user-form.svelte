<script lang="ts">
  import { onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { users } from "../../stores/users.store";
  import type { UserType } from "../../types/user.type";
  import { alerts } from "../../stores/alerts.store";

  const { user = null, mode = "add", onclose } = $props();

  const initialData: UserType = {
    id: "",
    avatar: "",
    name: "",
    email: "",
    role: "User",
    joinDate: "",
  };

  let formData = $state(initialData);

  let errors = $state<{ [key: string]: string }>({});
  let isSubmitting = $state(false);

  // Initialize form when user changes
  onMount(() => {
    if (user) {
      formData = {
        name: user.name,
        email: user.email,
        role: user.role,
        id: user.id,
        avatar: user.avatar,
        joinDate: user.joinDate,
      };
    } else if (mode === "add") {
      formData = initialData;
    }
  });

  const handleClose = () => {
    onclose();
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    // Validate form
    errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      return;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      return;
    }

    if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
      return;
    }

    if (!formData.role) {
      errors.role = "Role is required";
      return;
    }

    // Check for duplicate email (excluding current user in edit mode)
    if (!errors.email) {
      const duplicate = $users.find(
        (u) =>
          u.email.toLowerCase() === formData.email.toLowerCase() &&
          u.id !== user?.id
      );
      if (duplicate) {
        errors.email = "This email is already registered";
      }
    }

    if (Object.keys(errors).length > 0) {
      return;
    }

    isSubmitting = true;

    try {
      if (mode === "add") {
        users.addUser(formData);
        alerts.success(`${formData.name} has been added successfully.`);
      } else {
        users.updateUser(formData);
        alerts.success(`${formData.name} has been updated successfully.`);
      }

      // Success - close form
      setTimeout(() => {
        handleClose();
      }, 300);
    } catch (error) {
      console.error("Error saving user:", error);
      errors.submit = "Failed to save user. Please try again.";
    } finally {
      isSubmitting = false;
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBackdropClick = (event: Event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      handleClose();
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && !isSubmitting) {
      handleClose();
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
  <div class="modal" transition:scale={{ duration: 300 }}>
    <div class="modal-header">
      <h2>{mode === "add" ? "Add New User" : "Edit User"}</h2>
      <button class="close-btn" onclick={handleClose} title="Close">
        &times;
      </button>
    </div>

    <div class="modal-body">
      <form onsubmit={handleSubmit}>
        <div class="form-group">
          <label for="name" class="form-label">Full Name *</label>
          <input
            id="name"
            type="text"
            class="form-control {errors.name ? 'error' : ''}"
            bind:value={formData.name}
            placeholder="Enter full name"
          />

          {#if errors.name}
            <div class="error-message">{errors.name}</div>
          {/if}
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email Address *</label>
          <input
            id="email"
            type="email"
            class="form-control {errors.email ? 'error' : ''}"
            bind:value={formData.email}
            placeholder="Enter email address"
          />

          {#if errors.email}
            <div class="error-message">{errors.email}</div>
          {/if}
        </div>

        <div class="form-group">
          <label for="role" class="form-label">Role *</label>
          <select
            id="role"
            class="form-control {errors.role ? 'error' : ''}"
            bind:value={formData.role}
          >
            <option value="">Select a role</option>
            <option value="User">User</option>
            <option value="Editor">Editor</option>
            <option value="Admin">Admin</option>
          </select>

          {#if errors.role}
            <div class="error-message">{errors.role}</div>
          {/if}
        </div>

        {#if errors.submit}
          <div class="error-message submit-error">{errors.submit}</div>
        {/if}
      </form>
    </div>

    <div class="modal-footer">
      <button
        class="btn btn-outline"
        onclick={handleClose}
        disabled={isSubmitting}
      >
        Cancel
      </button>

      <button
        class="btn btn-primary"
        onclick={handleSubmit}
        disabled={isSubmitting}
      >
        {#if isSubmitting}
          <span class="spinner"></span>
          Saving...
        {:else}
          {mode === "add" ? "Add User" : "Update User"}
        {/if}
      </button>
    </div>
  </div>
</div>

<style type="scss">
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;

    .modal {
      background: var(--bg-secondary);
      border-radius: 12px;
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;

      .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;

        h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.25rem;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-secondary);
          padding: 0.25rem;
          border-radius: 4px;
          transition: color 0.2s ease;

          &:hover {
            color: var(--text-primary);
            background: var(--bg-tertiary);
          }
        }
      }

      .modal-body {
        padding: 1.5rem;

        .form-group {
          margin-bottom: 1.5rem;

          .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-primary);
          }

          .form-control {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-size: 1rem;
            transition: all 0.2s ease;

            &:focus {
              outline: none;
              border-color: var(--accent-color);
              box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
            }
          }

          .form-control.error {
            border-color: var(--danger-color);
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
          }

          .error-message {
            color: var(--danger-color);
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }
        }

        .submit-error {
          text-align: center;
          padding: 0.75rem;
          background: rgba(220, 53, 69, 0.1);
          border-radius: 6px;
          border: 1px solid rgba(220, 53, 69, 0.2);
        }
      }

      .modal-footer {
        padding: 1.5rem;
        border-top: 1px solid var(--border-color);
        display: flex;
        justify-content: flex-end;
        gap: 1rem;

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

          &.btn-primary {
            background: var(--accent-color);
            color: white;

            &:hover:not(:disabled) {
              background: var(--accent-hover);
              transform: translateY(-1px);
            }
          }

          &.btn-outline {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-primary);

            &:hover:not(:disabled) {
              background: var(--bg-tertiary);
            }
          }

          .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
        }
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 768px) {
      .modal {
        margin: 1rem;
        max-height: calc(100vh - 2rem);
      }

      .modal-footer {
        flex-direction: column-reverse;
      }

      .btn {
        justify-content: center;
      }
    }
  }
</style>

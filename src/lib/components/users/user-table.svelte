<script lang="ts">
  import { fly } from "svelte/transition";
  import type { UserType, UserRole } from "../../types/user.type";
  import { users } from "../../stores/users";
  import { cubicOut } from "svelte/easing";
  import UserForm from "./user-form.svelte";
  import DeleteConfirmation from "./delete-confirmation.svelte";

  const { searchTerm } = $props();

  let selectedUser = $state<UserType | null>(null);
  let isFormOpen = $state(false);
  let formMode = $state<"add" | "edit">("add"); // 'add' or 'edit'
  let sortField = $state<keyof UserType>("name");
  let sortDirection = $state<"asc" | "desc">("asc");
  let userToDelete = $state<UserType | null>(null);
  let showDeleteConfirmation = $state(false);

  let filteredUsers = $derived.by<UserType[]>(() => {
    let result = $users;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.role.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  });

  const handleSort = (field: keyof UserType) => {
    if (sortField === field) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortField = field;
      sortDirection = "asc";
    }
  };

  const openAddForm = () => {
    selectedUser = null;
    formMode = "add";
    isFormOpen = true;
  };

  const openEditForm = (user: UserType) => {
    selectedUser = user;
    formMode = "edit";
    isFormOpen = true;
  };

  const closeForm = () => {
    isFormOpen = false;
    selectedUser = null;
  };

  const handleDeleteCancel = () => {
    showDeleteConfirmation = false;
    userToDelete = null;
  };

  const handleDeleteUser = (user: UserType) => {
    showDeleteConfirmation = true;
    userToDelete = user;
  };

  const getSortIcon = (field: keyof UserType) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getRoleBadgeClass = (role: UserRole) => {
    const classes = {
      Admin: "badge-admin",
      Editor: "badge-editor",
      User: "badge-user",
    };

    return classes[role] || "badge-user";
  };
</script>

<div class="user-management">
  <div class="header-actions">
    <h2>User Management</h2>
    <button class="btn btn-primary" onclick={openAddForm}>
      <span class="icon">+</span>
      Add New User
    </button>
  </div>

  <div class="table-container">
    <table class="user-table">
      <thead>
        <tr>
          <th onclick={() => handleSort("name")} class="sortable">
            Name {getSortIcon("name")}
          </th>
          <th onclick={() => handleSort("email")} class="sortable">
            Email {getSortIcon("email")}
          </th>
          <th onclick={() => handleSort("role")} class="sortable">
            Role {getSortIcon("role")}
          </th>
          <th onclick={() => handleSort("joinDate")} class="sortable">
            Join Date {getSortIcon("joinDate")}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#if filteredUsers.length === 0}
          <tr>
            <td colspan="5" class="empty-state">
              {searchTerm
                ? "No users found matching your search."
                : "No users available."}
            </td>
          </tr>
        {:else}
          {#each filteredUsers as user, idx (user.id)}
            <tr
              in:fly|global={{
                duration: 400,
                y: -20,
                delay: idx * 150,
                easing: cubicOut,
              }}
            >
              <td class="user-info">
                <div class="avatar">{user.avatar}</div>
                <div class="user-details">
                  <span class="name">{user.name}</span>
                </div>
              </td>
              <td class="email">{user.email}</td>
              <td>
                <span class="badge {getRoleBadgeClass(user.role)}">
                  {user.role}
                </span>
              </td>
              <td class="join-date">
                {new Date(user.joinDate).toLocaleDateString()}
              </td>
              <td class="actions">
                <button
                  class="btn btn-outline btn-sm"
                  onclick={() => openEditForm(user)}
                  title="Edit user"
                >
                  ✏️ Edit
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  onclick={() => handleDeleteUser(user)}
                  title="Delete user"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>

  {#if isFormOpen}
    <UserForm user={selectedUser} mode={formMode} onclose={closeForm} />
  {/if}

  {#if showDeleteConfirmation}
    <DeleteConfirmation user={userToDelete} oncancel={handleDeleteCancel} />
  {/if}
</div>

<style type="scss">
  .user-management {
    padding: 0;

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 0 1rem;

      h2 {
        color: var(--text-primary);
        margin: 0;
        font-size: 1.5rem;
      }
    }

    .table-container {
      background: var(--bg-secondary);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--shadow);

      .user-table {
        width: 100%;
        border-collapse: collapse;
        background: var(--bg-secondary);

        th {
          background: var(--bg-tertiary);
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-color);

          &.sortable {
            cursor: pointer;
            user-select: none;
            transition: background-color 0.2s ease;

            &:hover {
              background: var(--bg-primary);
            }
          }
        }

        td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        tr:last-child td {
          border-bottom: none;
        }

        tr:hover {
          background: var(--bg-tertiary);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--accent-color), #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 0.875rem;
          }

          .user-details .name {
            font-weight: 600;
            color: var(--text-primary);
          }
        }

        .email {
          color: var(--text-secondary);
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;

          &.badge-admin {
            background: rgba(220, 53, 69, 0.1);
            color: var(--danger-color);
            border: 1px solid rgba(220, 53, 69, 0.2);
          }

          &.badge-editor {
            background: rgba(255, 193, 7, 0.1);
            color: var(--warning-color);
            border: 1px solid rgba(255, 193, 7, 0.2);
          }

          &.badge-user {
            background: rgba(40, 167, 69, 0.1);
            color: var(--success-color);
            border: 1px solid rgba(40, 167, 69, 0.2);
          }
        }

        .join-date {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .empty-state {
          text-align: center;
          color: var(--text-secondary);
          padding: 3rem;
          font-style: italic;
        }
      }
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: var(--accent-color);
      color: white;
    }

    .btn-primary:hover {
      background: var(--accent-hover);
      transform: translateY(-1px);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-primary);
    }

    .btn-outline:hover {
      background: var(--bg-tertiary);
    }

    .btn-danger {
      background: var(--danger-color);
      color: white;
    }

    .btn-danger:hover {
      background: #c82333;
      transform: translateY(-1px);
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }

    .icon {
      font-weight: bold;
    }
  }

  @media (max-width: 768px) {
    .header-actions {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .table-container {
      overflow-x: auto;
    }

    .user-table {
      min-width: 600px;
    }

    .actions {
      flex-direction: column;
    }

    .btn {
      justify-content: center;
    }
  }
</style>

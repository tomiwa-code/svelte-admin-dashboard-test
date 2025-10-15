import { writable } from "svelte/store";
import type { UserType } from "../types/user.type";

const localStorageKey = "svelte-userhub-users";

// Sample initial data
const initialUsers: UserType[] = [
  {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    avatar: "JD",
    joinDate: "2023-01-15",
  },
  {
    id: crypto.randomUUID(),
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    avatar: "JS",
    joinDate: "2023-02-20",
  },
  {
    id: crypto.randomUUID(),
    name: "Robert Johnson",
    email: "robert.j@example.com",
    role: "Editor",
    avatar: "RJ",
    joinDate: "2023-03-10",
  },
  {
    id: crypto.randomUUID(),
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "User",
    avatar: "ED",
    joinDate: "2023-04-05",
  },
  {
    id: crypto.randomUUID(),
    name: "Michael Wilson",
    email: "michael.w@example.com",
    role: "Admin",
    avatar: "MW",
    joinDate: "2023-05-12",
  },
];

function createUserStore() {
  const { subscribe, set, update } = writable<UserType[]>([]);
  const browser = typeof window !== "undefined";

  // Initialize with sample data or from localStorage
  if (browser) {
    const stored = localStorage.getItem(localStorageKey);
    if (stored) {
      set(JSON.parse(stored));
    } else {
      set(initialUsers);
      localStorage.setItem(localStorageKey, JSON.stringify(initialUsers));
    }
  }

  return {
    subscribe,
    addUser: (user: UserType) =>
      update((users) => {
        const newUser = {
          ...user,
          id: crypto.randomUUID(),
          avatar: getUserInitials(user.name),
          joinDate: new Date().toISOString().split("T")[0],
        };
        const newUsers = [...users, newUser];
        if (browser)
          localStorage.setItem(localStorageKey, JSON.stringify(newUsers));
        return newUsers;
      }),
    updateUser: (updatedUser: UserType) =>
      update((users) => {
        const newUsers = users.map((user) =>
          user.id === updatedUser.id
            ? { ...updatedUser, avatar: getUserInitials(updatedUser.name) }
            : user
        );
        if (browser)
          localStorage.setItem(localStorageKey, JSON.stringify(newUsers));
        return newUsers;
      }),
    deleteUser: (id: string) =>
      update((users) => {
        const newUsers = users.filter((user) => user.id !== id);
        if (browser)
          localStorage.setItem(localStorageKey, JSON.stringify(newUsers));
        return newUsers;
      }),
    reset: () => {
      set(initialUsers);
      if (browser)
        localStorage.setItem(localStorageKey, JSON.stringify(initialUsers));
    },
  };
}

function getUserInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export const users = createUserStore();

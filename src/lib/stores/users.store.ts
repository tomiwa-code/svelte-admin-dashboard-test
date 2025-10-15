import { writable } from "svelte/store";
import type { UserType } from "../types/user.type";

const localStorageKey = "svelte-userhub-users";

function createUserStore() {
  const { subscribe, set, update } = writable<UserType[]>([]);
  const browser = typeof window !== "undefined";

  // Initialize with sample data or from localStorage
  if (browser) {
    const stored = localStorage.getItem(localStorageKey);
    if (stored) {
      set(JSON.parse(stored));
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
      set([]);
      if (browser) localStorage.setItem(localStorageKey, JSON.stringify([]));
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

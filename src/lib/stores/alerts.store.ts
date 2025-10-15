import { writable } from "svelte/store";
import type { AlertType, AlertTypeType } from "../types/alert.type";

function createAlertStore() {
  const { subscribe, set, update } = writable<AlertType[]>([]);

  const show = (
    message: string,
    type: AlertTypeType = "default",
    duration = 5000
  ) => {
    const id = crypto.randomUUID();
    const alert: AlertType = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now(),
    };

    update((alerts) => [...alerts, alert]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        update((alerts) => alerts.filter((alert) => alert.id !== id));
      }, duration);
    }

    return id;
  };

  return {
    subscribe,
    success: (message: string, duration = 5000) => {
      return show(message, "success", duration);
    },
    error: (message: string, duration = 5000) => {
      return show(message, "error", duration);
    },
    info: (message: string, duration = 5000) => {
      return show(message, "default", duration);
    },
    remove: (id: string) => {
      update((alerts) => alerts.filter((alert) => alert.id !== id));
    },
    clear: () => set([]),
    set,
  };
}

export const alerts = createAlertStore();

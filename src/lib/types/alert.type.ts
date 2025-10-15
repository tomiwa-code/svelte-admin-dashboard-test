export type AlertType = {
  id: string;
  message: string;
  type: AlertTypeType;
  duration: number;
  timestamp: number;
};

export type AlertTypeType = "default" | "success" | "error";

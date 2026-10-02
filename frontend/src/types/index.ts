export interface Monitor {
  id: number;
  name: string;
  type?: string;
  url: string;
  method?: string;
  interval?: number;
  interval_seconds?: number;
  timeout_seconds?: number;
  is_active: boolean;
  status: string;
  last_check?: string;
  last_checked_at?: string;
  response_time?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MonitorCreate {
  name: string;
  type?: string;
  url: string;
  method?: string;
  interval?: number;
  interval_seconds?: number;
  timeout_seconds?: number;
  is_active?: boolean;
}

export interface Incident {
  id: number;
  monitor_id: number;
  monitor_name?: string;
  status: string;
  title?: string;
  description?: string;
  cause?: string;
  is_resolved?: boolean;
  started_at: string;
  resolved_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  email: string;
  is_active: boolean;
}

export interface Metric {
  id: number;
  monitor_id: number;
  status_code: number;
  response_time: number;
  created_at: string;
}

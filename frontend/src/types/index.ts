export interface User {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export type MonitorStatus = 'up' | 'down' | 'unknown';

export interface Monitor {
  id: number;
  user_id?: number;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';
  interval_seconds: number;
  timeout_seconds: number;
  is_active: boolean;
  status: MonitorStatus;
  last_checked_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Check {
  id: number;
  monitor_id: number;
  status_code?: number;
  response_time_ms?: number;
  is_up: boolean;
  error_message?: string;
  checked_at: string;
}

export interface Incident {
  id: number;
  monitor_id: number;
  started_at: string;
  resolved_at?: string;
  cause?: string;
  is_resolved: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}
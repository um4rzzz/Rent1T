export type User = {
  id: number;
  user_name: string;
  email?: string;
  password: string;
  role: 'tenant'|'owner'|'admin';
  created_at: string;
  updated_at: string;
};

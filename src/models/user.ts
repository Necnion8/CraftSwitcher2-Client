export type UserResult = {
  id: number;
  name: string;
  lastLogin: string | null;
  lastAddress: string | null;
  permission: number;
};

export type UserOperationResult = {
  result: boolean;
  userId: number;
};

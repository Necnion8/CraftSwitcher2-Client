import axios from 'axios';

import { APIError } from 'src/abc/api-error';

// ------------------------------------------------------------

export default class User {
  constructor(
    public id: number,
    public name: string,
    public lastLogin: Date | null,
    public lastAddress: string | null,
    public permission: number
  ) {}

  static async login(username: string, password: string): Promise<boolean> {
    try {
      const result = await axios.post('/login', { username, password });
      return result.status === 200;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  static async isValidSession(): Promise<boolean> {
    try {
      const result = await axios.get('/login');
      return result.data.result;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  static async all(): Promise<User[]> {
    try {
      const result = await axios.get('/users');
      return result.data.map(
        (c: {
          id: number;
          name: string;
          last_login: Date | null;
          last_address: string | null;
          permission: number;
        }) => new User(c.id, c.name, c.last_login, c.last_address, c.permission)
      );
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  static async add(username: string, password: string): Promise<boolean> {
    try {
      const result = await axios.post('/user/add', { username, password });
      return result.data.result;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  async remove(): Promise<boolean> {
    try {
      const result = await axios.delete(`/user/remove?user_id=${this.id}`);
      return result.data.result;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }
}

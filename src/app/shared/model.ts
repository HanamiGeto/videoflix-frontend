export interface Tokens {
  access: string;
  refresh: string;
}

export interface User extends Tokens {
  id: number;
  username: string;
  email: string;
}

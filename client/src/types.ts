export interface User {
  id: number;
  name: string;
  email: string;
  pfpIndex: number;
}

export interface GetMeResponse {
  user: User;
}

export interface Friend {
  id: number;
  name: string;
  email: string;
  pfpIndex: number;
}

export interface GetFriendsResponse {
  friends: Friend[];
}

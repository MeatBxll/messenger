export interface User {
  id: number;
  name: string;
  email: string;
  pfpIndex: number;

  friends: UserPreview[];
  sentRequests: SentRequest[];
  receivedRequests: ReceivedRequest[];
}

export interface UserPreview {
  id: number;
  name: string;
  email: string;
  pfpIndex: number;
}

export type Friend = UserPreview;

export interface GetMeResponse {
  user: User;
}

export interface GetFriendsResponse {
  friends: Friend[];
}

export interface SentRequest {
  id: number;
  status: string;
  createdAt: string;
  receiver: UserPreview;
}

export interface ReceivedRequest {
  id: number;
  status: string;
  createdAt: string;
  sender: UserPreview;
}

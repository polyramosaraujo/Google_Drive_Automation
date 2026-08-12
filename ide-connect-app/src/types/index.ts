export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  cellId: string;
  pushToken?: string;
  createdAt: number;
}

export interface Cell {
  id: string;
  name: string;
  inviteCode: string;
}

export interface PrayerRequest {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  weekKey: string;
  createdAt: number;
  prayedCount: number;
}

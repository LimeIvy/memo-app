export type Memo = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateMemoRequest = {
  title: string;
  content: string;
};

export type UpdateMemoRequest = {
  title?: string;
  content?: string;
};
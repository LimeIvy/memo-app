import { Memo, CreateMemoRequest, UpdateMemoRequest } from '@/lib/types';
import db from '@/lib/db';

// メモの取得（全件）
export const getAllMemos = async (): Promise<Memo[]> => {
  const memos = await db.memo.findMany();
  return memos;
};

// メモの取得（ID指定）
export const getMemoById = async (id: string): Promise<Memo | null> => {
  const memo = await db.memo.findUnique({
    where: { id },
  });
  return memo || null;
};

// メモの作成
export const createMemo = async (data: CreateMemoRequest): Promise<Memo> => {
  const newMemo = await db.memo.create({
    data: {
      title: data.title,
      content: data.content,
    },
  });
  return newMemo;
};

// メモの更新
export const updateMemo = async (id: string, data: UpdateMemoRequest): Promise<Memo | null> => {
  const updatedMemo = await db.memo.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
    },
  });
  return updatedMemo || null;
};

// メモの削除
export const deleteMemo = async (id: string): Promise<boolean> => {
  const deletedMemo = await db.memo.delete({
    where: { id },
  });
  return deletedMemo !== null;
};
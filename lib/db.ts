'use server';

import { Memo, CreateMemoRequest, UpdateMemoRequest } from '@/lib/types';
import db from '@/lib/prisma';

// メモの取得（全件）
export const getAllMemos = async (): Promise<Memo[]> => {
  const memos = await db.memo.findMany();
  return memos.map(memo => ({
    ...memo,
    createdAt: memo.createdAt.toISOString(),
    updatedAt: memo.updatedAt.toISOString(),
  }));
};

// メモの取得（ID指定）
export const getMemoById = async (id: string): Promise<Memo | null> => {
  const memo = await db.memo.findUnique({
    where: { id },
  });
  return memo ? {
    ...memo,
    createdAt: memo.createdAt.toISOString(),
    updatedAt: memo.updatedAt.toISOString(),
  } : null;
};

// メモの作成
export const createMemo = async (data: CreateMemoRequest): Promise<Memo> => {
  const newMemo = await db.memo.create({
    data: {
      title: data.title,
      content: data.content,
    },
  });
  return {
    ...newMemo,
    createdAt: newMemo.createdAt.toISOString(),
    updatedAt: newMemo.updatedAt.toISOString(),
  };
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
  return updatedMemo ? {
    ...updatedMemo,
    createdAt: updatedMemo.createdAt.toISOString(),
    updatedAt: updatedMemo.updatedAt.toISOString(),
  } : null;
};

// メモの削除
export const deleteMemo = async (id: string): Promise<boolean> => {
  const deletedMemo = await db.memo.delete({
    where: { id },
  });
  return deletedMemo !== null;
};
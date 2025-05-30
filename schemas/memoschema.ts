import { z } from 'zod';

// バリデーションスキーマ
export const createMemoSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  content: z.string().min(1, '内容は必須です'),
});

export const updateMemoSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').optional(),
  content: z.string().min(1, '内容は必須です').optional(),
});


// 型も自動生成
export type MemoInput = z.infer<typeof createMemoSchema>;
export type MemoUpdateInput = z.infer<typeof updateMemoSchema>;
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { zValidator } from '@hono/zod-validator';
import {
  getAllMemos,
  getMemoById,
  createMemo,
  updateMemo,
  deleteMemo,
} from '@/lib/db';
import { createMemoSchema, updateMemoSchema } from '@/schemas/memoschema';

// Honoアプリケーションの作成
const app = new Hono()
  // メモ一覧の取得
  .get('/api/memos', async (c) => {
    const memos = await getAllMemos();
    return c.json({ memos });
  })
  
  // メモの作成
  .post('/api/memos', zValidator('json', createMemoSchema), async (c) => {
    const data = c.req.valid('json');
    const memo = await createMemo(data);
    return c.json({ memo }, 201);
  })
  
  // メモの取得（ID指定）
  .get('/api/memos/:id', async (c) => {
    const id = c.req.param('id');
    const memo = await getMemoById(id);
    
    if (!memo) {
      return c.json({ error: 'メモが見つかりません' }, 404);
    }
    
    return c.json({ memo });
  })
  
  // メモの更新
  .put('/api/memos/:id', zValidator('json', updateMemoSchema), async (c) => {
    const id = c.req.param('id');
    const data = c.req.valid('json');
    const memo = await updateMemo(id, data);
    
    if (!memo) {
      return c.json({ error: 'メモが見つかりません' }, 404);
    }
    
    return c.json({ memo });
  })
  
  // メモの削除
  .delete('/api/memos/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await deleteMemo(id);
    
    if (!deleted) {
      return c.json({ error: 'メモが見つかりません' }, 404);
    }
    
    return c.json({ success: true });
  });

// 型情報のエクスポート
export type AppType = typeof app;

// Next.jsのRoute Handlerとして処理
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
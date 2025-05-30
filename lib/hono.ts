import { hc } from 'hono/client';
import type { AppType } from '@/app/api/[[...route]]/route';

// APIクライアントの作成
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
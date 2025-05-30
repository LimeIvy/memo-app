'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { client } from '@/lib/hono';
import type { Memo } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function MemoDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [memo, setMemo] = useState<Memo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const actualParams = use(params);
  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const res = await client.api.memos[':id'].$get({
          param: { id: actualParams.id }
        });
        
        if (res.ok) {
          const data = await res.json();
          setMemo(data.memo);
        } else if (res.status === 404) {
          setError('メモが見つかりません');
        } else {
          setError('メモの取得に失敗しました');
        }
      } catch (err) {
        setError('エラーが発生しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemo();
  }, [actualParams.id]);

  const handleDelete = async () => {
    if (!confirm('このメモを削除してもよろしいですか？')) {
      return;
    }

    try {
      const res = await client.api.memos[':id'].$delete({
        param: { id: actualParams.id }
      });
      
      if (res.ok) {
        router.push('/');
      } else {
        setError('メモの削除に失敗しました');
      }
    } catch (err) {
      setError('エラーが発生しました');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!memo) {
    return <div className="p-4">メモが見つかりません</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-500">
          ← 一覧に戻る
        </Link>
      </div>
      
      <div className="border p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">{memo.title}</h1>
        
        <div className="text-sm text-gray-500 mb-4">
          <p>作成日: {new Date(memo.createdAt).toLocaleString()}</p>
          <p>更新日: {new Date(memo.updatedAt).toLocaleString()}</p>
        </div>
        
        <div className="whitespace-pre-wrap mb-6">{memo.content}</div>
        
        <div className="flex space-x-4">
          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href={`/memos/${memo.id}/edit`}>
              編集
            </Link>
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 cursor-pointer"
          >
            削除
          </Button>
        </div>
      </div>
    </div>
  );
}
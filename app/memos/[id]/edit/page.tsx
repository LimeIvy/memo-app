'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { client } from '@/lib/hono';
import { Button } from '@/components/ui/button';

export default function EditMemo({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const actualParams = use(params);

  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const res = await client.api.memos[':id'].$get({
          param: { id: actualParams.id }
        });
        
        if (res.ok) {
          const data = await res.json();
          setTitle(data.memo.title);
          setContent(data.memo.content);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('タイトルと内容を入力してください');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const res = await client.api.memos[':id'].$put({
        param: { id: actualParams.id },
        json: {
          title,
          content
        }
      });
      
      if (res.ok) {
        router.push(`/memos/${actualParams.id}`);
      } else {
        setError('メモの更新に失敗しました');
      }
    } catch (err) {
      setError('エラーが発生しました');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error && !submitting) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href={`/memos/${actualParams.id}`} className="text-blue-500">
          ← 詳細に戻る
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">メモの編集</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="border p-6 rounded shadow">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 mb-2">
            内容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded h-40"
            required
          />
        </div>
        
        <Button
          type="submit"
          disabled={submitting}
          className="cursor-pointer"
        >
          {submitting ? '更新中...' : '更新する'}
        </Button>
      </form>
    </div>
  );
}
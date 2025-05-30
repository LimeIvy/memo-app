'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { client } from '@/lib/hono';

export default function NewMemo() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('タイトルと内容を入力してください');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const res = await client.api.memos.$post({
        json: {
          title,
          content
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        router.push(`/memos/${data.memo.id}`);
      } else {
        setError('メモの作成に失敗しました');
      }
    } catch (err) {
      setError('エラーが発生しました');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-500">
          ← 一覧に戻る
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">新規メモ作成</h1>
      
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
        
        <button
          type="submit"
          disabled={submitting}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            submitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {submitting ? '保存中...' : '保存する'}
        </button>
      </form>
    </div>
  );
}
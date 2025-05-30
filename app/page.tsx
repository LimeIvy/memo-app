"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/lib/hono";
import type { Memo } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const res = await client.api.memos.$get();

        if (res.ok) {
          const data = await res.json();
          if (data && data.memos) {
            setMemos(data.memos);
          } else {
            setError("メモの取得に失敗しました: データ形式が不正です");
          }
        } else {
          setError("メモの取得に失敗しました");
        }
      } catch (err) {
        setError("エラーが発生しました");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemos();
  }, []);

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">メモ一覧</h1>
        <Button asChild className="bg-blue-500 hover:bg-blue-600">
          <Link href="/memos/create">
            新規メモ作成
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {memos.length === 0 ? (
          <p className="text-gray-500 mt-4">メモがありません。</p>
        ) : (
          memos.map((memo) => (
            <div key={memo.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{memo.title}</h2>
              <p className="text-gray-600 mt-2 line-clamp-3">{memo.content}</p>
              <div className="mt-4 flex justify-between">
                <Link href={`/memos/${memo.id}`} className="text-blue-500">
                  詳細を見る
                </Link>
                <span className="text-sm text-gray-500">
                  {new Date(memo.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

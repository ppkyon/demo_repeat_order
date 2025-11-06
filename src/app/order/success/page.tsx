'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function SuccessBody() {
    const sp = useSearchParams();
    const method = sp.get('method') === 'cod' ? '代引き' : 'カード';
    
    return (
        <main className="mx-auto max-w-[420px] p-6 space-y-4 text-center">
            <h1 className="text-2xl font-bold">ご注文が完了しました🎉</h1>
            <p className="text-gray-700">お支払い方法：{method}</p>
            <div className="space-y-2">
                <Link href="/history" className="inline-block bg-black text-white rounded px-4 py-3">注文履歴を見る</Link>
                <div>
                    <Link href="/order" className="text-blue-600 underline">トップへ戻る</Link>
                </div>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={ <main className="mx-auto max-w-[420px] p-6 text-center">読み込み中...</main> }>
            <SuccessBody />    
        </Suspense>
    );
}
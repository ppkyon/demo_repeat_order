'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function SuccessBody() {
    const sp = useSearchParams();
    const method = sp.get('method') === 'cod' ? '代引き' : 'カード';

    let shipTo = '未登録';
    try {
        const hist = JSON.parse(localStorage.getItem('orders') ?? '[]');
        shipTo = (hist?.[0]?.shipTo) || localStorage.getItem('shipTo') || '未登録';
    } catch {
        shipTo = localStorage.getItem('shipTo') || '未登録';
    }
    
    return (
        <main className="mx-auto max-w-[420px] p-6 space-y-5 text-center">
            <h1 className="text-2xl font-bold">ご注文が完了しました🎉</h1>
            <div className="mx-auto w-full max-w-[420px] text-left border rounded p-4 space-y-2">
                <div className="flex justify-between">
                    <span>お支払い方法</span>
                    <span className="font-semibold">{method}</span>
                </div>
                <div className="flex justify-between gap-3">
                    <span>送り先住所</span>
                    <span className="font-semibold text-right break-words">{shipTo}</span>
                </div>
            </div>
            <div className="space-y-3">
                <Link href="/history" className="inline-block bg-black text-white rounded px-5 py-3">注文履歴を見る</Link>
                <div>
                    <Link href="/order" className="text-blue-600 underline">トップへ戻る</Link>
                </div>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<main className="mx-auto max-w-[420px] p-6 text-center">読み込み中...</main>}>
            <SuccessBody />    
        </Suspense>
    );
}
'use client';

import Link from 'next/link';

export default function History() {
    const hist = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('orders') ?? '[]') as any[] : [];
    const last = hist[0];

    function reorder() {
        if (!last) {
            return;
        }
        localStorage.setItem('reorderItems', JSON.stringify(last.items || []));
        if (last.pref) {
            localStorage.setItem('reorderPref', String(last.pref));
        }
        window.location.href = '/order?reorder=1';
    }

    return (
        <main className="mx-auto max-w-[420px] p-4 space-y-4">
            <h1 className="text-xl font-bold">ご注文履歴</h1>
            {!last && <p className="text-gray-600">まだ履歴がありません。</p>}
            {last && (
                <div className="border rounded p-3 space-y-2">
                    <div className="text-sm text-gray-600">
                        {new Date(last.ts).toLocaleString()}
                    </div>
                    <ul className="text-sm list-disc pl-5">
                        {last.items.map((it: any) => (
                            <li key={it.id}>{it.name} × {it.quantity} (￥{(it.price * it.quantity).toLocaleString()})</li>
                        ))}
                    </ul>
                    <div className="flex justify-betweem font-semibold">
                        <span>合計</span>
                        <span>￥{last.total.toLocaleString()}</span>
                    </div>
                    <button onClick={reorder} className="w-full bg-black text-white py-3 rounded">前回と同じ内容で再注文</button>
                </div>
            )}
            <Link href="/order" className="text-blue-600 underline">トップへ戻る</Link>
        </main>
    );
}
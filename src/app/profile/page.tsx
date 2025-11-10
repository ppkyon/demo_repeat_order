'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';

export default function Profile() {
    const [shipTo, setShipTo] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShipTo(localStorage.getItem('shipTo') || '');
        }
    }, []);

    function save() {
        localStorage.setItem('shipTo', shipTo.trim());
        alert('送り先住所を保存しました');
    }

    return (
        <main className="mx-auto max-w-[420px] p-4 space-y-4">
            <h1 className="text-xl font-bold">会員情報（送り先）</h1>
            <label className="block text-sm text-gray-700">送り先住所</label>
            <textarea className="w-full border rounded p-3 h-28" placeholder="例）東京都◯◯区◯◯ 1-2-3 サンプルビル 101" value={shipTo} onChange={(e) => setShipTo(e.target.value)} />
            <button onClick={save} className="w-full bg-black text-white py-3 rounded">保存する</button>
            <div className="text-center">
                <Link href="/order" className="text-blue-600 underline">注文画面へ戻る</Link>
            </div>
        </main>
    );
}
'use client';

import { useEffect, useMemo, useState } from 'react';
import QtyControl from '@/components/QtyControl';
import { PRODUCTS } from '@/lib/products';
import { PREFS, getShipping } from '@/lib/shipping';

type CartItem = { id: string; name: string; price: number; quantity: number };

export default function OrderPage() {
    const [pref, setPref] = useState('東京都');
    const [qty, setQty] = useState<Record<string, number>>({});

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        const params = new URLSearchParams(window.location.search);
        if (params.get('reorder') === '1') {
            try {
                const items = JSON.parse(localStorage.getItem('reorderItems') ?? '[]') as CartItem[];
                const prefStored = localStorage.getItem('reorderPref');
                if (prefStored) {
                    setPref(prefStored);
                }
                if (Array.isArray(items) && items.length > 0) {
                    const restored = items.reduce<Record<string, number>>((acc, it) => {
                        acc[it.id] = it.quantity;
                        return acc;
                    }, {});
                    setQty(restored);
                }
            } catch {}

            localStorage.removeItem('reorderItems');
            localStorage.removeItem('reorderPref');
        }
    }, []);

    const items: CartItem[] = useMemo(
        () => PRODUCTS.map(p => ({ ...p, quantity: qty[p.id] ?? 0 })).filter(i => i.quantity > 0),
        [qty]
    );

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal > 0 ? getShipping(pref) : 0;
    const total = subtotal + shipping;

    function saveHistory() {
        if (typeof window === 'undefined') {
            return;
        }
        const shipTo = localStorage.getItem('shipTo') || '';
        const hist = JSON.parse(localStorage.getItem('orders') ?? '[]');
        hist.unshift({ ts: Date.now(), pref, shipTo, items, subtotal, shipping, total });
        localStorage.setItem('orders', JSON.stringify(hist.slice(0, 10)));
    }

    async function checkoutCard() {
        if (subtotal === 0) {
            return;
        }
        saveHistory();
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items,
                shippingFee: shipping,
                successUrl: window.location.origin + '/order/success',
                cancelUrl: window.location.href,
            }),
        });
        const data = await res.json();
        if (data.url) {
            window.location.href = data.url;
        }
    }

    function chooseCOD() {
        if (subtotal === 0) {
            return;
        }
        saveHistory();
        window.location.href = '/order/success?method=cod';
    }

    return (
        <main className="mx-auto max-w-[420px] p-4 space-y-4">
            <h1 className="text-xl font-bold text-center">ご注文はこちら</h1>
            {/* <label className="block">
                お届け先（都道府県）
                <select className="mt-1 border p-2 rounded w-full" value={pref} onChange={(e) => setPref(e.target.value)}>
                    {PREFS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </label> */}
            <div className="space-y-3">
                {PRODUCTS.map(p => (
                    <div key={p.id} className="flex items-center justify-between border rounded p-3">
                        <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-sm text-gray-600">￥{p.price.toLocaleString()}</div>
                        </div>
                        <QtyControl value={qty[p.id] ?? 0 } onChange={(v) => setQty(s => ({ ...s, [p.id]: v }))} />
                    </div>
                ))}
            </div>
            <div className="border rounded p-3 space-y-1">
                <div className="flex justify-between">
                    <span>小計</span>
                    <span>￥{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span>送料</span>
                    <span>￥{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>合計</span>
                    <span>￥{total.toLocaleString()}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={checkoutCard} disabled={subtotal === 0} className="bg-black text-white py-3 rounded disabled:opacity-50">カードで支払う</button>
                <button onClick={chooseCOD} disabled={subtotal === 0} className="border py-3 rounded disabled:opacity-50">代引きを選ぶ</button>
            </div>
            <div className="text-center">
                <a href="/profile" className="text-blue-600 underline text-sm">会員情報を変更する（送り先住所）</a>
            </div>
            <p className="text-xs text-gray-500">※ 住所・支払い方法の変更は会員情報変更ボタンからお願いします</p>
        </main>
    );
}
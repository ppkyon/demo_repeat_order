'use client';

export default function QtyControl({ value, onChange, }: { value: number; onChange: (v: number) => void }) {
    return (
        <div className="flex items-center gap-2">
            <button onClick={() => onChange(Math.max(0, value - 1))} className="border rounded px-3 py-1">-</button>
            <span className="w-8 text-center">{value}</span>
            <button onClick={() => onChange(value + 1)} className="border rounded px-3 py-1">+</button>
        </div>
    )
}
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    const { items, shippingFee, successUrl, cancelUrl } = await req.json();

    const line_items = (items as any[]).map((it) => ({
        price_data: {
            currency: 'jpy',
            product_data: { name: it.name },
            unit_amount: it.price,
        },
        quantity: it.quantity,
    }));

    if (shippingFee > 0) {
        line_items.push({
            price_data: {
                currency: 'jpy',
                product_data: { name: '送料' },
                unit_amount: shippingFee,
            },
            quantity: 1,
        });
    }

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items,
        success_url: successUrl,
        cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
}
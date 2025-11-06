export const SHIPPING_TABLE: Record<string, number> = {
    '東京都': 700,
    '神奈川県': 700,
    '千葉県 ': 700,
    '埼玉県': 700,
    '北海道': 1200,
    '大阪府': 800,
    '愛知県': 800,
    '福岡県': 900,
    '沖縄県': 1400,
};
export const PREFS = Object.keys(SHIPPING_TABLE);
export const getShipping = (pref: string) => SHIPPING_TABLE[pref] ?? 900;
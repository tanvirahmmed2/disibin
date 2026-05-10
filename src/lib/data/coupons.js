import { dbQuery } from "../database/pg";

export async function getActiveCoupons() {
    const res = await dbQuery(`
        SELECT c.*, p.name, p.description, p.price as original_price, 
               COALESCE(c.image, p.image) as image, 
               p.duration_days, p.slug as slug,
               (SELECT json_agg(f.name) 
                FROM package_features pf 
                JOIN features f ON pf.feature_id = f.feature_id 
                WHERE pf.package_id = p.package_id) as features
        FROM coupons c 
        LEFT JOIN packages p ON c.package_id = p.package_id 
        WHERE c.status = 'active'
        ORDER BY c.created_at DESC
    `, []);

    return res.rows.map(offer => {
        let price = null;
        if (offer.package_id) {
            const discountAmount = offer.is_percentage
                ? (Number(offer.original_price) * Number(offer.discount) / 100)
                : Number(offer.discount);
            price = Number(offer.original_price) - discountAmount;
        }
        return { ...offer, price };
    });
}

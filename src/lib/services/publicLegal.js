import { dbQuery } from '@/lib/database/pg';

export async function getPublicTermsOfService() {
  try {
    const res = await dbQuery(`
      SELECT id, title, content, order_num, updated_at
      FROM terms_and_conditions
      WHERE is_published = true
      ORDER BY order_num ASC, id ASC
    `);
    return res.rows || [];
  } catch (error) {
    console.error('Error loading Terms of Service items:', error);
    return [];
  }
}

export async function getPublicPrivacyPolicy() {
  try {
    const res = await dbQuery(`
      SELECT id, title, content, order_num, updated_at
      FROM privacy_policies
      WHERE is_published = true
      ORDER BY order_num ASC, id ASC
    `);
    return res.rows || [];
  } catch (error) {
    console.error('Error loading Privacy Policy items:', error);
    return [];
  }
}

export async function getPublicRefundPolicy() {
  try {
    const res = await dbQuery(`
      SELECT id, title, content, order_num, updated_at
      FROM refund_conditions
      WHERE is_published = true
      ORDER BY order_num ASC, id ASC
    `);
    return res.rows || [];
  } catch (error) {
    console.error('Error loading Refund Policy items:', error);
    return [];
  }
}

export async function getProductMetadataBySlug(slug) {
  try {
    const res = await dbQuery('SELECT name, description FROM products WHERE slug = $1', [slug]);
    return res.rows[0] || null;
  } catch (error) {
    console.error('Dynamic product metadata query failed:', error);
    return null;
  }
}

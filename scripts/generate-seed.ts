import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { categories } from '../src/data/categories';
import { medicines } from '../src/data/medicines';
import { articles } from '../src/data/articles';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

function sqlArray(arr?: string[]): string {
  if (!arr || arr.length === 0) return "ARRAY[]::text[]";
  const items = arr.map(s => `'${escapeSql(s)}'`).join(', ');
  return `ARRAY[${items}]`;
}

let sql = `-- ============================================================
-- EZRA PHARMACY — SEED DATA
-- Import existing medicines, categories, and articles into Supabase
-- ============================================================

`;

// 1. CATEGORIES
sql += `-- 1. CATEGORIES\n`;
sql += `INSERT INTO public.categories (id, name, icon, color, count, description) VALUES\n`;
const catValues = categories.map(c => {
  return `  ('${escapeSql(c.id)}', '${escapeSql(c.name)}', '${escapeSql(c.icon)}', '${escapeSql(c.color)}', ${c.count}, '${escapeSql(c.description)}')`;
}).join(',\n');
sql += catValues + `\nON CONFLICT (id) DO UPDATE SET\n  name = EXCLUDED.name,\n  icon = EXCLUDED.icon,\n  color = EXCLUDED.color,\n  count = EXCLUDED.count,\n  description = EXCLUDED.description;\n\n`;

// 2. MEDICINES
sql += `-- 2. MEDICINES\n`;
sql += `INSERT INTO public.medicines (
  id, name, brand, category, price, original_price, discount,
  image, description, uses, side_effects, dosage,
  availability, stock, requires_prescription, rating, review_count, tags
) VALUES\n`;
const medValues = medicines.map(m => {
  const origPrice = m.originalPrice !== undefined ? m.originalPrice : 'NULL';
  const disc = m.discount || 0;
  const dosage = m.dosage ? `'${escapeSql(m.dosage)}'` : 'NULL';
  return `  ('${escapeSql(m.id)}', '${escapeSql(m.name)}', '${escapeSql(m.brand)}', '${escapeSql(m.category)}', ${m.price}, ${origPrice}, ${disc}, '${escapeSql(m.image)}', '${escapeSql(m.description)}', ${sqlArray(m.uses)}, ${sqlArray(m.sideEffects)}, ${dosage}, '${escapeSql(m.availability)}', ${m.stock}, ${m.requiresPrescription}, ${m.rating}, ${m.reviewCount}, ${sqlArray(m.tags)})`;
}).join(',\n');
sql += medValues + `\nON CONFLICT (id) DO UPDATE SET\n  name = EXCLUDED.name,\n  brand = EXCLUDED.brand,\n  price = EXCLUDED.price,\n  stock = EXCLUDED.stock;\n\n`;

// 3. ARTICLES
sql += `-- 3. HEALTH ARTICLES\n`;
sql += `INSERT INTO public.articles (
  id, title, excerpt, content, image, category, author, date, read_time, tags
) VALUES\n`;
const artValues = articles.map(a => {
  return `  ('${escapeSql(a.id)}', '${escapeSql(a.title)}', '${escapeSql(a.excerpt)}', '${escapeSql(a.content)}', '${escapeSql(a.image)}', '${escapeSql(a.category)}', '${escapeSql(a.author)}', '${escapeSql(a.date)}', '${escapeSql(a.readTime)}', ${sqlArray(a.tags)})`;
}).join(',\n');
sql += artValues + `\nON CONFLICT (id) DO UPDATE SET\n  title = EXCLUDED.title,\n  content = EXCLUDED.content;\n`;

const outputPath = path.resolve(__dirname, '../supabase/seed.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Successfully generated seed SQL at: ${outputPath}`);

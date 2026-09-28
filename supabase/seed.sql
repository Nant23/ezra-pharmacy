-- ============================================================
-- EZRA PHARMACY — SEED DATA
-- Import existing medicines, categories, and articles into Supabase
-- ============================================================

-- 1. CATEGORIES
INSERT INTO public.categories (id, name, icon, color, count, description) VALUES
  ('cat-001', 'Pain Relief', '💊', '#fee2e2', 24, 'Analgesics, NSAIDs, and pain management medications'),
  ('cat-002', 'Cold & Flu', '🤧', '#dbeafe', 18, 'Antihistamines, decongestants, and cold remedies'),
  ('cat-003', 'Vitamins & Supplements', '🌿', '#dcfce7', 35, 'Vitamins, minerals, and dietary supplements'),
  ('cat-004', 'Digestive Health', '🫀', '#fef9c3', 16, 'Antacids, probiotics, and digestive aids'),
  ('cat-005', 'Skin Care', '✨', '#fce7f3', 28, 'Moisturizers, treatments, and skin health products'),
  ('cat-006', 'Baby Care', '👶', '#e0e7ff', 22, 'Safe products for infants and young children'),
  ('cat-007', 'Personal Care', '🧴', '#f3e8ff', 40, 'Hygiene, grooming, and personal wellness products'),
  ('cat-008', 'Diabetes Care', '🩸', '#fef3c7', 14, 'Blood sugar management and diabetic supplies'),
  ('cat-009', 'First Aid', '🩹', '#fee2e2', 20, 'Bandages, antiseptics, and emergency supplies'),
  ('cat-010', 'Prescription Medicines', '📋', '#e0f2fe', 12, 'Medicines requiring a valid prescription')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  count = EXCLUDED.count,
  description = EXCLUDED.description;

-- 2. MEDICINES
INSERT INTO public.medicines (
  id, name, brand, category, price, original_price, discount,
  image, description, uses, side_effects, dosage,
  availability, stock, requires_prescription, rating, review_count, tags
) VALUES
  ('med-001', 'Paracetamol 500mg', 'Panadol', 'Pain Relief', 45, 60, 25, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 'Paracetamol is a common painkiller used to treat aches and pain. It can also be used to reduce a high temperature.', ARRAY['Headache', 'Mild to moderate pain', 'Fever reduction', 'Toothache', 'Back pain'], ARRAY['Nausea', 'Liver damage (overdose)', 'Skin rash (rare)'], '1-2 tablets every 4-6 hours. Maximum 8 tablets in 24 hours.', 'in-stock', 200, false, 4.8, 1240, ARRAY['painkiller', 'fever', 'headache']),
  ('med-002', 'Ibuprofen 400mg', 'Brufen', 'Pain Relief', 75, 90, 17, 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop', 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to reduce pain, fever, and inflammation.', ARRAY['Arthritis', 'Menstrual cramps', 'Headache', 'Dental pain', 'Muscle pain'], ARRAY['Stomach upset', 'Heartburn', 'Dizziness', 'Increased bleeding risk'], '1 tablet 3 times daily with food.', 'in-stock', 150, false, 4.6, 890, ARRAY['anti-inflammatory', 'painkiller', 'nsaid']),
  ('med-003', 'Vitamin C 1000mg', 'Celin', 'Vitamins & Supplements', 120, 150, 20, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop', 'Vitamin C (ascorbic acid) is an essential nutrient that supports immune function, collagen synthesis, and antioxidant protection.', ARRAY['Immune support', 'Antioxidant', 'Collagen production', 'Iron absorption', 'Wound healing'], ARRAY[]::text[], '1 tablet daily after meals.', 'in-stock', 300, false, 4.7, 2100, ARRAY['vitamin', 'immunity', 'supplement']),
  ('med-004', 'Multivitamin Complex', 'Supradyn', 'Vitamins & Supplements', 350, 420, 17, 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop', 'A comprehensive multivitamin and multimineral supplement for daily nutritional support.', ARRAY['Daily nutrition', 'Energy support', 'Immune health', 'Bone health', 'Antioxidant protection'], ARRAY[]::text[], '1 tablet daily with breakfast.', 'in-stock', 180, false, 4.5, 756, ARRAY['multivitamin', 'supplement', 'daily health']),
  ('med-005', 'ORS Electrolyte Sachet', 'Electral', 'Digestive Health', 25, NULL, 0, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop', 'Oral Rehydration Salts for rapid rehydration and electrolyte replenishment during diarrhea and vomiting.', ARRAY['Dehydration', 'Diarrhea', 'Vomiting', 'Heat exhaustion', 'Sports recovery'], ARRAY[]::text[], 'Dissolve 1 sachet in 200ml water. Drink as directed.', 'in-stock', 500, false, 4.9, 3400, ARRAY['ors', 'hydration', 'electrolyte']),
  ('med-006', 'Dettol Antiseptic Liquid', 'Dettol', 'First Aid', 180, 200, 10, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 'A trusted antiseptic liquid that kills 99.9% of germs and helps protect against infection in cuts and wounds.', ARRAY['Wound cleaning', 'Skin antiseptic', 'Surface disinfection', 'Hand hygiene'], ARRAY[]::text[], 'Dilute 1 part Dettol with 20 parts water for wound cleaning.', 'in-stock', 250, false, 4.8, 1890, ARRAY['antiseptic', 'first aid', 'disinfectant']),
  ('med-007', 'Elastic Bandage Roll', 'J&J', 'First Aid', 65, NULL, 0, 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=400&fit=crop', 'High-quality elastic bandage for compression and support of sprains, strains and sports injuries.', ARRAY['Sprains', 'Strains', 'Joint support', 'Sports injuries', 'Post-surgical compression'], ARRAY[]::text[], 'Wrap firmly but not too tight. Replace every 2-3 days.', 'in-stock', 120, false, 4.4, 432, ARRAY['bandage', 'first aid', 'sports']),
  ('med-008', 'Digital Thermometer', 'Omron', 'Personal Care', 450, 550, 18, 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=400&fit=crop', 'Accurate digital thermometer for fast and reliable temperature measurement for all ages.', ARRAY['Fever monitoring', 'Body temperature check', 'Oral/axillary/rectal use'], ARRAY[]::text[], 'Place under tongue or armpit. Wait for beep.', 'in-stock', 80, false, 4.7, 678, ARRAY['thermometer', 'device', 'monitoring']),
  ('med-009', 'Benadryl Cough Syrup', 'Benadryl', 'Cold & Flu', 135, NULL, 0, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop', 'Effective cough syrup that provides relief from dry and wet cough, cold and flu symptoms.', ARRAY['Dry cough', 'Wet cough', 'Throat irritation', 'Cold symptoms', 'Allergy cough'], ARRAY['Drowsiness', 'Dry mouth', 'Blurred vision'], '10ml 3 times daily. Do not exceed recommended dose.', 'in-stock', 160, false, 4.5, 1120, ARRAY['cough', 'cold', 'flu', 'syrup']),
  ('med-010', 'Cetaphil Moisturizing Cream', 'Cetaphil', 'Skin Care', 680, 780, 13, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 'Gentle, non-greasy moisturizing cream for dry and sensitive skin. Dermatologist recommended.', ARRAY['Dry skin', 'Sensitive skin', 'Eczema relief', 'Post-wash moisturizing', 'Daily hydration'], ARRAY[]::text[], 'Apply to affected areas as needed.', 'in-stock', 95, false, 4.9, 2340, ARRAY['moisturizer', 'skin care', 'sensitive skin']),
  ('med-011', 'Metformin 500mg', 'Glucophage', 'Diabetes Care', 95, NULL, 0, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 'Metformin is an oral diabetes medicine that helps control blood sugar levels in type 2 diabetes.', ARRAY['Type 2 diabetes management', 'Blood sugar control', 'Insulin resistance'], ARRAY['Nausea', 'Stomach upset', 'Diarrhea'], 'As prescribed by your doctor. Typically 1 tablet twice daily with meals.', 'in-stock', 200, true, 4.6, 890, ARRAY['diabetes', 'prescription', 'blood sugar']),
  ('med-012', 'Johnson''s Baby Lotion', 'Johnson''s', 'Baby Care', 320, 360, 11, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop', 'Gentle baby lotion formulated with the mildest ingredients to keep your baby''s skin soft and smooth.', ARRAY['Baby skin moisturizing', 'Gentle daily care', 'Sensitive skin', 'Post-bath care'], ARRAY[]::text[], 'Apply gently to baby''s skin after bath.', 'in-stock', 140, false, 4.8, 1560, ARRAY['baby', 'lotion', 'gentle']),
  ('med-013', 'Cetirizine 10mg', 'Zyrtec', 'Cold & Flu', 55, NULL, 0, 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop', 'Cetirizine is an antihistamine used to relieve allergy symptoms such as runny nose, sneezing, and itchy eyes.', ARRAY['Allergic rhinitis', 'Hay fever', 'Urticaria', 'Itchy skin', 'Sneezing'], ARRAY['Drowsiness', 'Dry mouth', 'Headache'], '1 tablet once daily.', 'in-stock', 220, false, 4.5, 780, ARRAY['antihistamine', 'allergy', 'cold']),
  ('med-014', 'Omeprazole 20mg', 'Losec', 'Digestive Health', 110, NULL, 0, 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop', 'Omeprazole reduces stomach acid and is used to treat acid reflux, heartburn, and stomach ulcers.', ARRAY['Acid reflux', 'GERD', 'Stomach ulcers', 'Heartburn', 'H. pylori infection'], ARRAY['Headache', 'Stomach pain', 'Nausea'], '1 capsule daily before breakfast.', 'in-stock', 175, false, 4.7, 1020, ARRAY['antacid', 'digestive', 'stomach']),
  ('med-015', 'Amlodipine 5mg', 'Norvasc', 'Prescription Medicines', 130, NULL, 0, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 'Amlodipine is a calcium channel blocker used to treat high blood pressure and chest pain (angina).', ARRAY['High blood pressure', 'Angina', 'Coronary artery disease'], ARRAY['Edema', 'Flushing', 'Headache', 'Dizziness'], 'As directed by your doctor.', 'in-stock', 150, true, 4.6, 560, ARRAY['blood pressure', 'prescription', 'heart']),
  ('med-016', 'Zinc Supplement 50mg', 'Zincovit', 'Vitamins & Supplements', 185, 220, 16, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop', 'Zinc supplement for immune support, wound healing, and overall health maintenance.', ARRAY['Immune support', 'Wound healing', 'Skin health', 'Growth and development'], ARRAY[]::text[], '1 tablet daily with meals.', 'limited', 45, false, 4.4, 430, ARRAY['zinc', 'supplement', 'immunity'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock;

-- 3. HEALTH ARTICLES
INSERT INTO public.articles (
  id, title, excerpt, content, image, category, author, date, read_time, tags
) VALUES
  ('art-007', '5 Simple Ways to Keep Your Blood Pressure in Check at Home', 'A comprehensive guide to managing hypertension naturally and tracking your heart health from the comfort of home.', 'With millions of adults living with high blood pressure, it can be overwhelming to know which daily habits and tools truly make a difference for your heart.

**Regular Home Monitoring**

Checking your blood pressure with a validated upper-arm monitor gives an accurate picture of your daily levels away from clinic stress. Sit quietly for 5 minutes before testing at the same times each day.

**Sodium & Diet Control**

Slashing excess salt prevents fluid retention and reduces pressure on artery walls. Reading nutrition labels and replacing table salt with herbs or spices helps keep daily sodium under 2,300 mg.

**Daily Physical Activity**

Getting 150 minutes of moderate exercise per week—like brisk walking or cycling—strengthens your heart so it pumps blood with less effort. Even 10-minute daily walks yield major benefits.

**Stress & Sleep Management**

Chronic stress and poor sleep release hormones that keep blood pressure elevated. Practicing deep breathing for 5 minutes and getting 7–9 hours of restful sleep helps keep readings stable.

**Medication Consistency**

Taking prescriptions at the same time daily ensures steady protection. Always consult your pharmacist before taking over-the-counter drugs like decongestants or NSAIDs, which can raise blood pressure.

**When Lifestyle Isn''t Enough**

While daily habits are the foundation of heart health, home monitors, pill organizers, and professional consultations can ensure your routine stays effective and safe. Speak with your pharmacist to check your home cuff or manage your prescriptions.', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop', 'Heart Health', 'Dr. Aayush Sharma', '2026-09-28', '5 min read', ARRAY['blood pressure', 'hypertension', 'heart health', 'home care', 'wellness']),
  ('art-001', 'Effective Ways to Manage the Common Cold at Home', 'Discover proven home remedies and over-the-counter treatments to help you recover faster from the common cold.', 'The common cold is one of the most frequent illnesses affecting people worldwide. While there is no cure, several strategies can help you feel better and recover more quickly.

**Stay Hydrated**
Drinking plenty of fluids is one of the most important things you can do when you have a cold. Water, herbal teas, and clear broths help keep your throat moist and thin mucus secretions.

**Rest Is Essential**
Your body needs energy to fight the viral infection. Getting adequate sleep and rest allows your immune system to work more effectively.

**Over-the-Counter Remedies**
Medicines like paracetamol and ibuprofen can reduce fever and relieve aches. Antihistamines like cetirizine can help with runny nose and sneezing.

**When to See a Doctor**
Seek medical attention if symptoms worsen after 7-10 days, you develop a high fever, or you experience chest pain or difficulty breathing.', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop', 'Cold & Flu', 'Dr. Anjali Sharma', '2026-09-15', '5 min read', ARRAY['cold', 'flu', 'home remedies', 'immunity']),
  ('art-002', 'Understanding Vitamins and Supplements: What You Actually Need', 'A comprehensive guide to essential vitamins and minerals and how to choose the right supplements for your health.', 'With thousands of supplements on the market, it can be overwhelming to know which ones are truly beneficial for your health.

**Essential Vitamins**
Vitamin D, B12, and iron are among the most commonly deficient nutrients worldwide. A blood test can help identify your specific needs.

**When Food Isn''t Enough**
While a balanced diet is the best source of nutrients, certain groups — including pregnant women, older adults, and vegetarians — may benefit from targeted supplementation.

**Quality Matters**
Look for supplements that have been third-party tested for purity and potency. Consult your pharmacist before starting any new supplement regimen.', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop', 'Vitamins & Supplements', 'Dr. Rohan Thapa', '2026-09-10', '7 min read', ARRAY['vitamins', 'supplements', 'nutrition', 'health']),
  ('art-003', 'Diabetes Management: Lifestyle Changes That Make a Difference', 'Learn how diet, exercise, and medication work together to help manage type 2 diabetes effectively.', 'Type 2 diabetes is a chronic condition that can be effectively managed with the right combination of lifestyle changes and medication.

**Diet and Nutrition**
Reducing refined carbohydrates, increasing fiber intake, and choosing low-glycemic foods can significantly improve blood sugar control.

**Regular Physical Activity**
Exercise helps cells use insulin more effectively. Even a 30-minute walk daily can lower blood sugar levels.

**Medication Adherence**
If prescribed medication such as Metformin, taking it consistently as directed is crucial for maintaining stable blood glucose levels.

**Regular Monitoring**
Home blood glucose monitoring helps you understand how food, activity, and medication affect your blood sugar.', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop', 'Diabetes Care', 'Dr. Priya Adhikari', '2026-09-05', '8 min read', ARRAY['diabetes', 'blood sugar', 'lifestyle', 'management']),
  ('art-004', 'First Aid Essentials: What Every Home Should Have', 'Build a comprehensive first aid kit and learn the basics of handling common household emergencies.', 'A well-stocked first aid kit can make a significant difference in an emergency situation. Here''s what every home should have.

**Essential Supplies**
Your kit should include adhesive bandages, gauze pads, antiseptic wipes, digital thermometer, tweezers, and scissors.

**Medications to Keep On Hand**
Paracetamol for pain and fever, antihistamines for allergic reactions, antiseptic solution for wound cleaning, and ORS sachets for dehydration.

**Basic First Aid Skills**
Knowing how to apply pressure to a wound, treat burns with cool running water, and recognize signs of shock can save lives.', 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&h=400&fit=crop', 'First Aid', 'Nurse Binita Rai', '2026-08-28', '6 min read', ARRAY['first aid', 'emergency', 'home safety', 'kit']),
  ('art-005', 'Building a Healthy Lifestyle: Simple Habits for Better Wellbeing', 'Small daily habits can lead to significant improvements in your physical and mental health over time.', 'A healthy lifestyle doesn''t require drastic changes. Small, consistent habits compound over time to produce remarkable results.

**Sleep Hygiene**
Aim for 7-9 hours of quality sleep each night. Consistent sleep and wake times help regulate your body clock.

**Hydration**
Drinking 8-10 glasses of water daily supports every bodily function from digestion to cognitive performance.

**Stress Management**
Chronic stress contributes to numerous health problems. Practice mindfulness, yoga, or deep breathing exercises to manage stress effectively.

**Regular Health Checks**
Annual health screenings can catch problems early when they are most treatable.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop', 'Healthy Lifestyle', 'Dr. Sanjay Poudel', '2026-08-20', '6 min read', ARRAY['lifestyle', 'wellness', 'habits', 'health']),
  ('art-006', 'Medicine Safety: How to Store and Use Medications Correctly', 'Proper medication storage and usage is critical for effectiveness and safety. Learn the essential guidelines.', 'Improper medication storage or usage can reduce effectiveness and even cause harm. Here are the essential guidelines every patient should follow.

**Storage Guidelines**
Most medicines should be stored in a cool, dry place away from direct sunlight. Avoid bathroom medicine cabinets due to humidity.

**Reading Labels**
Always read medicine labels carefully. Pay attention to dosage instructions, expiry dates, and warnings about food or drug interactions.

**Never Share Medications**
Even if symptoms seem similar, sharing prescription medications is dangerous and illegal. Always consult a healthcare professional.

**Disposal**
Don''t flush medicines down the toilet. Many pharmacies, including Ezra Pharmacy, offer safe medicine disposal services.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop', 'Medicine Safety', 'PharmD. Sunita Karki', '2026-08-15', '5 min read', ARRAY['medicine safety', 'storage', 'medications', 'tips'])
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content;

import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock, HeartPulse, Star, ChevronRight, Phone } from 'lucide-react';
import { medicines } from '../data/medicines';
import { categories } from '../data/categories';
import { articles } from '../data/articles';
import MedicineCard from '../components/medicine/MedicineCard';
import CategoryCard from '../components/medicine/CategoryCard';

const testimonials = [
  { name: 'Sita Sharma', location: 'Kathmandu', rating: 5, text: 'Ezra Pharmacy has been my go-to for all medicines. The delivery is fast and the pharmacists are always helpful with my queries.' },
  { name: 'Ramesh Thapa', location: 'Lalitpur', rating: 5, text: 'I love that I can upload my prescription and get everything delivered home. Saved so much time during my recovery.' },
  { name: 'Priya Rai', location: 'Bhaktapur', rating: 5, text: 'Genuine medicines, great prices, and excellent customer service. Highly recommended for all your healthcare needs!' },
  { name: 'Bikash Shrestha', location: 'Pokhara', rating: 4, text: 'Very convenient! The app is easy to use and the medicine quality is excellent. Will definitely keep ordering.' },
];

const features = [
  { icon: '🚚', title: 'Fast Home Delivery', desc: 'Get medicines delivered to your doorstep within 2-4 hours across Kathmandu Valley.', color: 'var(--green-50)' },
  { icon: '👨‍⚕️', title: 'Licensed Pharmacists', desc: 'Our certified pharmacists review every prescription and are available for consultation.', color: 'var(--blue-50)' },
  { icon: '✅', title: '100% Genuine Medicines', desc: 'All medicines sourced directly from authorized manufacturers and distributors.', color: 'var(--green-50)' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your health data and personal information are protected with enterprise-grade security.', color: 'var(--blue-50)' },
  { icon: '💊', title: '10,000+ Products', desc: 'Extensive catalog covering all therapeutic categories and healthcare products.', color: 'var(--green-50)' },
  { icon: '📞', title: '24/7 Support', desc: 'Round-the-clock customer support and emergency medicine assistance.', color: 'var(--blue-50)' },
];

const services = [
  { icon: '🚚', title: 'Medicine Delivery', desc: 'Same-day and scheduled delivery options' },
  { icon: '📋', title: 'Prescription Upload', desc: 'Easy prescription processing and verification' },
  { icon: '💬', title: 'Health Consultation', desc: 'Free pharmacist consultation service' },
  { icon: '⏰', title: 'Medicine Reminders', desc: 'Never miss a dose with smart reminders' },
  { icon: '🩺', title: 'BP Monitoring', desc: 'Free blood pressure check at our pharmacy' },
  { icon: '🩸', title: 'Diabetes Support', desc: 'Comprehensive diabetic care program' },
  { icon: '🩹', title: 'First Aid Supplies', desc: 'Complete first aid kits and supplies' },
  { icon: '📦', title: 'Monthly Packages', desc: 'Subscription packages for regular medications' },
];

export default function Home() {
  const navigate = useNavigate();
  const featured = medicines.filter(m => !m.requiresPrescription).slice(0, 8);
  const popularCategories = categories.slice(0, 10);

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="hero" style={{ paddingTop: 'calc(var(--nav-height) + 60px)', paddingBottom: '80px' }}>
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-eyebrow">
                <HeartPulse size={14} />
                Nepal's Trusted Online Pharmacy
              </div>
              <h1 className="hero-title">
                Your Trusted Pharmacy,{' '}
                <span className="highlight">Anytime,</span>{' '}
                Anywhere
              </h1>
              <p className="hero-desc">
                Order genuine medicines, vitamins, and healthcare products online. 
                Fast delivery across Nepal with expert pharmacist guidance. 
                Your health is our priority.
              </p>
              <div className="hero-actions">
                <Link to="/medicines" className="btn btn-primary btn-lg">
                  Shop Medicines <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="btn btn-secondary btn-lg">
                  Contact Us <Phone size={16} />
                </Link>
              </div>
              <div className="hero-stats">
                <div>
                  <div className="hero-stat-value">50K+</div>
                  <div className="hero-stat-label">Happy Customers</div>
                </div>
                <div>
                  <div className="hero-stat-value">10K+</div>
                  <div className="hero-stat-label">Products</div>
                </div>
                <div>
                  <div className="hero-stat-value">4.9★</div>
                  <div className="hero-stat-label">Avg. Rating</div>
                </div>
              </div>
            </div>

            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=600&fit=crop"
                alt="Professional pharmacist at Ezra Pharmacy"
                className="hero-img"
              />
              <div className="hero-badge-floating badge-1">
                <div style={{ width: 36, height: 36, background: 'var(--green-100)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🚚</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-900)' }}>Free Delivery</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Orders above Rs. 500</div>
                </div>
              </div>
              <div className="hero-badge-floating badge-2">
                <div style={{ width: 36, height: 36, background: 'var(--green-100)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>✅</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-900)' }}>100% Genuine</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Verified medicines</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <div style={{ background: 'var(--primary)', color: 'white', padding: '14px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
            {[
              { icon: <Truck size={16} />, text: 'Free Delivery on Rs. 500+' },
              { icon: <Shield size={16} />, text: 'DDA Registered Pharmacy' },
              { icon: <Clock size={16} />, text: '24/7 Customer Support' },
              { icon: <Star size={16} />, text: '4.9 Star Rating' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                {item.icon} {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ CATEGORIES ============ */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">Browse by Category</div>
            <h2 className="heading-lg">Popular Categories</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '1.05rem' }}>
              Find medicines and healthcare products across all major categories
            </p>
          </div>
          <div className="grid-5">
            {popularCategories.map(cat => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onClick={() => navigate(`/medicines?category=${encodeURIComponent(cat.name)}`)}
              />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/categories" className="btn btn-secondary">
              View All Categories <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FEATURED MEDICINES ============ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">✨ Featured Products</div>
            <h2 className="heading-lg">Popular Medicines</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '1.05rem' }}>
              Top-rated medicines trusted by thousands of customers
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {featured.map(med => (
              <MedicineCard key={med.id} medicine={med} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/medicines" className="btn btn-primary btn-lg">
              View All Medicines <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">Why Ezra Pharmacy</div>
            <h2 className="heading-lg">Your Health, Our Commitment</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '1.05rem' }}>
              We go beyond just selling medicines — we care about your complete wellbeing
            </p>
          </div>
          <div className="grid-3">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: f.color }}>
                  <span style={{ fontSize: '1.75rem' }}>{f.icon}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '10px', color: 'var(--gray-900)' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '16px' }}>Our Services</div>
              <h2 className="heading-lg" style={{ marginBottom: '16px' }}>
                Complete Healthcare<br />Solutions for You
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1rem', lineHeight: 1.7 }}>
                From prescription medicines to health consultations and home delivery — 
                Ezra Pharmacy offers everything you need for your health journey.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {services.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px', borderRadius: 'var(--radius-lg)', background: 'var(--gray-50)', border: '1px solid var(--border)', transition: 'var(--transition)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-200)'; (e.currentTarget as HTMLElement).style.background = 'var(--green-50)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--gray-50)'; }}>
                    <span style={{ fontSize: '1.35rem' }}>{s.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-900)', marginBottom: '2px' }}>{s.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&h=700&fit=crop"
                alt="Pharmacy services"
                style={{ width: '100%', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-xl)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">⭐ Customer Reviews</div>
            <h2 className="heading-lg">What Our Customers Say</h2>
          </div>
          <div className="grid-4">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-900)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HEALTH ARTICLES ============ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">📖 Health Tips</div>
            <h2 className="heading-lg">Health Articles & Tips</h2>
          </div>
          <div className="grid-3">
            {articles.slice(0, 3).map(article => (
              <Link key={article.id} to={`/articles/${article.id}`} style={{ textDecoration: 'none' }}>
                <div className="article-card">
                  <div style={{ height: 200, overflow: 'hidden' }}>
                    <img src={article.image} alt={article.title} className="article-img" />
                  </div>
                  <div className="article-body">
                    <div className="article-category">{article.category}</div>
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-excerpt">{article.excerpt}</p>
                    <div className="article-meta">
                      <span>{article.date}</span>
                      <span>·</span>
                      <span>{article.readTime}</span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Read More <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/articles" className="btn btn-secondary">
              View All Articles <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="cta-section">
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💊</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '16px', color: 'white' }}>
            Need Medicines Delivered Fast?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.6 }}>
            Upload your prescription or browse our catalog and get genuine medicines delivered to your doorstep.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/medicines" style={{ padding: '14px 28px', background: 'white', color: 'var(--primary)', borderRadius: 'var(--radius-xl)', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, transition: 'var(--transition)' }}>
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link to="/prescription" style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.4)', borderRadius: 'var(--radius-xl)', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, transition: 'var(--transition)' }}>
              Upload Prescription
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from "react";
import yes from "../assets/yes.png";
import {
  FaCheckCircle,
  FaArrowRight,
  FaTrophy,
  FaMapMarkerAlt,
  FaUserTie,
  FaCalendarAlt,
  FaCar,
  FaHeart,
} from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    icon: FaTrophy,
    title: "High Pass Rate",
    desc: "We maintain one of the highest first-time pass rates in West London.",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Door-to-Door Service",
    desc: "We pick you up and drop you off — no hassle, no travel stress.",
  },
  {
    icon: FaUserTie,
    title: "Expert Instructors",
    desc: "Our instructors are fully qualified, professional, and approachable.",
  },
  {
    icon: FaCalendarAlt,
    title: "Flexible Scheduling",
    desc: "Book lessons around your life — weekdays, evenings, and weekends.",
  },
  {
    icon: FaCar,
    title: "Dual-Control Vehicles",
    desc: "Modern, safe vehicles with dual controls for full peace of mind.",
  },
  {
    icon: FaHeart,
    title: "Personalised Lessons",
    desc: "Every student gets tailored instruction to accelerate their progress.",
  },
];

const WhyUs = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .whyus-section {
          background: #fafafa;
          position: relative;
          overflow: hidden;
          padding: 96px 0 112px;
          font-family: 'DM Sans', sans-serif;
        }

        /* Big faint background number */
        .whyus-bg-text {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Sora', sans-serif;
          font-size: clamp(120px, 20vw, 220px);
          font-weight: 800;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(220,38,38,0.06);
          white-space: nowrap;
          user-select: none;
          pointer-events: none;
          z-index: 0;
          letter-spacing: -0.04em;
        }

        /* Subtle dot grid */
        .whyus-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(220,38,38,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%);
        }

        .whyus-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        /* ── Header ── */
        .whyus-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .whyus-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(220,38,38,0.08);
          border: 1px solid rgba(220,38,38,0.2);
          border-radius: 100px;
          padding: 5px 14px;
          margin-bottom: 20px;
        }

        .whyus-pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #dc2626;
          animation: blink 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .whyus-pill-text {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #dc2626;
        }

        .whyus-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 800;
          color: #111827;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin: 0 0 16px;
        }

        .whyus-title .accent {
          color: #dc2626;
          position: relative;
        }

        .whyus-subtitle {
          color: #6b7280;
          font-size: 1.05rem;
          font-weight: 400;
          line-height: 1.6;
          max-width: 480px;
          margin: 0 auto;
        }

        /* ── Cards grid ── */
        .whyus-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 640px) {
          .whyus-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 900px) {
          .whyus-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .feature-card {
          background: #fff;
          border: 1px solid #f0f0f0;
          border-radius: 20px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          overflow: hidden;
          cursor: default;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.25s;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #dc2626, #f87171);
          border-radius: 20px 20px 0 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }

        .feature-card:hover {
          border-color: #fecaca;
          box-shadow: 0 12px 40px rgba(220,38,38,0.1);
          transform: translateY(-4px);
        }

        .feature-card:hover::before {
          transform: scaleX(1);
        }

        .feature-card:hover .card-icon-wrap {
          background: #dc2626;
        }

        .feature-card:hover .card-icon {
          color: #fff;
        }

        .card-number {
          position: absolute;
          top: 16px;
          right: 18px;
          font-family: 'Sora', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          color: #e5e7eb;
          letter-spacing: 0.05em;
        }

        .card-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #fef2f2;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
          flex-shrink: 0;
        }

        .card-icon {
          color: #dc2626;
          font-size: 20px;
          transition: color 0.3s;
        }

        .card-title {
          font-family: 'Sora', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .card-desc {
          font-size: 0.88rem;
          color: #6b7280;
          line-height: 1.65;
          margin: 0;
        }

        /* ── Bottom trust bar ── */
        .trust-bar {
          margin-top: 72px;
          background: #111827;
          border-radius: 24px;
          padding: 36px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          position: relative;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .trust-bar {
            flex-direction: row;
            justify-content: space-between;
          }
        }

        .trust-bar::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(220,38,38,0.2), transparent 70%);
          pointer-events: none;
        }

        .trust-bar-text {
          z-index: 1;
        }

        .trust-bar-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
        }

        .trust-bar-sub {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.5);
          margin: 0;
        }

        .trust-stats {
          display: flex;
          gap: 32px;
          z-index: 1;
          flex-wrap: wrap;
          justify-content: center;
        }

        .trust-stat {
          text-align: center;
        }

        .trust-stat-value {
          font-family: 'Sora', sans-serif;
          font-size: 1.7rem;
          font-weight: 800;
          color: #fff;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .trust-stat-value span {
          color: #f87171;
        }

        .trust-stat-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.4);
          margin-top: 4px;
        }

        .trust-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #dc2626;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          padding: 14px 26px;
          border-radius: 100px;
          text-decoration: none;
          white-space: nowrap;
          z-index: 1;
          position: relative;
          overflow: hidden;
          transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
          box-shadow: 0 6px 24px rgba(220,38,38,0.35);
        }

        .trust-cta::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transition: left 0.5s;
        }

        .trust-cta:hover::after { left: 100%; }
        .trust-cta:hover {
          background: #b91c1c;
          transform: translateY(-1px);
          box-shadow: 0 10px 32px rgba(220,38,38,0.45);
        }
      `}</style>

      <section className="whyus-section" aria-labelledby="why-choose-us">
        <div className="whyus-dots" />
        <div className="whyus-bg-text">360°</div>

        <div className="whyus-container">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="whyus-header"
          >
            <div className="whyus-pill">
              <div className="whyus-pill-dot" />
              <span className="whyus-pill-text">Why Choose Us</span>
            </div>

            <h1 id="why-choose-us" className="whyus-title">
              The <span className="accent">360°</span> Difference —<br />
              Built Around You
            </h1>

            <p className="whyus-subtitle">
              Discover why hundreds of students trust 360 Drive Academy to get
              them on the road with skill and confidence.
            </p>
          </motion.div>

          {/* ── Feature Cards ── */}
          <div className="whyus-grid">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="feature-card"
              >
                <span className="card-number">0{i + 1}</span>

                <div className="card-icon-wrap">
                  <Icon className="card-icon" />
                </div>

                <div>
                  <h3 className="card-title">{title}</h3>
                  <p className="card-desc" style={{ marginTop: "6px" }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Trust bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="trust-bar"
          >
            <div className="trust-bar-text">
              <p className="trust-bar-title">Ready to get started?</p>
              <p className="trust-bar-sub">
                Join 1,000+ students who passed with 360 Drive Academy.
              </p>
            </div>

            <div className="trust-stats">
              {[
                { value: "90", unit: "%", label: "Pass Rate" },
                { value: "10", unit: "+", label: "Years Exp." },
                { value: "1K", unit: "+", label: "Students" },
              ].map(({ value, unit, label }) => (
                <div key={label} className="trust-stat">
                  <div className="trust-stat-value">
                    {value}<span>{unit}</span>
                  </div>
                  <div className="trust-stat-label">{label}</div>
                </div>
              ))}
            </div>

            <a href="#courses" className="trust-cta">
              Book a Lesson
              <FaArrowRight style={{ fontSize: "12px" }} />
            </a>
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default WhyUs;
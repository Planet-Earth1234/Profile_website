"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export default function Home() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10,
        size: 2 + Math.random() * 4,
      }))
    );
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    const scroll = () => setScrollY(window.scrollY);

    window.addEventListener("mousemove", move);
    window.addEventListener("scroll", scroll);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", scroll);
    };
  }, []);

  return (
    <div className="relative">
      <style jsx global>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-rotate {
          0%, 100% {
            transform: translateY(0) rotate(-5deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes text-shimmer {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(6, 182, 212, 0.8), 0 0 30px rgba(6, 182, 212, 0.6);
          }
        }

        @keyframes float-particle {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(100px);
            opacity: 0;
          }
        }

        @keyframes slide-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-float-rotate {
          animation: float-rotate 4s ease-in-out infinite;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-text-shimmer {
          animation: text-shimmer 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle linear infinite;
        }

        .animate-slide-right {
          animation: slide-right 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>

      <main className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden relative">
        {/* Floating particles background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-cyan-400/30 animate-float-particle"
              style={{
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                width: p.size,
                height: p.size,
              }}
            />
          ))}
        </div>

        {/* Cursor follower */}
        <div
          className="hidden lg:block fixed w-6 h-6 bg-cyan-400/30 blur-xl rounded-full z-50 pointer-events-none"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Navigation */}
        <nav className="sticky top-0 bg-black/20 backdrop-blur-md p-4 shadow-xl z-40 border-b border-white/10 animate-slideDown">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
              Rahul Gupta
            </h1>
            <div className="flex gap-6">
              {["About", "Skills", "Projects", "Contact"].map((t) => (
                <a
                  key={t}
                  href={`#${t.toLowerCase()}`}
                  className="text-white/80 hover:text-cyan-400 transition group relative"
                >
                  {t}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all"></span>
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="about" className="flex flex-col items-center justify-center py-12 sm:py-20 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 relative overflow-hidden px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse-slow"></div>

          <div 
            data-animate 
            id="hero"
            className={`bg-white/5 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-10 max-w-lg w-full text-center border border-white/10 relative z-10 transition-all duration-1000 ${
              isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full mx-auto mb-6 shadow-2xl ring-4 ring-cyan-400/50 ring-offset-4 ring-offset-slate-900 overflow-hidden animate-float-rotate relative group">
              <Image
                src="/my_image.jpeg"
                alt="Rahul Gupta"
                width={144}
                height={144}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fadeIn">
              Hi, I&apos;m Rahul Gupta 👋
            </h1>

            <p className="text-cyan-300 text-base sm:text-lg mb-4 sm:mb-6 font-medium animate-fadeIn animate-glow" style={{ animationDelay: '0.2s' }}>
              AI/ML Engineer · Startup Enthusiast · Lifelong Learner
            </p>

            <p className="text-white/80 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              Driven to democratize education through AI. I hold a B.E. in Computer Science & Engineering (AI & ML) from the University of Mumbai.
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              {[
                { href: 'https://github.com/Planet-Earth1234/Planet-Earth1234/blob/main/README.md', text: 'GitHub', icon: '🤖'},
                { href: 'https://www.linkedin.com/in/rahul-g-28333427b/', text: 'LinkedIn', icon: '💼' },
                { href: 'mailto:rahulgupta190310587044@gmail.com', text: 'Email', icon: '✉️' }
              ].map((link) => (
                <a
                  key={link.text}
                  href={link.href}
                  className="text-cyan-400 hover:text-white transition-all duration-300 hover:scale-110 font-semibold px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-cyan-400/30 text-sm sm:text-base"
                >
                  {link.icon} {link.text}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-12 sm:py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative px-4">
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 
              data-animate
              id="skills-title"
              className={`text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent transition-all duration-1000 ${
                isVisible['skills-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Technical Skills
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {[
                { title: 'Languages', items: ['Python', 'JavaScript', 'SQL', 'HTML', 'CSS'], icon: '🔤' },
                { title: 'AI/ML', items: ['PyTorch', 'TensorFlow', 'Transformers', 'BERT', 'LoRA/QLoRA'], icon: '🤖' },
                { title: 'Computer Vision', items: ['OpenCV', 'YOLOv8', 'Object Detection', 'OCR'], icon: '👁️' },
                { title: 'Tools', items: ['Docker', 'Git', 'Flask', 'Linux', 'Hugging Face'], icon: '⚡' }
              ].map((skill, idx) => (
                <div
                  key={idx}
                  data-animate
                  id={`skill-${idx}`}
                  className={`bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/10 transition-all duration-1000 hover:scale-105 group ${
                    isVisible[`skill-${idx}`] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <span className="text-2xl">{skill.icon}</span>
                    <h3 className="font-bold text-lg sm:text-xl text-cyan-400">{skill.title}</h3>
                  </div>
                  <ul className="space-y-2 text-white/80 text-sm sm:text-base">
                    {skill.items.map((item, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-12 sm:py-20 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative px-4">
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 
              data-animate
              id="projects-title"
              className={`text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-1000 ${
                isVisible['projects-title'] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
            >
              Key Projects
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {[
                { title: 'AI Math Tutor', desc: 'Web-based tutoring platform using YOLOv8, OCR, Flask, and LLaMA for real-time responses.', link: 'https://github.com/Planet-Earth1234/Ai_math_tutor', icon: '🧮' },
                { title: 'NLP Fine-tuning', desc: 'Fine-tuned BERT and mBART models with LoRA/QLoRA, reducing training time by 60%.', link: 'https://github.com/Planet-Earth1234/Ai_math_tutor/blob/main/Customer_issue.ipynb', icon: '📊' },
                { title: 'Food Classifier', desc: 'Fine-tuned EfficientNet model for Indian food classification, deployed via Docker.', link: 'https://github.com/Planet-Earth1234/Food-Decoder', icon: '🍛' },
                { title: 'ECHO TWEET', desc: 'Bird audio classification using PyTorch and Librosa, achieving 85% accuracy.', link: 'https://github.com/Planet-Earth1234/ECHO-TWEET', icon: '🐦' }
              ].map((project, idx) => (
                <div
                  key={idx}
                  data-animate
                  id={`project-${idx}`}
                  className={`bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10 transition-all duration-1000 hover:scale-105 group ${
                    isVisible[`project-${idx}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <span className="text-3xl">{project.icon}</span>
                    <h3 className="font-bold text-lg sm:text-xl text-cyan-400">{project.title}</h3>
                  </div>
                  <p className="text-white/80 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    {project.desc}
                  </p>
                  <a href={project.link} className="inline-flex items-center gap-2 text-cyan-400 hover:text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 transition-all duration-300 text-sm sm:text-base">
                    <span>View Project</span>
                    <span>→</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 sm:py-20 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 text-center relative overflow-hidden px-4">
          <div 
            data-animate
            id="contact-content"
            className={`relative z-10 transition-all duration-1000 ${
              isVisible['contact-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-white/80 mb-6 sm:mb-10 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed px-4">
              Open to collaborations on AI/edtech startups. Let&apos;s build something impactful! 🚀
            </p>
            <a
              href="mailto:rahulgupta190310587044@gmail.com"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full hover:scale-110 transition-all duration-300 font-bold text-base sm:text-lg shadow-2xl"
            >
              <span>Send Message</span>
              <span className="text-2xl">✨</span>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/30 backdrop-blur-md p-4 sm:p-6 text-center text-white/60 border-t border-white/10">
          <div className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold text-sm sm:text-base">
            © 2025 Rahul Gupta. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}
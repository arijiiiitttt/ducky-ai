import React from "react";

const features = [
  [
    {
      title: "Resume Upload & Parsing",
      desc: "Users can upload resumes in PDF/PNG/JPG formats. The system extracts skills, experience, and projects using AI-based parsing.",
      icon: "📄"
    },
    {
      title: "Real-Time Job Aggregation",
      desc: "Fetches job and internship listings from multiple portals like Internshala, Glassdoor, and AngelList using public APIs.",
      icon: "🌐"
    },
    {
      title: "SMS Recommendations",
      desc: "Users can opt to receive job suggestions via SMS using free APIs like Twilio or Fast2SMS — ideal for low internet zones.",
      icon: "📱"
    },
  ],
  [
    {
      title: "Smart Ranking Algorithm",
      desc: "Jobs are ranked based on skill-experience match and market demand, highlighting roles with the highest success probability.",
      icon: "📊"
    },
    {
      title: "Privacy-First Design",
      desc: "Processes personal data securely with no long-term storage. Users are shown a privacy disclaimer before submission.",
      icon: "🔒"
    },
    {
      title: "Inclusive Access",
      desc: "Designed for students in Tier-2/3 cities with lightweight deployment and mobile-friendly UI for broader reach.",
      icon: "🌍"
    },
  ],
  [
    {
      title: "Multi-Source Aggregation",
      desc: "Combines listings from Jooble, Remotive, Adzuna, and more to ensure wide coverage and fallback reliability.",
      icon: "🧩"
    },
    {
      title: "AI Matching Engine",
      desc: "Uses keyword-based matching initially, with plans to integrate semantic models like BERT for deeper relevance.",
      icon: "🤖"
    },
    {
      title: "Email Fallback",
      desc: "If SMS fails, recommendations can be sent via email to ensure delivery and continuity.",
      icon: "📧"
    }
  ]
];

export default function Features() {
  return (
    <section id="features" className="min-h-screen py-4 px-6 pb-10 text-center flex items-center justify-center">
      <div className="container">
        <h3 className="text-3xl font-bold bowl mb-4">Platform Features 🚀</h3>
        <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
          This platform empowers students and job seekers by offering personalized, real-time job recommendations based on their resume or entered details. Built for accessibility, speed, and impact.
        </p>
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto px-9">
          {features.flat().map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-left">
              <div className="text-2xl w-12 h-12 flex items-center justify-center rounded-full bg-amber-200 shrink-0">
                {f.icon}
              </div>
              <div>
                <h4 className="font-semibold text-lg">{f.title}</h4>
                <p className="text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
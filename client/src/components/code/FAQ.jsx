import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is Ducky AI?",
    answer:
      "Ducky AI is a smart job and internship recommendation platform that uses AI-powered resume parsing and job aggregation. It helps students and job seekers find the most relevant opportunities by matching their skills, experience, and projects with real-time listings from multiple free job portals.",
  },
  {
    question: "How does Ducky AI work?",
    answer:
      "Users can either upload their resumes or manually enter their details, and the platform uses AI-powered resume parsing to extract key skills and experiences, fetches job postings from sources like Indeed, Glassdoor, and Internshala, and then ranks the results to display or send them via SMS.",
  },
  {
    question: "What makes Ducky AI unique compared to other job portals?",
    answer:
      "Unlike typical job portals, Ducky AI provides personalized recommendations, aggregates listings from multiple free APIs in one place, automatically parses resumes to save time, delivers results via SMS for accessibility, and ranks jobs by relevance and success probability rather than randomness.",
  },
  {
    question: "Who can use Ducky AI?",
    answer:
      "Ducky AI is designed for students and freshers seeking internships, job seekers looking for relevant opportunities, colleges and career support systems guiding students, and companies or recruiters who want to connect with better-matched candidates.",
  },
  {
    question: "How does Ducky AI ensure data privacy?",
    answer:
      "The platform handles resumes and personal data securely by processing them only for recommendations, avoiding long-term storage unless users opt in, using trusted APIs for SMS and job fetching, and maintaining transparency with privacy disclaimers.",
  },
  {
    question: "Is the platform affordable for students?",
    answer:
      "Yes, Ducky AI is cost-effective since it relies on free APIs, open-source tools, and free hosting services like Vercel or Netlify, ensuring accessibility for students, especially those from Tier-2 and Tier-3 cities with limited resources.",
  },
  {
    question: "What benefits does Ducky AI provide?",
    answer:
      "Ducky AI reduces stress and effort in job searches by simplifying access to relevant opportunities, promotes fairness by matching skills rather than degrees, saves time and costs for candidates and recruiters, and contributes to sustainability by eliminating the need for printed resumes and physical job hunts.",
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full px-6  py-12 md:px-8 lg:px-16 bg-white">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side - Title */}
        <div>
          <p className="text-sm bowl font-medium  text-amber-600 mb-2">
            Frequently asked questions
          </p>
          <h2 className="text-3xl  bowl md:text-3xl font-bold text-gray-900 mb-4">
            Frequently asked <span className="text-amber-600">questions</span>
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Answers to some of the most common questions about Ducky AI.
          </p>
        </div>

        {/* Right Side - FAQ Accordion */}
        <div className="space-y-4 ">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-2xl shadow-sm bg-gray-50 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 text-left cursor-pointer focus:outline-none"
              >
                <span className="text-gray-900 font-medium">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-amber-600" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.section
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: "auto" },
                      collapsed: { opacity: 0, height: 0 },
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
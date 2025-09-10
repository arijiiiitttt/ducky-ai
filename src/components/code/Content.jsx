import React, { useState, useEffect } from "react";
import { Upload, Moon, Sun } from "lucide-react";
import logo from "./logo.jpg";

function Content() {
  const [file, setFile] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Apply dark mode class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl shadow 
                   bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Logo + Tagline */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={logo}
          alt="Logo"
          className="w-24 h-24 rounded-full shadow-md"
        />
        <h1 className="text-xl font-bold mt-2 text-gray-900 dark:text-gray-100">
          Content Versioning System
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Manage and track your projects, resumes, and documents easily
        </p>
      </div>

      {/* Form Section */}
      <form className="w-full max-w-2xl p-6 space-y-4 ">
        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded-lg px-4 py-2 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-600
                     focus:ring focus:ring-blue-400"
        />

        {/* Phone */}
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border rounded-lg px-4 py-2 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-600
                     focus:ring focus:ring-blue-400"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          className="w-full border rounded-lg px-4 py-2 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-600
                     focus:ring focus:ring-blue-400"
        />

        {/* Role Dropdown */}
        <select
          className="w-full border rounded-lg px-4 py-2 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-600
                     focus:ring focus:ring-blue-400"
        >
          <option>Select Role</option>
          <option>Student</option>
          <option>Developer</option>
          <option>Reviewer</option>
        </select>

        {/* Project Details */}
        <textarea
          placeholder="Project Details (e.g., Project Title, Description, Tech Stack)"
          className="w-full border rounded-lg px-4 py-2 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-600
                     focus:ring focus:ring-blue-400 h-24"
        />

        {/* Skills */}
        <input
          type="text"
          placeholder="Skills (comma separated)"
          className="w-full border rounded-lg px-4 py-2 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-600
                     focus:ring focus:ring-blue-400"
        />

        {/* Frameworks */}
        <input
          type="text"
          placeholder="Frameworks / Libraries (comma separated)"
          className="w-full border rounded-lg px-4 py-2 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-600
                     focus:ring focus:ring-blue-400"
        />

        {/* Description */}
        <textarea
          placeholder="Short description about your document"
          className="w-full border rounded-lg px-4 py-2 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-600
                     focus:ring focus:ring-blue-400 h-20"
        />

        {/* Tags */}
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="w-full border rounded-lg px-4 py-2 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-600
                     focus:ring focus:ring-blue-400"
        />

        {/* Upload Zone */}
        <div className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl p-6 text-center">
          <label className="cursor-pointer flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-500 dark:text-gray-300" />
            <span className="text-gray-600 dark:text-gray-300">
              {file ? file.name : "Drag & drop or click to upload"}
            </span>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        {/* Version Notes */}
        <textarea
          placeholder="Version Notes (what changed?)"
          className="w-full border rounded-lg px-4 py-2 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-600
                     focus:ring focus:ring-blue-400 h-20"
        />

        {/* Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="w-4 h-4 border-gray-400 dark:border-gray-600"
          />
          <label className="text-gray-600 dark:text-gray-300 text-sm">
            I agree to the terms & conditions
          </label>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            className="w-1/2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white py-2 rounded-lg"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Let’s Start
          </button>
        </div>
      </form>
    </div>
  );
}

export default Content;

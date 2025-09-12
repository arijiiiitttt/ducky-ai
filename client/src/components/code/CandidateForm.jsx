import React, { useState } from 'react';
import { User, MapPin, Code, Phone, Briefcase, Smartphone, CheckCircle, AlertCircle, Eye, Download, Loader, Check } from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import { NavBar, Footer } from './NavAndFooter';


const stripeAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Keyframes for the File Folder Animation
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

// Styled Component for File Input with folder animation
const StyledFileInputWrapper = styled.div`
  .container {
    --transition: 350ms;
    --folder-W: 120px;
    --folder-H: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    background: linear-gradient(135deg, #6dd5ed, #2193b0);
    border-radius: 15px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    height: calc(var(--folder-H) * 1.7);
    position: relative;
    cursor: pointer;
    transition: transform 0.3s ease;
    width: 100%;
  }

  .container:hover {
    transform: translateY(-5px);
  }

  .folder {
    position: absolute;
    top: -20px;
    left: calc(50% - 60px);
    animation: ${floatAnimation} 2.5s infinite ease-in-out;
    transition: transform var(--transition) ease;
    z-index: 2; /* Ensure the folder is above the cover */
  }

  .folder:hover {
    transform: scale(1.05);
  }

  .folder .front-side, .folder .back-side {
    position: absolute;
    transition: transform var(--transition);
    transform-origin: bottom center;
  }

  .folder .back-side::before, .folder .back-side::after {
    content: "";
    display: block;
    background-color: white;
    opacity: 0.5;
    z-index: 0;
    width: var(--folder-W);
    height: var(--folder-H);
    position: absolute;
    transform-origin: bottom center;
    border-radius: 15px;
    transition: transform 350ms;
    z-index: 0;
  }

  .container:hover .back-side::before {
    transform: rotateX(-5deg) skewX(5deg);
  }
  .container:hover .back-side::after {
    transform: rotateX(-15deg) skewX(12deg);
  }

  .folder .front-side { z-index: 1; }
  .container:hover .front-side {
    transform: rotateX(-40deg) skewX(15deg);
  }

  .folder .tip {
    background: linear-gradient(135deg, #ff9a56, #ff6f56);
    width: 80px;
    height: 20px;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: -10px;
    z-index: 2;
  }

  .folder .cover {
    background: linear-gradient(135deg, #ffe563, #ffc663);
    width: var(--folder-W);
    height: var(--folder-H);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  .custom-file-upload {
    font-size: 1.1em;
    color: #ffffff;
    text-align: center;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background var(--transition) ease;
    display: inline-block;
    width: 100%;
    padding: 10px 35px;
    position: relative;
    pointer-events: none; /* Prevents clicks on the label, letting the container handle it */
    z-index: 3;
  }
  
  .custom-file-upload input[type="file"] {
    display: none;
  }
`;

// Brutalist container with thick border and shadow
const StyledCardWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  background-color: #fff;
  border: 5px solid #000;
  position: relative;
  overflow: hidden;
  box-shadow: 15px 15px 0 rgba(0, 0, 0, 0.605);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translate(-5px, -5px);
    box-shadow: 20px 20px 0 rgba(0, 0, 0, 0.2);
  }
`;

// Brutalist header with animated stripes
const StyledHeader = styled.div`
  background-color: #000;
  color: #fff;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: repeating-linear-gradient(
      45deg,
      #ff0 0,
      #ff0 10px,
      #000 10px,
      #000 20px
    );
    opacity: 0.1;
    animation: ${stripeAnimation} 20s linear infinite;
  }

  .brutal-subscribe__title {
    display: block;
    font-size: 36px;
    font-weight: bold;
    position: relative;
    z-index: 1;
    text-shadow: 3px 3px 0 rgb(140, 140, 19);
    font-family: monospace;
    text-transform: uppercase;
  }

  .brutal-subscribe__subtitle {
    display: block;
    font-size: 14px;
    position: relative;
    z-index: 1;
    font-family: monospace;
    text-transform: uppercase;
  }
`;

// Brutalist style for all input fields
const StyledInputBox = styled.input`
  width: 100%;
  padding: 1rem;
  border: 3px solid #000;
  font-family: monospace;
  font-size: 1rem;
  transition: transform 0.3s, background-color 0.3s;
  background-color: #fff;

  &:focus {
    outline: none;
    background-color: #ff0;
    transform: scale(1.02);
  }
  &:disabled {
    background-color: #e5e7eb;
    cursor: not-allowed;
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 3px solid #000;
  font-family: monospace;
  font-size: 1rem;
  transition: transform 0.3s, background-color 0.3s;
  background-color: #fff;

  &:focus {
    outline: none;
    background-color: #ff0;
    transform: scale(1.02);
  }
  &:disabled {
    background-color: #e5e7eb;
    cursor: not-allowed;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 1rem;
  border: 3px solid #000;
  font-family: monospace;
  font-size: 1rem;
  transition: transform 0.3s, background-color 0.3s;
  background-color: #fff;

  &:focus {
    outline: none;
    background-color: #ff0;
    transform: scale(1.02);
  }
  &:disabled {
    background-color: #e5e7eb;
    cursor: not-allowed;
  }
`;

// Brutalist style for the main button
const StyledButton = styled.button`
  width: 60%;
  padding: 10px;
  background-color: #000;
  color: #fff;
  border: 3px solid #000;
  font-family: monospace;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: #ff0;
    color: #000;
  }

  &:hover::after {
    content: "→";
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    transition: right 0.3s;
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    background-color: #888;
    color: #ccc;
    cursor: not-allowed;
  }
`;

// Brutalist style for the SMS notification box
const StyledCheckboxWrapper = styled.div`
  background-color: #ff0;
  color: #000;
  padding: 1.5rem;
  border: 3px solid #000;
  margin-top: 2rem;
  font-family: monospace;
`;

// Main layout wrapper with responsive grid
const StyledLayoutWrapper = styled.div`
  display: grid;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 2fr;
  }
`;

// Form fields wrapper for a two-column layout
const StyledFormGrid = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  > div:nth-child(5), /* Full Location */
  > div:nth-child(6), /* Technical Skills */
  > div:nth-child(7) { /* Project Details */
    grid-column: span 2;
  }
`;

// Button for manual completion
const StyledDoneButton = styled.button`
  background-color: #008000;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
  font-family: monospace;
  font-size: 0.8rem;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
  margin-top: 0.5rem;

  &:hover {
    background-color: #006400;
  }
  &:disabled {
    background-color: #a9a9a9;
    cursor: not-allowed;
  }
`;

// Wrapper for input and button
const InputGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

// New styles for the results section
const StyledJobResults = styled.div`
    margin-top: 2rem;
    padding: 2rem;
    background-color: #f7f7f7;
    border: 3px solid #000;
    box-shadow: 10px 10px 0 #888;
    font-family: monospace;
`;

const StyledJobCard = styled.div`
    border: 2px solid #000;
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: #fff;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    
    &:hover {
        transform: translate(-3px, -3px);
        box-shadow: 3px 3px 0 #000;
    }
    
    h3 {
        margin: 0 0 0.5rem;
        font-size: 1.2rem;
    }
    p {
        margin: 0 0 0.25rem;
    }
    a {
        display: inline-block;
        margin-top: 0.5rem;
        color: #000;
        text-decoration: none;
        background-color: #ff0;
        padding: 0.5rem 1rem;
        border: 2px solid #000;
        font-weight: bold;
        transition: background-color 0.2s;
        
        &:hover {
            background-color: #000;
            color: #ff0;
        }
    }
    
    .match-score {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #008000;
        color: #fff;
        font-size: 0.8rem;
        padding: 0.2rem 0.5rem;
        border-radius: 5px;
        border: 1px solid #000;
    }
`;

const CandidateForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        city: '',
        techStacks: '',
        projectDetails: '',
        experience: '',
        preferredRole: '',
        smsNotifications: false
    });
    
    const [uploadedFile, setUploadedFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [parsedData, setParsedData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [showExtractedText, setShowExtractedText] = useState(false);
    const [isParsed, setIsParsed] = useState(false); 
    const [filteredJobs, setFilteredJobs] = useState([]); // New state for filtered results

    const loadTesseract = async () => {
        if (typeof window !== 'undefined' && !window.Tesseract) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.1.1/tesseract.min.js';
            script.async = true;
            document.head.appendChild(script);
            
            return new Promise((resolve, reject) => {
                script.onload = () => resolve(window.Tesseract);
                script.onerror = (e) => reject(new Error('Failed to load Tesseract.js. Check network connection.'));
            });
        }
        return window.Tesseract;
    };

    const loadPDFLib = async () => {
        if (typeof window !== 'undefined' && !window.pdfjsLib) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.async = true;
            document.head.appendChild(script);
            
            return new Promise((resolve, reject) => {
                script.onload = () => {
                    if (window.pdfjsLib) {
                        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                        resolve(window.pdfjsLib);
                    } else {
                        reject(new Error('Failed to initialize PDF.js.'));
                    }
                };
                script.onerror = (e) => reject(new Error('Failed to load PDF.js. Check network connection.'));
            });
        }
        return window.pdfjsLib;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleManualFill = (field) => {
        const value = formData[field];
        if (value) {
            setFormData(prev => ({ ...prev, [field]: value.trim() }));
        }
    };

    const extractTextFromPDF = async (file) => {
        try {
            const pdfjsLib = await loadPDFLib();
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }
            return fullText;
        } catch (error) {
            console.error('PDF extraction error:', error);
            throw new Error('Failed to extract text from PDF. Ensure the file is a valid PDF and not a scanned image.');
        }
    };

    const extractTextFromImage = async (file) => {
        try {
            const Tesseract = await loadTesseract();
            const result = await Tesseract.recognize(file, 'eng');
            return result.data.text;
        } catch (error) {
            console.error('OCR error:', error);
            throw new Error('Failed to extract text from image. Ensure the image is clear and readable.');
        }
    };

    const parseResumeData = (text) => {
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const phoneRegex = /(?:\+91|91)?[-.\s]?(?:\d{5}[-.\s]?\d{5}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{10})/g;
        const namePatterns = [
            /(?:Name|Name:|Full Name|Full Name:)\s*([A-Za-z\s]+)/i,
            /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m
        ];
        const skillsPatterns = [
            /(?:Skills|Technical Skills|Programming Languages|Technologies|Tech Stack)[:\-\s]*([^.]+?)(?:\n\n|\n[A-Z]|$)/i,
        ];
        const locationPatterns = [
            /(?:Address|Location|City)[:\-\s]*([^.]+?)(?:\n|$)/i,
            /\b(Mumbai|Delhi|Bangalore|Chennai|Kolkata|Hyderabad|Pune|Ahmedabad|Jaipur|Lucknow|Kanpur|Nagpur|Indore|Bhopal|Visakhapatnam|Patna|Vadodara|Ghaziabad|Ludhiana|Agra|Nashik|Faridabad|Meerut|Rajkot|Kalyan|Vasai-Virar|Varanasi|Srinagar|Aurangabad|Dhanbad|Amritsar|Navi Mumbai|Allahabad|Ranchi|Howrah|Coimbatore|Jabalpur|Gwalior|Vijayawada|Jodhpur|Madurai|Raipur|Kota|Chandigarh|Guwahati)\b[,\s]*[A-Za-z\s,]*(?:India)?/i
        ];
        const experiencePatterns = [
            /(?:Experience|Work Experience|Professional Experience)[:\-\s]*([^.]+?)(?:\n\n|\n[A-Z]|$)/i,
            /(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i
        ];
        const projectPatterns = [
            /(?:Projects|Project Details|Key Projects)[:\-\s]*([^.]+?)(?:\n\n|\n[A-Z]{2,}|$)/i
        ];

        const extracted = {
            email: text.match(emailRegex)?.[0] || '',
            phone: text.match(phoneRegex)?.[0]?.replace(/[-.\s]/g, '') || '',
            name: '',
            location: '',
            city: '',
            techStacks: '',
            projectDetails: '',
            experience: '',
            preferredRole: ''
        };

        for (const pattern of namePatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                extracted.name = match[1].trim();
                break;
            }
        }
        for (const pattern of locationPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                extracted.location = match[1].trim();
                const cityMatch = extracted.location.match(/\b(Mumbai|Delhi|Bangalore|Chennai|Kolkata|Hyderabad|Pune|Ahmedabad|Jaipur|Lucknow|Kanpur|Nagpur|Indore|Bhopal|Visakhapatnam|Patna|Vadodara|Ghaziabad|Ludhiana|Agra|Nashik|Faridabad|Meerut|Rajkot|Kalyan|Vasai-Virar|Varanasi|Srinagar|Aurangabad|Dhanbad|Amritsar|Navi Mumbai|Allahabad|Ranchi|Howrah|Coimbatore|Jabalpur|Gwalior|Vijayawada|Jodhpur|Madurai|Raipur|Kota|Chandigarh|Guwahati)\b/i);
                if (cityMatch) { extracted.city = cityMatch[0]; }
                break;
            }
        }
        for (const pattern of skillsPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                extracted.techStacks = match[1].trim().replace(/\n/g, ', ');
                break;
            }
        }
        for (const pattern of experiencePatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                extracted.experience = match[1].trim();
                break;
            }
        }
        for (const pattern of projectPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                extracted.projectDetails = match[1].trim();
                break;
            }
        }
        const commonSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'HTML', 'CSS', 'MongoDB', 'MySQL', 'PostgreSQL', 'Express.js', 'Angular', 'Vue.js', 'Docker', 'AWS', 'Git', 'Redux', 'TypeScript', 'PHP', 'Laravel', 'Django','Flask', 'Spring Boot', 'Hibernate', 'JPA', 'REST API', 'GraphQL','Machine Learning', 'Data Science', 'Pandas', 'NumPy', 'TensorFlow','Keras', 'Scikit-learn', 'OpenCV', 'Android', 'iOS', 'React Native','Flutter', 'Kotlin', 'Swift', 'Firebase', 'Redis', 'Elasticsearch'];
        const foundSkills = commonSkills.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
        if (foundSkills.length > 0 && !extracted.techStacks) { extracted.techStacks = foundSkills.join(', '); }
        return extracted;
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadedFile(file);
        setIsProcessing(true);
        setError('');
        setExtractedText('');
        setParsedData(null);
        setIsParsed(false); 

        try {
            let extractedText = '';
            if (file.type === 'application/pdf') {
                extractedText = await extractTextFromPDF(file);
            } else if (file.type.startsWith('image/')) {
                extractedText = await extractTextFromImage(file);
            } else {
                throw new Error('Unsupported file type. Please upload PDF, PNG, or JPG files.');
            }
            setExtractedText(extractedText);
            const parsed = parseResumeData(extractedText);
            setParsedData(parsed);
            setFormData(prev => ({ ...prev, ...parsed }));
            setIsParsed(true); 
        } catch (err) {
            setError(err.message || 'Failed to process the file');
            setIsParsed(false); 
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadExtractedText = () => {
        const blob = new Blob([extractedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted-resume-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // New function to filter and rank jobs based on candidate data
    const filterAndRankJobs = (jobs, candidateData) => {
        const candidateSkills = (candidateData.techStacks || '').toLowerCase().split(',').map(s => s.trim());
        const preferredRole = (candidateData.preferredRole || '').toLowerCase();
        const candidateLocation = (candidateData.city || candidateData.location || '').toLowerCase();
        
        return jobs.map(job => {
            let matchScore = 0;
            const jobTitle = job.title.toLowerCase();
            const jobDescription = job.description ? job.description.toLowerCase() : '';
            const jobCompany = job.company.toLowerCase();

            // 1. Role Match (high priority)
            if (preferredRole && jobTitle.includes(preferredRole)) {
                matchScore += 20;
            } else {
                candidateSkills.forEach(skill => {
                    if (jobTitle.includes(skill)) {
                        matchScore += 10;
                    }
                });
            }

            // 2. Skill Match (medium priority)
            candidateSkills.forEach(skill => {
                if (jobTitle.includes(skill) || jobDescription.includes(skill)) {
                    matchScore += 5;
                }
            });

            // 3. Location Match (low priority)
            if (candidateLocation && (jobTitle.includes(candidateLocation) || jobCompany.includes(candidateLocation))) {
                matchScore += 5;
            }
            
            return {
                ...job,
                matchScore: matchScore
            };
        }).sort((a, b) => b.matchScore - a.matchScore)
        .filter(job => job.matchScore > 0);
    };

    const handleFindInternships = async () => {
        setIsProcessing(true);
        setError('');

        if (!formData.name || !formData.email || !formData.techStacks || !formData.location) {
            setError('Please fill in all required fields: Name, Email, Tech Skills, and Location');
            setIsProcessing(false);
            return;
        }

        try {
            // Step 1: Store data in local storage
            localStorage.setItem('candidateData', JSON.stringify(formData));
            console.log("Candidate data stored in local storage.");
            
            console.log('Submitting form data:', formData);
            
            const response = await fetch('http://127.0.0.1:3001/api/submit-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                let errorMessage = 'Failed to submit profile';
                
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (parseError) {
                    errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }
                
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Success response:', result);
            
            // Step 2: Filter and rank the jobs from the server
            const rankedJobs = filterAndRankJobs(result.jobs, formData);
            setFilteredJobs(rankedJobs);
            
            alert(`✅ Success! ${result.message}\n\nJobs found: ${result.jobs_found || 0}\nMatching your profile: ${rankedJobs.length}`);
            
            if (result.jobs && result.jobs.length > 0) {
                console.log('Found jobs:', result.jobs);
            }

        } catch (err) {
            console.error("Submission error:", err);
            
            if (err.name === 'TypeError' && err.message.includes('fetch')) {
                setError("❌ Cannot connect to server. Please ensure:\n1. Flask server is running on port 3001\n2. Check the terminal for server status\n3. Try refreshing and submitting again");
            } else if (err.message.includes('CORS')) {
                setError("❌ CORS error. Server configuration issue.");
            } else {
                setError(`❌ ${err.message}`);
            }
        } finally {
            setIsProcessing(false);
        }
    };
  
  return (
  <><div className='bg-[#e9edff]'>
     <NavBar className="mb-12 mt-6"/>
    <div style={{ minHeight: '100vh', backgroundImage: 'linear-gradient(to bottom right, #f3e8ff, #e0f2fe)', padding: '2rem' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
     
        <StyledLayoutWrapper>
          {/* Left Column - File Upload with Brutalist Styling */}
          <div>
            <div style={{ marginBottom: '2rem', backgroundColor: '#fff', padding: '0.5rem', borderRadius: '0.75rem', paddingTop: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
              <h1 style={{ fontFamily: 'monospace', textAlign: 'center' }}></h1>
              <div style={{ padding: '2.3rem' }}>
                <StyledFileInputWrapper>
                  <div className="container" onClick={() => document.getElementById('file-input').click()}>
                    <div className="folder">
                      <div className="front-side">
                        <div className="tip" />
                        <div className="cover" />
                      </div>
                      <div className="back-side cover" />
                    </div>
                    <label className="custom-file-upload">
                      <input
                        id="file-input"
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.png,.jpg,.jpeg"
                        disabled={isProcessing}
                      />
                      {isProcessing ? 'Processing...' : 'Choose a file'}
                    </label>
                  </div>
                </StyledFileInputWrapper>
            
                {uploadedFile && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#16a34a', marginRight: '0.5rem' }} />
                      <span style={{ color: '#14532d', fontWeight: '500' }}>File uploaded:</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#047857', marginTop: '0.25rem' }}>{uploadedFile.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#065f46' }}>
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}

                {error && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626', marginRight: '0.5rem' }} />
                      <span style={{ color: '#991b1b', fontWeight: '500' }}>Error:</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#b91c1c', marginTop: '0.25rem' }}>{error}</p>
                  </div>
                )}

                {extractedText && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563' }}>Extracted Text:</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setShowExtractedText(!showExtractedText)}
                          style={{ color: '#2563eb', fontSize: '0.875rem' }}
                        >
                          <Eye style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.25rem' }} />
                          {showExtractedText ? 'Hide' : 'View'}
                        </button>
                        <button
                          onClick={downloadExtractedText}
                          style={{ color: '#16a34a', fontSize: '0.875rem' }}
                        >
                          <Download style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.25rem' }} />
                          Download
                        </button>
                      </div>
                    </div>
                    
                    {showExtractedText && (
                      <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #e5e7eb', maxHeight: '10rem', overflowY: 'auto' }}>
                        <pre style={{ fontSize: '0.75rem', color: '#4b5563', whiteSpace: 'pre-wrap' }}>
                          {extractedText.substring(0, 500)}...
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {parsedData && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb', marginRight: '0.5rem' }} />
                      <span style={{ color: '#1e40af', fontWeight: '500' }}>Data Extracted Successfully!</span>
                    </div>
                    <ul style={{ fontSize: '0.875rem', color: '#1c508d', listStyle: 'none', padding: 0 }}>
                      {parsedData.name && <li>• Name: {parsedData.name}</li>}
                      {parsedData.email && <li>• Email: {parsedData.email}</li>}
                      {parsedData.phone && <li>• Phone: {parsedData.phone}</li>}
                      {parsedData.city && <li>• City: {parsedData.city}</li>}
                      {parsedData.techStacks && <li>• Skills found: {parsedData.techStacks.split(',').length} items</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Standard Form */}
          <div>
            <StyledCardWrapper>
              <StyledHeader>
                <span className="brutal-subscribe__title">PROFILE INFORMATION</span>
                <span className="brutal-subscribe__subtitle">DATA EXTRACTED FROM YOUR RESUME</span>
              </StyledHeader>
              
              <div style={{ padding: '2rem' }}>
                <StyledFormGrid>
                  <InputGroupWrapper>
                    <label style={{ display: 'block', color: '#4b5563', fontWeight: '600', marginBottom: '0.5rem' }}>
                      <User style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                      Full Name
                    </label>
                    <StyledInputBox
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      disabled={isProcessing || (parsedData && parsedData.name !== '')}
                    />
                    {isParsed && !formData.name && (
                      <StyledDoneButton onClick={() => handleManualFill('name')}>
                        <Check size={16} /> Filling Done
                      </StyledDoneButton>
                    )}
                  </InputGroupWrapper>

                  <InputGroupWrapper>
                    <label style={{ display: 'block', color: '#4b5563', fontWeight: '600', marginBottom: '0.5rem' }}>
                      Email Address
                    </label>
                    <StyledInputBox
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      disabled={isProcessing || (parsedData && parsedData.email !== '')}
                    />
                    {isParsed && !formData.email && (
                      <StyledDoneButton onClick={() => handleManualFill('email')}>
                        <Check size={16} /> Filling Done
                      </StyledDoneButton>
                    )}
                  </InputGroupWrapper>

                  <InputGroupWrapper>
                    <label style={{ display: 'block', color: '#4b5563', fontWeight: '600', marginBottom: '0.5rem' }}>
                      <Phone style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                      Phone Number
                    </label>
                    <StyledInputBox
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 9876543210"
                      disabled={isProcessing || (parsedData && parsedData.phone !== '')}
                    />
                    {isParsed && !formData.phone && (
                      <StyledDoneButton onClick={() => handleManualFill('phone')}>
                        <Check size={16} /> Filling Done
                      </StyledDoneButton>
                    )}
                  </InputGroupWrapper>

                  <InputGroupWrapper>
                    <label style={{ display: 'block', color: '#4b5563', fontWeight: '600', marginBottom: '0.5rem' }}>
                      <MapPin style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                      City
                    </label>
                    <StyledInputBox
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai, Delhi, Bangalore..."
                      disabled={isProcessing || (parsedData && parsedData.city !== '')}
                    />
                    {isParsed && !formData.city && (
                      <StyledDoneButton onClick={() => handleManualFill('city')}>
                        <Check size={16} /> Filling Done
                      </StyledDoneButton>
                    )}
                  </InputGroupWrapper>
                  
                  <InputGroupWrapper>
                    <label style={{ display: 'block', color: '#4b5563', fontWeight: '600', marginBottom: '0.5rem' }}>
                      Full Location/Address
                    </label>
                    <StyledInputBox
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Complete address with state"
                      disabled={isProcessing || (parsedData && parsedData.location !== '')}
                    />
                    {isParsed && !formData.location && (
                      <StyledDoneButton onClick={() => handleManualFill('location')}>
                        <Check size={16} /> Filling Done
                      </StyledDoneButton>
                    )}
                  </InputGroupWrapper>
                  
                  <InputGroupWrapper>
                    <label style={{ display: 'block', color: '#4b5563', fontWeight: '600', marginBottom: '0.5rem' }}>
                      <Code style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                      Technical Skills/Tech Stack
                    </label>
                    <StyledTextArea
                      name="techStacks"
                      value={formData.techStacks}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="React.js, Node.js, Python, MongoDB, Express.js, etc."
                      disabled={isProcessing || (parsedData && parsedData.techStacks !== '')}
                    />
                    {isParsed && !formData.techStacks && (
                      <StyledDoneButton onClick={() => handleManualFill('techStacks')}>
                        <Check size={16} /> Filling Done
                      </StyledDoneButton>
                    )}
                  </InputGroupWrapper>
              
                  <InputGroupWrapper>
                    <label style={{ display: 'block', color: '#4b5563', fontWeight: '600', marginBottom: '0.5rem' }}>
                      Experience Level
                    </label>
                    <StyledSelect
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      disabled={isProcessing || (parsedData && parsedData.experience !== '')}
                    >
                      <option value="">Select Experience</option>
                      <option value="Fresher">Fresher</option>
                      <option value="0-1 years">0-1 years</option>
                      <option value="1-2 years">1-2 years</option>
                      <option value="2+ years">2+ years</option>
                    </StyledSelect>
                    {isParsed && !formData.experience && (
                      <StyledDoneButton onClick={() => handleManualFill('experience')}>
                        <Check size={16} /> Filling Done
                      </StyledDoneButton>
                    )}
                  </InputGroupWrapper>
                  
                  <InputGroupWrapper>
                    <label style={{ display: 'block', color: '#4b5563', fontWeight: '600', marginBottom: '0.5rem' }}>
                      Preferred Role
                    </label>
                    <StyledInputBox
                      type="text"
                      name="preferredRole"
                      value={formData.preferredRole}
                      onChange={handleInputChange}
                      placeholder="Full Stack Developer, Data Analyst, etc."
                      disabled={isProcessing || (parsedData && parsedData.preferredRole !== '')}
                    />
                    {isParsed && !formData.preferredRole && (
                      <StyledDoneButton onClick={() => handleManualFill('preferredRole')}>
                        <Check size={16} /> Filling Done
                      </StyledDoneButton>
                    )}
                  </InputGroupWrapper>
                </StyledFormGrid>

                {/* SMS Notification Option */}
                <StyledCheckboxWrapper>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={formData.smsNotifications}
                      onChange={handleInputChange}
                      style={{ width: '1.25rem', height: '1.25rem', color: '#7c3aed', borderRadius: '0.25rem' }}
                    />
                    <div>
                      <span style={{ color: '#4b5563', fontWeight: '600' }}>
                        <Smartphone style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                        Get job recommendations directly on your mobile
                      </span>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Receive SMS notifications for new matching internships</p>
                    </div>
                  </label>
                </StyledCheckboxWrapper>

                {/* Submit Button */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                  <StyledButton
                    disabled={isProcessing}
                    onClick={handleFindInternships}
                  >
                    {isProcessing ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Loader style={{ animation: 'spin 1s linear infinite', height: '1.25rem', width: '1.25rem', marginRight: '0.5rem' }} />
                        Submitting...
                      </div>
                    ) : (
                      "Find My Perfect Internships"
                    )}
                  </StyledButton>
                </div>
              </div>
            </StyledCardWrapper>
            
            {/* New section to display filtered job results */}
            {filteredJobs.length > 0 && (
                <StyledJobResults>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textTransform: 'uppercase', textAlign: 'center' }}>
                        Top Matching Jobs
                    </h2>
                    {filteredJobs.map((job, index) => (
                        <StyledJobCard key={index}>
                            <h3>{job.title}</h3>
                            <p><strong>Company:</strong> {job.company}</p>
                            <p><strong>Source:</strong> {job.source}</p>
                            <span className="match-score">Score: {job.matchScore}</span>
                            <a href={job.link} target="_blank" rel="noopener noreferrer">Apply Now</a>
                        </StyledJobCard>
                    ))}
                </StyledJobResults>
            )}
          </div>
        </StyledLayoutWrapper>
      </div>
    </div>
</div>
  <Footer/>
</>
  );
};

export default CandidateForm;
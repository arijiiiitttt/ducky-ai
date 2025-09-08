import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { createWorker } from 'tesseract.js';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const Content = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [resumeText, setResumeText] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [smsOption, setSmsOption] = useState(false);
  const [error, setError] = useState('');

  const extractFromFile = async (file) => {
    try {
      if (file.type === 'application/pdf') {
        console.log('Processing PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          if (content.items.length === 0) {
            console.log(`Page ${i} has no text, trying OCR...`);
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const viewport = page.getViewport({ scale: 1.0 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport }).promise;
            const worker = await createWorker('eng');
            const { data: { text: ocrText } } = await worker.recognize(canvas);
            await worker.terminate();
            text += ocrText + '\n';
          } else {
            text += content.items.map(item => item.str).join(' ') + '\n';
          }
        }
        console.log('Extracted PDF text:', text);
        return text;
      } else if (file.type.startsWith('image/')) {
        console.log('Processing image...');
        const worker = await createWorker('eng');
        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();
        console.log('Extracted image text:', text);
        return text;
      }
      throw new Error('Unsupported file type');
    } catch (err) {
      console.error('Parsing error:', err);
      setError(`Failed to parse resume: ${err.message}. Please upload a valid PDF or image.`);
      return '';
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      setError('');
      const text = await extractFromFile(file);
      setResumeText(text);
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!resumeText) {
      setError('Please upload a resume before submitting.');
      return;
    }
    setLoading(true);
    setError('');
    // Extract city and skills from resumeText
    const cityMatch = resumeText.match(/City:\s*(.*)/i) || resumeText.match(/Location:\s*(.*)/i) || [''];
    const techMatch = resumeText.match(/Skills:\s*(.*)/i) || [''];
    const field = `internship ${techMatch[1] || ''}`.trim();
    const category = cityMatch[1] || 'India';
    const phone = smsOption ? data.phone : null;

    try {
      const res = await axios.post('http://localhost:5000/recommend', { field, category, phone, resumeText });
      setRecommendations(res.data.jobs);
    } catch (error) {
      setError('Failed to fetch recommendations. Please try again.');
      console.error('Fetch error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Upload Your Resume</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <label className="block mb-4">
          <span className="text-gray-700">Upload Resume (PDF, PNG, JPG)</span>
          <input
            type="file"
            accept=".pdf,.png,.jpg"
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
        </label>
        {resumeText && (
          <div className="mb-4">
            <label className="block text-gray-700">Extracted Text</label>
            <textarea
              value={resumeText}
              readOnly
              className="w-full h-24 p-2 border rounded"
            />
          </div>
        )}
        
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={smsOption}
            onChange={(e) => setSmsOption(e.target.checked)}
            className="mr-2"
          />
          <span>Send recommendations to my mobile</span>
        </label>
        {smsOption && (
          <div className="mb-4">
            <input
              {...register('phone', { pattern: { value: /^\+\d{10,15}$/, message: 'Enter a valid phone number (e.g., +911234567890)' } })}
              placeholder="Phone Number (e.g., +911234567890)"
              className="w-full p-2 border rounded"
            />
            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : 'Get Recommendations'}
        </button>
      </form>
      
      {recommendations.length > 0 && (
        <div className="max-w-lg mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4">Recommended Internships</h2>
          <ul>
            {recommendations.map((job, idx) => (
              <li key={idx} className="mb-4 p-4 bg-white rounded shadow">
                <h3 className="font-bold">{job.title}</h3>
                <p>{job.company} - {job.location}</p>
                <p>{job.snippet}</p>
                <a href={job.link} target="_blank" className="text-blue-500">Apply</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Content;
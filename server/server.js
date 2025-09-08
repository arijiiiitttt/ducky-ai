const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

const sites = [
  {
    name: 'Indeed',
    url: (field, category) => `https://www.indeed.com/jobs?q=${encodeURIComponent(field + ' internship')}&l=${encodeURIComponent(category)}`,
    waitSelector: '.jobsearch-JobComponent',
    extract: () => {
      const jobs = [];
      document.querySelectorAll('.jobsearch-JobComponent').forEach((card) => {
        const title = card.querySelector('.jobTitle')?.innerText.trim() || 'N/A';
        const company = card.querySelector('.companyName')?.innerText.trim() || 'N/A';
        const location = card.querySelector('.companyLocation')?.innerText.trim() || 'N/A';
        const snippet = card.querySelector('.job-snippet')?.innerText.trim() || 'N/A';
        const salary = card.querySelector('.salary-snippet')?.innerText.trim() || 'N/A';
        const link = card.querySelector('a')?.href || 'N/A';
        jobs.push({ title, company, location, snippet, salary, link });
      });
      return jobs;
    }
  },
  {
    name: 'LinkedIn',
    url: (field, category) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(field + ' internship')}&location=${encodeURIComponent(category)}`,
    waitSelector: '.job-card-container',
    extract: () => {
      const jobs = [];
      document.querySelectorAll('.job-card-container').forEach((card) => {
        const title = card.querySelector('h3.base-search-card__title')?.innerText.trim() || 'N/A';
        const company = card.querySelector('h4.base-search-card__subtitle')?.innerText.trim() || 'N/A';
        const location = card.querySelector('.base-search-card__metadata span.job-search-card__location')?.innerText.trim() || 'N/A';
        const snippet = card.querySelector('.job-search-card__snippet')?.innerText.trim() || 'N/A';
        const salary = card.querySelector('.job-search-card__salary-info')?.innerText.trim() || 'N/A';
        const link = card.querySelector('a')?.href || 'N/A';
        jobs.push({ title, company, location, snippet, salary, link });
      });
      return jobs;
    }
  },
  {
    name: 'Glassdoor',
    url: (field, category) => `https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=${encodeURIComponent(field + ' internship')}&locT=C&locId=1132348&locKeyword=${encodeURIComponent(category)}&jobType=intern&fromAge=-1&minSalary=0&includeNoSalaryJobs=true&radius=25&cityId=-1&minRating=0.0&industryId=-1&sgocId=-1&seniorityType=all&companyId=-1&employerSizes=0&applicationType=0&remoteWorkType=0`,
    waitSelector: '[data-test="job-card"]',
    extract: () => {
      const jobs = [];
      document.querySelectorAll('li[data-test="jobListing"]').forEach((card) => {
        const title = card.querySelector('[data-test="jobTitle"]')?.innerText.trim() || 'N/A';
        const company = card.querySelector('[data-test="employerName"]')?.innerText.trim() || 'N/A';
        const location = card.querySelector('[data-test="location"]')?.innerText.trim() || 'N/A';
        const snippet = card.querySelector('.jobCardShelfItem')?.innerText.trim() || 'N/A';
        const salary = card.querySelector('[data-test="detailSalary"]')?.innerText.trim() || 'N/A';
        const link = card.querySelector('a')?.href || 'N/A';
        jobs.push({ title, company, location, snippet, salary, link });
      });
      return jobs;
    }
  },
  {
    name: 'MyScheme PMIS',
    url: (field, category) => 'https://www.myscheme.gov.in/schemes/pmis',
    waitSelector: 'body',
    extract: () => {
      const jobs = [];
      const title = document.querySelector('h1')?.innerText.trim() || 'Pradhan Mantri Internship Scheme (PMIS)';
      const company = 'Government of India';
      const location = 'India';
      let snippet = '';
      const description = document.querySelector('.scheme-overview, .scheme-description, .content-section, p')?.innerText.trim() || 'Pradhan Mantri Internship Scheme for youth in India.';
      const eligibility = Array.from(document.querySelectorAll('.eligibility-section ul li, .eligibility-list li, ul li')).map(li => li.innerText.trim()).join('\n') || 'Youth aged 21-24, as per PMIS guidelines.';
      const benefits = Array.from(document.querySelectorAll('.benefits-section ul li, .benefits-list li, ul li')).map(li => li.innerText.trim()).join('\n') || 'Stipend, training, exposure.';
      const application = document.querySelector('.application-process, .how-to-apply, .content-section')?.innerText.trim() || 'Apply via MyScheme portal.';
      const duration = '12 months (at least half in working environment)';
      const stipend = document.querySelector('.stipend-details, .content-section')?.innerText.trim() || 'As per scheme guidelines';
      snippet = `Description: ${description}\nEligibility:\n${eligibility}\nBenefits:\n${benefits}\nApplication: ${application}\nDuration: ${duration}`;
      const link = window.location.href;
      const salary = stipend;
      jobs.push({ title, company, location, snippet, salary, link });
      return jobs;
    }
  }
];

async function scrapeSite(browser, site, field, category) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  try {
    await page.goto(site.url(field, category), { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector(site.waitSelector, { timeout: 10000 });
    
    const data = await page.evaluate(site.extract);
    return data;
  } catch (error) {
    console.error(`Error scraping ${site.name}: ${error.message}`);
    return [];
  } finally {
    await page.close();
  }
}

app.post('/recommend', async (req, res) => {
  const { field, category, phone, resumeText } = req.body;
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  let allJobs = [];
  
  for (const site of sites) {
    const jobs = await scrapeSite(browser, site, field, category);
    allJobs = [...allJobs, ...jobs];
  }
  
  await browser.close();
  
  allJobs = allJobs.filter(job => job.location.toLowerCase().includes(category.toLowerCase()));
  
  if (phone) {
    const summary = allJobs.slice(0, 3).map(j => `${j.title} at ${j.company}: ${j.link}`).join('\n');
    try {
      await client.messages.create({
        body: `Your PM Internship Recommendations:\n${summary}`,
        from: process.env.TWILIO_PHONE,
        to: phone
      });
    } catch (error) {
      console.error('SMS error:', error);
    }
  }
  
  res.json({ jobs: allJobs });
});

app.listen(5000, () => console.log('Backend running on port 5000'));
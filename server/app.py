import os
import time
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
from twilio.rest import Client as TwilioClient

# Selenium imports
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Load environment variables
load_dotenv()
load_dotenv('.env')
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173", "https://ducky-ai.netlify.app"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept"]
    }
})

# Debug: Print environment variables (remove in production)
print("Environment check:")
print(f"SUPABASE_URL: {os.environ.get('SUPABASE_URL', 'NOT FOUND')}")
print(f"SUPABASE_SERVICE_ROLE_KEY: {os.environ.get('SUPABASE_SERVICE_ROLE_KEY', 'NOT FOUND')[:5]}...")
print(f"TWILIO_ACCOUNT_SID: {os.environ.get('TWILIO_ACCOUNT_SID', 'NOT FOUND')}")

# LinkedIn dummy credentials (you'll need to add these to your .env file)
LINKEDIN_EMAIL = os.environ.get("LINKEDIN_EMAIL", "your_dummy_email@example.com")
LINKEDIN_PASSWORD = os.environ.get("LINKEDIN_PASSWORD", "your_dummy_password")

# Supabase setup with better error handling
supabase = None
try:
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if supabase_url and supabase_key:
        supabase: Client = create_client(supabase_url, supabase_key)
        print("Supabase client initialized successfully")
        
        # Test the connection
        test_response = supabase.table("candidates").select("*").limit(1).execute()
        print("Supabase connection test successful")
    else:
        print("ERROR: Supabase credentials not found. Database functionality will be disabled.")
except Exception as e:
    print(f"Error initializing Supabase: {e}. Database functionality will be disabled.")
    supabase = None

# Twilio setup
twilio_client = None
try:
    twilio_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    twilio_token = os.environ.get("TWILIO_AUTH_TOKEN")
    twilio_number = os.environ.get("TWILIO_PHONE_NUMBER")
    if twilio_sid and twilio_token:
        twilio_client = TwilioClient(twilio_sid, twilio_token)
        print("Twilio client initialized successfully")
    else:
        print("Twilio credentials not found - SMS functionality disabled")
except Exception as e:
    print(f"Error initializing Twilio: {e}. SMS functionality will be disabled.")

## --- Selenium Helper Functions ---
def create_selenium_driver():
    """Create and configure Chrome driver for web scraping"""
    chrome_options = Options()
    # chrome_options.add_argument("--headless")  # REMOVED for demonstration
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    try:
        driver = webdriver.Chrome(options=chrome_options)
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        return driver
    except Exception as e:
        print(f"Error creating Chrome driver: {e}")
        return None

def random_delay(min_seconds=1, max_seconds=3):
    """Add random delay to avoid detection"""
    time.sleep(random.uniform(min_seconds, max_seconds))

## --- Enhanced Scraping Functions with Selenium ---
def scrape_linkedin_with_selenium(skills, location):
    """Scrape LinkedIn using Selenium with login"""
    print(f"Starting LinkedIn Selenium scraping for skills: {skills}, location: {location}")
    job_list = []
    driver = None
    
    try:
        driver = create_selenium_driver()
        if not driver:
            return job_list
            
        # Login to LinkedIn
        print("Logging into LinkedIn...")
        driver.get("https://www.linkedin.com/login")
        random_delay(2, 4)
        
        # Enter credentials
        email_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "username"))
        )
        password_field = driver.find_element(By.ID, "password")
        
        email_field.send_keys(LINKEDIN_EMAIL)
        password_field.send_keys(LINKEDIN_PASSWORD)
        password_field.send_keys(Keys.RETURN)
        
        random_delay(3, 5)
        
        # Check if login was successful
        if "challenge" in driver.current_url or "login" in driver.current_url:
            print("LinkedIn login may have failed or requires verification")
            return job_list
            
        print("LinkedIn login successful")
        
        # Navigate to jobs search
        search_query = skills.replace(',', ' ')
        location_query = location
        jobs_url = f"https://www.linkedin.com/jobs/search/?keywords={search_query}&location={location_query}&f_TPR=r86400&f_JT=I"
        
        driver.get(jobs_url)
        random_delay(3, 5)
        
        # Scroll to load more jobs
        for _ in range(3):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            random_delay(2, 3)
        
        # Find job cards
        job_cards = driver.find_elements(By.CSS_SELECTOR, "div.base-card, li.jobs-search-results__list-item, div.job-search-card")
        
        print(f"Found {len(job_cards)} job cards")
        
        for i, card in enumerate(job_cards[:10]):
            try:
                title_elem = None
                title_selectors = [
                    "h3.base-search-card__title a",
                    "h4.base-search-card__title a",
                    "a.job-card-list__title",
                    ".job-card-container__link"
                ]
                
                for selector in title_selectors:
                    try:
                        title_elem = card.find_element(By.CSS_SELECTOR, selector)
                        break
                    except NoSuchElementException:
                        continue
                
                company_elem = None
                company_selectors = [
                    "h4.base-search-card__subtitle a",
                    "a.job-card-container__company-name",
                    ".job-card-list__company-name"
                ]
                
                for selector in company_selectors:
                    try:
                        company_elem = card.find_element(By.CSS_SELECTOR, selector)
                        break
                    except NoSuchElementException:
                        continue
                
                if title_elem and company_elem:
                    title = title_elem.text.strip()
                    company = company_elem.text.strip()
                    link = title_elem.get_attribute('href')
                    
                    if title and company and link:
                        if any(term in title.lower() for term in ['intern', 'internship', 'trainee', 'graduate']):
                            job_list.append({
                                'title': title,
                                'company': company,
                                'link': link.split('?')[0],
                                'source': 'LinkedIn (Selenium)'
                            })
                            print(f"Added: {title} at {company}")
                
            except Exception as e:
                print(f"Error processing job card {i}: {e}")
                continue
                
    except Exception as e:
        print(f"Error in LinkedIn Selenium scraping: {e}")
    finally:
        if driver:
            driver.quit()
    
    return job_list

def scrape_indeed_with_selenium(skills, location):
    """Enhanced Indeed scraping with Selenium"""
    print(f"Starting Indeed Selenium scraping for skills: {skills}, location: {location}")
    job_list = []
    driver = None
    
    try:
        driver = create_selenium_driver()
        if not driver:
            return scrape_indeed_basic(skills, location)
        
        search_query = "+".join([skill.strip() for skill in skills.split(',')])
        location_query = location.replace(' ', '+')
        url = f"https://www.indeed.com/jobs?q={search_query}+internship&l={location_query}"
        
        driver.get(url)
        random_delay(2, 4)
        
        job_cards = driver.find_elements(By.CSS_SELECTOR, "div[data-jk], .job_seen_beacon")
        
        for card in job_cards[:10]:
            try:
                title_elem = card.find_element(By.CSS_SELECTOR, "h2.jobTitle a, h2 a[data-jk]")
                company_elem = card.find_element(By.CSS_SELECTOR, "span.companyName, .companyName")
                
                if title_elem and company_elem:
                    title = title_elem.text.strip()
                    company = company_elem.text.strip()
                    link = title_elem.get_attribute('href')
                    
                    if not link.startswith('http'):
                        link = f"https://www.indeed.com{link}"
                    
                    job_list.append({
                        'title': title,
                        'company': company,
                        'link': link,
                        'source': 'Indeed (Selenium)'
                    })
                    
            except Exception as e:
                print(f"Error processing Indeed job card: {e}")
                continue
                
    except Exception as e:
        print(f"Error in Indeed Selenium scraping: {e}")
        return scrape_indeed_basic(skills, location)
    finally:
        if driver:
            driver.quit()
    
    return job_list

def scrape_indeed_basic(skills, location):
    """Basic Indeed scraping (your original function)"""
    print(f"Starting Indeed basic scraping for skills: {skills}, location: {location}")
    job_list = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
    search_query = "+".join([skill.strip() for skill in skills.split(',')])
    location_query = location.replace(' ', '+')
    url = f"https://www.indeed.com/jobs?q={search_query}+internship&l={location_query}"
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        job_cards = soup.find_all('div', {'data-jk': True})
        
        for card in job_cards[:10]:
            try:
                title_elem = card.find('h2', class_='jobTitle')
                company_elem = card.find('span', class_='companyName')
                link_elem = card.find('a', {'data-jk': True})
                
                if title_elem and company_elem and link_elem:
                    title = title_elem.get_text(strip=True)
                    company = company_elem.get_text(strip=True)
                    link = f"https://www.indeed.com{link_elem['href']}"
                    job_list.append({'title': title, 'company': company, 'link': link, 'source': 'Indeed'})
            except Exception as e:
                print(f"Error processing Indeed job card: {e}")
                continue
    except requests.RequestException as e:
        print(f"Request error while scraping Indeed: {e}")
    
    return job_list

def scrape_glassdoor(skills, location):
    print(f"Starting Glassdoor scraping for skills: {skills}, location: {location}")
    job_list = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
    search_query = "-".join([skill.strip() for skill in skills.split(',')])
    location_query = location.replace(' ', '-')
    url = f"https://www.glassdoor.com/jobs/internship-{search_query}-jobs-in-{location_query}-SRCH_IL.0,14.html"

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        job_cards = soup.find_all('li', class_='react-job-listing')
        
        for card in job_cards[:10]:
            try:
                title_elem = card.find('a', {'data-test': 'job-link'})
                company_elem = card.find('a', {'data-test': 'employer-link'})
                
                if title_elem and company_elem:
                    title = title_elem.get_text(strip=True)
                    company = company_elem.get_text(strip=True)
                    link = f"https://www.glassdoor.com{title_elem['href']}"
                    job_list.append({'title': title, 'company': company, 'link': link, 'source': 'Glassdoor'})
            except Exception as e:
                print(f"Error processing Glassdoor job card: {e}")
                continue
    except requests.RequestException as e:
        print(f"Request error while scraping Glassdoor: {e}")
    return job_list

def scrape_internshala(skills, location):
    print(f"Starting Internshala scraping for skills: {skills}, location: {location}")
    job_list = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
    skill_query = "+".join([s.strip() for s in skills.split(',')])
    location_query = location.replace(' ', '-').lower()
    url = f"https://internshala.com/internships/{location_query}-internship/{skill_query}"
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        job_cards = soup.find_all('div', class_='internship_details')
        
        for card in job_cards[:10]:
            try:
                title_elem = card.find('a', class_='view_detail_button')
                company_elem = card.find('a', class_='company_name')
                link = title_elem['href'] if title_elem else ""

                if title_elem and company_elem and link:
                    title = title_elem.get_text(strip=True)
                    company = company_elem.get_text(strip=True)
                    if not link.startswith('http'):
                        link = f"https://internshala.com{link}"
                    job_list.append({'title': title, 'company': company, 'link': link, 'source': 'Internshala'})
            except Exception as e:
                print(f"Error processing Internshala job card: {e}")
                continue
    except requests.RequestException as e:
        print(f"Request error while scraping Internshala: {e}")
    return job_list

def scrape_google(skills, location):
    """Scrape Google for jobs as a fallback"""
    print(f"Starting Google search as a fallback for skills: {skills}, location: {location}")
    job_list = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
    search_query = f"internship {skills} in {location}"
    url = f"https://www.google.com/search?q={search_query.replace(' ', '+')}&hl=en&gl=us"

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        job_elements = soup.find_all('div', class_='g')
        for element in job_elements[:10]:
            try:
                title_elem = element.find('h3')
                link_elem = element.find('a')

                if title_elem and link_elem:
                    title = title_elem.get_text(strip=True)
                    link = link_elem['href']
                    
                    if any(term in title.lower() for term in ['intern', 'internship', 'trainee']):
                        company_elem = element.find('span', class_='b')
                        company = company_elem.get_text(strip=True) if company_elem else "N/A"
                        
                        job_list.append({
                            'title': title,
                            'company': company,
                            'link': link,
                            'source': 'Google Search'
                        })
            except Exception as e:
                print(f"Error parsing a Google search result: {e}")
                continue

    except requests.RequestException as e:
        print(f"Request error while scraping Google: {e}")
    
    return job_list

## --- SMS Sender Function ---
def send_sms(to_number, message_body):
    if not twilio_client or not twilio_number:
        print("Twilio not configured. SMS will not be sent.")
        return False
    try:
        if not to_number.startswith('+'):
            to_number = f"+91{to_number}"
        message = twilio_client.messages.create(
            to=to_number,
            from_=twilio_number,
            body=message_body[:1600]
        )
        print(f"SMS sent successfully. SID: {message.sid}")
        return True
    except Exception as e:
        print(f"Error sending SMS: {e}")
        return False

## --- Enhanced Database Storage ---
def store_candidate_data(data):
    """Store candidate data in Supabase with better error handling"""
    if not supabase:
        print("Supabase not configured. Skipping database storage.")
        return False
    
    try:
        candidate_data = {
            "name": data.get('name'),
            "email": data.get('email'),
            "phone_number": data.get('phone'),
            "tech_stacks": data.get('techStacks'),
            "location": data.get('location'),
            "city": data.get('city'),
            "project_details": data.get('projectDetails'),
            "experience": data.get('experience'),
            "preferred_role": data.get('preferredRole'),
            "sms_notifications": data.get('smsNotifications', False)
        }
        
        print(f"Attempting to store data: {candidate_data}")
        
        response = supabase.table("candidates").insert(candidate_data).execute()
        
        if hasattr(response, 'data') and response.data:
            print(f"Data stored successfully in Supabase: {response.data}")
            return True
        else:
            print(f"Unexpected response format: {response}")
            return False
            
    except Exception as db_error:
        print(f"Database storage error: {db_error}")
        print(f"Error type: {type(db_error)}")
        return False

## --- API Routes ---
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Server is running!", "status": "success"}), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "supabase": "connected" if supabase else "not configured",
        "twilio": "connected" if twilio_client else "not configured",
        "selenium": "available" if create_selenium_driver() else "not available"
    }), 200

@app.route('/api/submit-profile', methods=['POST'])
def submit_profile():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        tech_stacks = data.get('techStacks')
        location = data.get('location')
        sms_notifications = data.get('smsNotifications', False)

        if not all([name, email, tech_stacks, location]):
            return jsonify({"error": "Missing required fields"}), 400

        db_stored = store_candidate_data(data)
        
        all_jobs = []
        all_jobs.extend(scrape_linkedin_with_selenium(tech_stacks, location))
        all_jobs.extend(scrape_indeed_with_selenium(tech_stacks, location))
        all_jobs.extend(scrape_glassdoor(tech_stacks, location))
        all_jobs.extend(scrape_internshala(tech_stacks, location))
        
        if not all_jobs:
            print("No jobs found from primary sources. Falling back to Google search...")
            all_jobs.extend(scrape_google(tech_stacks, location))
        
        if not all_jobs:
            print("No jobs found from any source. User will receive empty results.")
        else:
            print(f"Total jobs found: {len(all_jobs)}")
        
        response_data = {
            "message": "Profile submitted successfully!",
            "jobs_found": len(all_jobs),
            "jobs": all_jobs[:10],
            "database_stored": db_stored
        }
        
        if sms_notifications and all_jobs and phone:
            job_summary = f"Hello {name}! We found {len(all_jobs)} internship opportunities for you.\n\n"
            for i, job in enumerate(all_jobs[:3], 1):
                job_summary += f"{i}. {job['title']} at {job['company']}\n"
            
            if all_jobs:
                job_summary += f"\nCheck your email for more details!"
            
            sms_sent = send_sms(phone, job_summary)
            response_data["sms_sent"] = sms_sent
        
        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error in submit_profile: {e}")
        return jsonify({"error": f"Failed to submit profile: {str(e)}"}), 500

@app.route('/api/test-scrape', methods=['POST'])
def test_scrape():
    data = request.json
    skills = data.get('skills', 'python,javascript')
    location = data.get('location', 'Mumbai, India')
    
    all_jobs = []
    
    linkedin_jobs = scrape_linkedin_with_selenium(skills, location)
    all_jobs.extend(linkedin_jobs)
    
    indeed_jobs = scrape_indeed_with_selenium(skills, location)
    all_jobs.extend(indeed_jobs)
    
    all_jobs.extend(scrape_glassdoor(skills, location))
    all_jobs.extend(scrape_internshala(skills, location))
    
    if not all_jobs:
        all_jobs.extend(scrape_google(skills, location))
    
    return jsonify({
        "jobs": all_jobs,
        "count": len(all_jobs),
        "selenium_available": create_selenium_driver() is not None
    })

if __name__ == '__main__':
    print("Starting Flask application...")
    print("Make sure to install Selenium and Chrome driver!")
    app.run(host='127.0.0.1', port=3001, debug=True)
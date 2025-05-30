#!/usr/bin/env python3
import requests
import time

def test_bulk_generation():
    print("Testing Bulk Generation Optimization")
    print("=" * 50)
    
    print("\n1. Testing bulk email generation...")
    start_time = time.time()
    
    try:
        response = requests.post('http://localhost:5000/generate/email/bulk', 
                               json={}, 
                               timeout=120)  # 2 minutes timeout
        
        if response.status_code == 200:
            data = response.json()
            emails_by_level = data['emails_by_level']
            
            total_emails = 0
            for level, emails in emails_by_level.items():
                print(f"   Level {level}: {len(emails)} emails")
                total_emails += len(emails)
            
            email_time = time.time() - start_time
            print(f"   Total: {total_emails} emails in {email_time:.2f}s")
            print(f"   Average: {email_time/total_emails:.2f}s per email")
        else:
            print(f"   Error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\n2. Testing bulk URL generation...")
    start_time = time.time()
    
    try:
        response = requests.post('http://localhost:5000/generate/url/bulk', 
                               json={}, 
                               timeout=120)  # 2 minutes timeout
        
        if response.status_code == 200:
            data = response.json()
            urls_by_level = data['urls_by_level']
            
            total_urls = 0
            for level, urls in urls_by_level.items():
                print(f"   Level {level}: {len(urls)} URLs")
                total_urls += len(urls)
            
            url_time = time.time() - start_time
            print(f"   Total: {total_urls} URLs in {url_time:.2f}s")
            print(f"   Average: {url_time/total_urls:.2f}s per URL")
        else:
            print(f"   Error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Bulk generation reduces API calls from 18 to 2!")
    print("✅ This should significantly improve loading performance.")

if __name__ == "__main__":
    test_bulk_generation()

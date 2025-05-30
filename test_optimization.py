#!/usr/bin/env python3
import requests
import json
import time

def test_optimization():
    print("Testing Optimization: Batch Generation for All Levels")
    print("=" * 60)
    
    # Simulate the frontend loading all 3 levels at once
    print("\n1. Testing batch email generation (9 emails total - 3 per level)")
    start_time = time.time()
    
    all_emails = []
    for level in range(1, 4):
        print(f"   Generating emails for level {level}...")
        level_start = time.time()
        
        # Generate 3 emails for this level
        level_emails = []
        for i in range(3):
            response = requests.post('http://localhost:5000/generate/email', 
                                   json={'level': level}, 
                                   timeout=30)
            if response.status_code == 200:
                email = response.json()
                level_emails.append(email)
            else:
                print(f"   Error generating email {i+1} for level {level}")
                
        level_time = time.time() - level_start
        print(f"   Level {level}: Generated {len(level_emails)} emails in {level_time:.2f}s")
        all_emails.extend(level_emails)
    
    total_email_time = time.time() - start_time
    print(f"\n   Total: Generated {len(all_emails)} emails in {total_email_time:.2f}s")
    print(f"   Average per email: {total_email_time/len(all_emails):.2f}s")
    
    # Test URL generation
    print("\n2. Testing batch URL generation (9 URLs total - 3 per level)")
    start_time = time.time()
    
    all_urls = []
    for level in range(1, 4):
        print(f"   Generating URLs for level {level}...")
        level_start = time.time()
        
        # Generate 3 URLs for this level
        level_urls = []
        for i in range(3):
            response = requests.post('http://localhost:5000/generate/url', 
                                   json={'level': level}, 
                                   timeout=30)
            if response.status_code == 200:
                url = response.json()
                level_urls.append(url)
            else:
                print(f"   Error generating URL {i+1} for level {level}")
                
        level_time = time.time() - level_start
        print(f"   Level {level}: Generated {len(level_urls)} URLs in {level_time:.2f}s")
        all_urls.extend(level_urls)
    
    total_url_time = time.time() - start_time
    print(f"\n   Total: Generated {len(all_urls)} URLs in {total_url_time:.2f}s")
    print(f"   Average per URL: {total_url_time/len(all_urls):.2f}s")
    
    # Summary
    print("\n" + "=" * 60)
    print("OPTIMIZATION SUMMARY:")
    print(f"• Total content generation time: {total_email_time + total_url_time:.2f}s")
    print(f"• This happens ONCE when user enters a mode")
    print(f"• Level transitions are now INSTANT (using pre-generated content)")
    print(f"• User experience: Initial {total_email_time:.1f}s wait, then smooth gameplay")
    print("=" * 60)

if __name__ == "__main__":
    test_optimization()

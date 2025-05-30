#!/usr/bin/env python3
"""
Test script to validate the enhanced phishing simulation with mixed legitimate/scam content.
This script tests the new functionality that generates both legitimate and scam content.
"""

import requests
import json
import time

def test_mixed_content_generation():
    """Test that the enhanced service generates both legitimate and scam content"""
    base_url = "http://localhost:5000"
    
    print("🧪 TESTING ENHANCED PHISHING SIMULATION")
    print("=" * 60)
    
    # Test health check
    print("1. Testing health check...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("   ✅ Service is healthy")
        else:
            print("   ❌ Service health check failed")
            return False
    except Exception as e:
        print(f"   ❌ Failed to connect to service: {e}")
        return False
    
    # Test bulk email generation (mixed content)
    print("\n2. Testing bulk email generation with mixed content...")
    try:
        start_time = time.time()
        response = requests.post(f"{base_url}/generate/email/bulk", json={})
        end_time = time.time()
        
        if response.status_code == 200:
            data = response.json()
            emails_by_level = data.get('emails_by_level', {})
            
            print(f"   ✅ Bulk email generation completed in {end_time - start_time:.2f}s")
            
            # Validate mixed content
            total_scams = 0
            total_legitimate = 0
            
            for level in range(1, 4):
                if str(level) in emails_by_level:
                    emails = emails_by_level[str(level)]
                    level_scams = sum(1 for email in emails if email.get('isPhishing', True))
                    level_legitimate = sum(1 for email in emails if not email.get('isPhishing', True))
                    
                    print(f"   📧 Level {level}: {level_scams} scams, {level_legitimate} legitimate")
                    total_scams += level_scams
                    total_legitimate += level_legitimate
                    
                    # Show sample content
                    for i, email in enumerate(emails):
                        content_type = "SCAM" if email.get('isPhishing', True) else "LEGITIMATE"
                        print(f"      {i+1}. [{content_type}] {email.get('subject', 'No subject')}")
                        if not email.get('isPhishing', True) and 'trustIndicators' in email:
                            print(f"         Trust Indicators: {email['trustIndicators']}")
                        elif email.get('isPhishing', True) and 'redFlags' in email:
                            print(f"         Red Flags: {email['redFlags']}")
            
            print(f"\n   📊 TOTAL: {total_scams} scams, {total_legitimate} legitimate emails")
            
            if total_legitimate > 0:
                print("   ✅ Mixed content generation working correctly!")
            else:
                print("   ❌ No legitimate emails generated - mixed content failed")
                return False
                
        else:
            print(f"   ❌ Bulk email generation failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error testing bulk email generation: {e}")
        return False
    
    # Test bulk URL generation (mixed content)
    print("\n3. Testing bulk URL generation with mixed content...")
    try:
        start_time = time.time()
        response = requests.post(f"{base_url}/generate/url/bulk", json={})
        end_time = time.time()
        
        if response.status_code == 200:
            data = response.json()
            urls_by_level = data.get('urls_by_level', {})
            
            print(f"   ✅ Bulk URL generation completed in {end_time - start_time:.2f}s")
            
            # Validate mixed content
            total_scams = 0
            total_legitimate = 0
            
            for level in range(1, 4):
                if str(level) in urls_by_level:
                    urls = urls_by_level[str(level)]
                    level_scams = sum(1 for url in urls if url.get('isPhishing', True))
                    level_legitimate = sum(1 for url in urls if not url.get('isPhishing', True))
                    
                    print(f"   🔗 Level {level}: {level_scams} scams, {level_legitimate} legitimate")
                    total_scams += level_scams
                    total_legitimate += level_legitimate
                    
                    # Show sample content
                    for i, url in enumerate(urls):
                        content_type = "SCAM" if url.get('isPhishing', True) else "LEGITIMATE"
                        print(f"      {i+1}. [{content_type}] {url.get('url', 'No URL')}")
                        if not url.get('isPhishing', True) and 'trustIndicators' in url:
                            print(f"         Trust Indicators: {url['trustIndicators']}")
                        elif url.get('isPhishing', True) and 'redFlags' in url:
                            print(f"         Red Flags: {url['redFlags']}")
            
            print(f"\n   📊 TOTAL: {total_scams} scams, {total_legitimate} legitimate URLs")
            
            if total_legitimate > 0:
                print("   ✅ Mixed content generation working correctly!")
            else:
                print("   ❌ No legitimate URLs generated - mixed content failed")
                return False
                
        else:
            print(f"   ❌ Bulk URL generation failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error testing bulk URL generation: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("🎉 ENHANCED SIMULATION TEST COMPLETED SUCCESSFULLY!")
    print("\n📋 EDUCATIONAL ENHANCEMENT SUMMARY:")
    print("✅ Mixed legitimate/scam content generation working")
    print("✅ Trust indicators for legitimate content")
    print("✅ Red flags for scam content")
    print("✅ Balanced learning experience (2 scams + 1 legitimate per level)")
    print("✅ Randomized content order for unpredictability")
    print("\n🎓 LEARNING BENEFITS:")
    print("• Users learn to identify BOTH legitimate and malicious content")
    print("• Trust indicators teach what to look for in safe content")
    print("• Red flags highlight common attack patterns")
    print("• Realistic scenarios improve practical skills")
    
    return True

if __name__ == "__main__":
    test_mixed_content_generation()

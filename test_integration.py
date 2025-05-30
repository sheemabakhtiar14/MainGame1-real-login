#!/usr/bin/env python3
import requests
import json

def test_email_generation():
    print('Testing Email Generation...')
    try:
        response = requests.post('http://localhost:5000/generate/email', 
                                json={'level': 1}, 
                                timeout=30)
        print(f'Status: {response.status_code}')
        if response.status_code == 200:
            email = response.json()
            print(f'Generated email subject: {email["subject"][:50]}...')
            print(f'From: {email["sender"]}')
            print(f'Red flags: {len(email["redFlags"])}')
            print(f'Is phishing: {email["isPhishing"]}')
            print('---')
        else:
            print(f'Error: {response.text}')
    except Exception as e:
        print(f'Exception: {e}')

def test_url_generation():
    print('\nTesting URL Generation...')
    try:
        response = requests.post('http://localhost:5000/generate/url', 
                                json={'level': 1}, 
                                timeout=30)
        print(f'Status: {response.status_code}')
        if response.status_code == 200:
            url = response.json()
            print(f'Generated URL: {url["url"][:50]}...')
            print(f'Description: {url["description"]}')
            print(f'Red flags: {len(url["redFlags"])}')
            print(f'Is phishing: {url["isPhishing"]}')
            print('---')
        else:
            print(f'Error: {response.text}')
    except Exception as e:
        print(f'Exception: {e}')

def test_feedback_generation():
    print('\nTesting Feedback Generation...')
    try:
        response = requests.post('http://localhost:5000/feedback', 
                                json={
                                    'userAnswer': False,
                                    'isCorrect': True,
                                    'scamType': 'email',
                                    'content': {
                                        'subject': 'Urgent: Your account has been compromised',
                                        'sender': 'security@bank0famerica.com',
                                        'content': 'Click here to verify your account',
                                        'isPhishing': True,
                                        'redFlags': ['Suspicious domain', 'Urgency tactics']
                                    }
                                }, 
                                timeout=30)
        print(f'Status: {response.status_code}')
        if response.status_code == 200:
            data = response.json()
            print(f'Generated feedback: {data["feedback"][:150]}...')
        else:
            print(f'Error: {response.text}')
    except Exception as e:
        print(f'Exception: {e}')

if __name__ == "__main__":
    test_email_generation()
    test_url_generation()
    test_feedback_generation()

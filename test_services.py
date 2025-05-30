import requests

def test_services():
    try:
        # Test Python service
        print("Testing Python service...")
        r = requests.get('http://localhost:5000/health', timeout=5)
        print(f"Python service status: {r.status_code}")
        
        # Test React service  
        print("Testing React service...")
        r2 = requests.get('http://localhost:5174', timeout=5)
        print(f"React service status: {r2.status_code}")
        
        print("Both services are running!")
        
    except Exception as e:
        print(f"Service test error: {e}")

if __name__ == "__main__":
    test_services()

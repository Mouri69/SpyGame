# Python module
from typing import Dict, List, Optional
import requests

class DataProcessor:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.example.com/v1"
    
    def process_data(self, data: List[Dict]) -> Optional[Dict]:
        try:
            response = requests.post(
                f"{self.base_url}/process",
                json=data,
                headers={"Authorization": f"Bearer {self.api_key}"}
            )
            return response.json()
        except Exception as e:
            print(f"Error processing data: {e}")
            return None

"""
WhatsApp Sender Backend - Python Module
Handles WhatsApp Web automation using Selenium
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time
import os
import json
from datetime import datetime

# Directories setup
PROFILES_DIR = os.path.join(os.getcwd(), "profiles")
LOGS_DIR = os.path.join(os.getcwd(), "logs")

if not os.path.exists(PROFILES_DIR):
    os.makedirs(PROFILES_DIR)

if not os.path.exists(LOGS_DIR):
    os.makedirs(LOGS_DIR)


class WhatsAppSender:
    """Main class for WhatsApp sending operations"""
    
    def __init__(self):
        self.profiles = self.list_profiles()
        self.stats = self.load_stats()
    
    def list_profiles(self):
        """List all available profiles"""
        return [name for name in os.listdir(PROFILES_DIR) 
                if os.path.isdir(os.path.join(PROFILES_DIR, name))]
    
    def create_profile(self, profile_name):
        """Create a new WhatsApp Web profile"""
        profile_path = os.path.join(PROFILES_DIR, profile_name)
        
        if os.path.exists(profile_path):
            return {"success": False, "message": "Profile already exists"}
        
        os.makedirs(profile_path)
        options = webdriver.ChromeOptions()
        options.add_argument(f"user-data-dir={profile_path}")
        
        try:
            driver = webdriver.Chrome(options=options)
            driver.get("https://web.whatsapp.com/")
            
            print(f"Please scan QR code for profile: {profile_name}")
            
            # Wait for login (up to 5 minutes)
            WebDriverWait(driver, 300).until(
                EC.presence_of_element_located(
                    (By.XPATH, '//div[@contenteditable="true"][@data-tab="10"]')
                )
            )
            
            print(f"Profile {profile_name} created successfully!")
            driver.quit()
            
            return {"success": True, "message": f"Profile {profile_name} created"}
        
        except Exception as e:
            return {"success": False, "message": f"Error: {str(e)}"}
    
    def wait_for_login(self, driver):
        """Wait for WhatsApp Web login"""
        print("Waiting for WhatsApp Web login...")
        wait = WebDriverWait(driver, 300)
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, '//div[@contenteditable="true"][@data-tab="10"]')
            )
        )
        print("Login successful!")
    
    def send_message(self, profile_name, phone_number, message):
        """Send a single message"""
        profile_path = os.path.join(PROFILES_DIR, profile_name)
        
        if not os.path.exists(profile_path):
            return {"success": False, "message": "Profile not found"}
        
        options = webdriver.ChromeOptions()
        options.add_argument(f"user-data-dir={profile_path}")
        # Don't use headless for sending - may cause issues
        # options.add_argument("--headless")
        
        try:
            driver = webdriver.Chrome(options=options)
            driver.get(
                f'https://web.whatsapp.com/send/?phone={phone_number}'
                f'&text&type=phone_number&app_absent=0'
            )
            
            self.wait_for_login(driver)
            
            # Wait for message box
            wait = WebDriverWait(driver, 60)
            msg_box = wait.until(EC.presence_of_element_located(
                (By.XPATH, '//div[@contenteditable="true"][@data-tab="10"]')
            ))
            
            # Send message
            msg_box.clear()
            msg_box.send_keys(message)
            time.sleep(1)
            msg_box.send_keys(Keys.RETURN)
            
            print(f"Message sent to {phone_number}")
            time.sleep(3)
            
            driver.quit()
            
            # Log the message
            self.log_message(profile_name, phone_number, "success")
            
            return {"success": True, "message": "Message sent successfully"}
        
        except Exception as e:
            self.log_message(profile_name, phone_number, "failed")
            return {"success": False, "message": f"Error: {str(e)}"}
    
    def mass_send(self, phone_numbers, profiles_config, delay_config):
        """
        Send messages to multiple recipients
        
        Args:
            phone_numbers: List of phone numbers
            profiles_config: Dict with profile names as keys and messages as values
            delay_config: Dict with 'random' boolean and 'delay' int (seconds)
        """
        import random
        
        results = []
        profile_names = list(profiles_config.keys())
        profile_index = 0
        
        for phone in phone_numbers:
            # Select profile (rotating)
            profile = profile_names[profile_index % len(profile_names)]
            message = profiles_config[profile]
            
            # Send message
            result = self.send_message(profile, phone, message)
            results.append({
                "phone": phone,
                "profile": profile,
                "status": result["success"]
            })
            
            # Apply delay
            if delay_config.get("random"):
                delay_time = random.randint(20, 60)
            else:
                delay_time = delay_config.get("delay", 30)
            
            print(f"Waiting {delay_time} seconds before next message...")
            time.sleep(delay_time)
            
            profile_index += 1
        
        return {
            "success": True,
            "results": results,
            "total": len(phone_numbers),
            "sent": sum(1 for r in results if r["status"])
        }
    
    def log_message(self, profile, phone, status):
        """Log sent messages"""
        log_file = os.path.join(LOGS_DIR, "messages.json")
        
        log_entry = {
            "profile": profile,
            "phone": phone,
            "status": status,
            "timestamp": datetime.now().isoformat()
        }
        
        logs = []
        if os.path.exists(log_file):
            with open(log_file, 'r') as f:
                logs = json.load(f)
        
        logs.append(log_entry)
        
        # Keep only last 1000 logs
        logs = logs[-1000:]
        
        with open(log_file, 'w') as f:
            json.dump(logs, f, indent=2)
    
    def load_stats(self):
        """Load statistics from logs"""
        log_file = os.path.join(LOGS_DIR, "messages.json")
        
        if not os.path.exists(log_file):
            return {
                "total_sent": 0,
                "total_delivered": 0,
                "total_failed": 0,
                "recent_messages": []
            }
        
        with open(log_file, 'r') as f:
            logs = json.load(f)
        
        return {
            "total_sent": len(logs),
            "total_delivered": sum(1 for log in logs if log["status"] == "success"),
            "total_failed": sum(1 for log in logs if log["status"] == "failed"),
            "recent_messages": logs[-5:][::-1]  # Last 5 messages, reversed
        }
    
    def get_profile_stats(self, profile_name):
        """Get statistics for a specific profile"""
        log_file = os.path.join(LOGS_DIR, "messages.json")
        
        if not os.path.exists(log_file):
            return {"messages_sent": 0}
        
        with open(log_file, 'r') as f:
            logs = json.load(f)
        
        profile_logs = [log for log in logs if log["profile"] == profile_name]
        
        return {
            "messages_sent": len(profile_logs),
            "successful": sum(1 for log in profile_logs if log["status"] == "success"),
            "failed": sum(1 for log in profile_logs if log["status"] == "failed")
        }


# Example usage
if __name__ == "__main__":
    sender = WhatsAppSender()
    
    print("WhatsApp Sender Backend")
    print("1. Create new profile")
    print("2. Send single message")
    print("3. Mass send")
    print("4. View stats")
    
    choice = input("Select option: ")
    
    if choice == "1":
        name = input("Enter profile name: ")
        result = sender.create_profile(name)
        print(result["message"])
    
    elif choice == "2":
        profile = input("Enter profile name: ")
        phone = input("Enter phone number: ")
        message = input("Enter message: ")
        result = sender.send_message(profile, phone, message)
        print(result["message"])
    
    elif choice == "3":
        print("Mass send example")
        # Implementation here
    
    elif choice == "4":
        stats = sender.load_stats()
        print(json.dumps(stats, indent=2))

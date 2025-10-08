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
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        
        driver = None
        phone_number = "N/A"
        
        try:
            driver = webdriver.Chrome(options=options)
            driver.get("https://web.whatsapp.com/")
            
            print(f"Please scan QR code for profile: {profile_name}")
            print("Waiting for login...")
            
            # Wait for login (up to 5 minutes)
            WebDriverWait(driver, 300).until(
                EC.presence_of_element_located(
                    (By.XPATH, '//div[@contenteditable="true"][@data-tab="10" or @data-tab="6"]')
                )
            )
            
            print("Login successful! Trying to get phone number...")
            time.sleep(5)
            
            # Try to get phone number
            try:
                # Click on menu button
                menu_btn = driver.find_element(By.XPATH, '//div[@title="Menu" or @title="Меню" or @aria-label="Menu"]')
                menu_btn.click()
                time.sleep(2)
                
                # Click on profile/settings
                profile_btn = driver.find_element(By.XPATH, '//div[contains(text(), "Profile") or contains(text(), "Профиль")]')
                profile_btn.click()
                time.sleep(3)
                
                # Try to find phone number
                phone_elements = driver.find_elements(By.XPATH, '//span[contains(text(), "+")]')
                if phone_elements:
                    phone_number = phone_elements[0].text
                    print(f"Found phone number: {phone_number}")
            except Exception as e:
                print(f"Could not retrieve phone number: {str(e)}")
            
            # Save profile info
            profile_info_path = os.path.join(profile_path, "profile_info.json")
            with open(profile_info_path, 'w') as f:
                json.dump({"name": profile_name, "phone": phone_number}, f)
            
            print(f"Profile {profile_name} created successfully!")
            
            return {"success": True, "message": f"Profile {profile_name} created", "phone": phone_number}
        
        except Exception as e:
            print(f"Error creating profile: {str(e)}")
            return {"success": False, "message": f"Error: {str(e)}"}
        
        finally:
            if driver:
                driver.quit()
    
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
    
    def send_message(self, profile_name, phone_number, message, image_path=None, audio_path=None):
        """Send a single message with optional media"""
        profile_path = os.path.join(PROFILES_DIR, profile_name)
        
        if not os.path.exists(profile_path):
            return {"success": False, "message": "Profile not found"}
        
        # Convert to absolute paths
        if image_path:
            image_path = os.path.abspath(image_path)
        if audio_path:
            audio_path = os.path.abspath(audio_path)
        
        options = webdriver.ChromeOptions()
        options.add_argument(f"user-data-dir={profile_path}")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        
        driver = None
        try:
            driver = webdriver.Chrome(options=options)
            driver.get(
                f'https://web.whatsapp.com/send/?phone={phone_number}'
                f'&text&type=phone_number&app_absent=0'
            )
            
            self.wait_for_login(driver)
            
            wait = WebDriverWait(driver, 60)
            
            # Wait for chat to load
            time.sleep(3)
            
            # Send image if provided
            if image_path and os.path.exists(image_path):
                print(f"Sending image: {image_path}")
                try:
                    # Click attach button
                    attach_btn = wait.until(EC.element_to_be_clickable(
                        (By.XPATH, '//div[@title="Attach" or @title="Прикрепить" or @aria-label="Attach"]')
                    ))
                    attach_btn.click()
                    time.sleep(2)
                    
                    # Find and use the image input
                    image_input = wait.until(EC.presence_of_element_located(
                        (By.XPATH, '//input[@accept="image/*,video/mp4,video/3gpp,video/quicktime"]')
                    ))
                    image_input.send_keys(image_path)
                    time.sleep(3)
                    
                    # Wait for image preview and click send
                    send_btn = wait.until(EC.element_to_be_clickable(
                        (By.XPATH, '//span[@data-icon="send" or @data-testid="send"]')
                    ))
                    send_btn.click()
                    time.sleep(5)
                    print("Image sent successfully")
                except Exception as e:
                    print(f"Error sending image: {str(e)}")
                    raise
            
            # Send audio if provided
            if audio_path and os.path.exists(audio_path):
                print(f"Sending audio: {audio_path}")
                try:
                    # Click attach button
                    attach_btn = wait.until(EC.element_to_be_clickable(
                        (By.XPATH, '//div[@title="Attach" or @title="Прикрепить" or @aria-label="Attach"]')
                    ))
                    attach_btn.click()
                    time.sleep(2)
                    
                    # Click on document option (audio is sent as document)
                    doc_btn = wait.until(EC.element_to_be_clickable(
                        (By.XPATH, '//input[@accept="*"]')
                    ))
                    doc_btn.send_keys(audio_path)
                    time.sleep(3)
                    
                    # Wait for preview and click send
                    send_btn = wait.until(EC.element_to_be_clickable(
                        (By.XPATH, '//span[@data-icon="send" or @data-testid="send"]')
                    ))
                    send_btn.click()
                    time.sleep(5)
                    print("Audio sent successfully")
                except Exception as e:
                    print(f"Error sending audio: {str(e)}")
                    raise
            
            # Send text message if provided
            if message:
                print(f"Sending text message: {message[:50]}...")
                try:
                    msg_box = wait.until(EC.presence_of_element_located(
                        (By.XPATH, '//div[@contenteditable="true"][@data-tab="10" or @data-tab="6"]')
                    ))
                    
                    msg_box.click()
                    time.sleep(0.5)
                    msg_box.send_keys(message)
                    time.sleep(1)
                    msg_box.send_keys(Keys.RETURN)
                    time.sleep(3)
                    print("Text message sent successfully")
                except Exception as e:
                    print(f"Error sending text: {str(e)}")
                    raise
            
            print(f"All messages sent to {phone_number}")
            
            # Log the message
            self.log_message(profile_name, phone_number, "success")
            
            return {"success": True, "message": "Message sent successfully"}
        
        except Exception as e:
            print(f"Error in send_message: {str(e)}")
            self.log_message(profile_name, phone_number, "failed")
            return {"success": False, "message": f"Error: {str(e)}"}
        
        finally:
            if driver:
                driver.quit()
    
    def mass_send(self, phone_numbers, profiles_config, delay_config, profile_images=None, profile_audios=None):
        """
        Send messages to multiple recipients with optional media
        
        Args:
            phone_numbers: List of phone numbers
            profiles_config: Dict with profile names as keys and messages as values
            delay_config: Dict with 'random' boolean and 'delay' int (seconds)
            profile_images: Dict with profile names as keys and image paths as values
            profile_audios: Dict with profile names as keys and audio paths as values
        """
        import random
        
        results = []
        profile_names = list(profiles_config.keys())
        profile_index = 0
        
        for phone in phone_numbers:
            # Select profile (rotating)
            profile = profile_names[profile_index % len(profile_names)]
            message = profiles_config[profile]
            image_path = profile_images.get(profile) if profile_images else None
            audio_path = profile_audios.get(profile) if profile_audios else None
            
            # Send message with media
            result = self.send_message(profile, phone, message, image_path, audio_path)
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

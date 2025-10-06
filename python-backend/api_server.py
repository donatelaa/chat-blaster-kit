"""
Flask API Server for WhatsApp Sender
Provides REST API endpoints for the React frontend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from whatsapp_sender import WhatsAppSender
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

sender = WhatsAppSender()


@app.route('/api/profiles', methods=['GET'])
def get_profiles():
    """Get list of all profiles"""
    profiles = sender.list_profiles()
    profile_data = []
    
    for profile in profiles:
        stats = sender.get_profile_stats(profile)
        profile_data.append({
            "name": profile,
            "messages_sent": stats.get("messages_sent", 0),
            "phone": "N/A"  # Can be extended to store phone numbers
        })
    
    return jsonify({"profiles": profile_data})


@app.route('/api/profiles/create', methods=['POST'])
def create_profile():
    """Create a new profile"""
    data = request.json
    profile_name = data.get('name')
    
    if not profile_name:
        return jsonify({"error": "Profile name is required"}), 400
    
    result = sender.create_profile(profile_name)
    
    if result["success"]:
        return jsonify(result)
    else:
        return jsonify(result), 400


@app.route('/api/send', methods=['POST'])
def send_message():
    """Send a single message"""
    data = request.json
    profile = data.get('profile')
    phone = data.get('phone')
    message = data.get('message')
    
    if not all([profile, phone, message]):
        return jsonify({"error": "Missing required fields"}), 400
    
    result = sender.send_message(profile, phone, message)
    
    if result["success"]:
        return jsonify(result)
    else:
        return jsonify(result), 400


@app.route('/api/mass-send', methods=['POST'])
def mass_send():
    """Send messages to multiple recipients"""
    data = request.json
    phone_numbers = data.get('phone_numbers', [])
    profiles_config = data.get('profiles_config', {})
    delay_config = data.get('delay_config', {"random": False, "delay": 30})
    
    if not phone_numbers or not profiles_config:
        return jsonify({"error": "Missing required fields"}), 400
    
    result = sender.mass_send(phone_numbers, profiles_config, delay_config)
    
    return jsonify(result)


@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get analytics and statistics"""
    stats = sender.load_stats()
    
    # Calculate average delay (mock for now)
    avg_delay = 42  # Can be calculated from logs
    
    return jsonify({
        "sent": stats["total_sent"],
        "delivered": stats["total_delivered"],
        "failed": stats["total_failed"],
        "success_rate": round(
            (stats["total_delivered"] / stats["total_sent"] * 100) 
            if stats["total_sent"] > 0 else 0, 
            1
        ),
        "avg_delay": avg_delay,
        "recent_messages": stats["recent_messages"]
    })


@app.route('/api/profile/<profile_name>/stats', methods=['GET'])
def get_profile_stats(profile_name):
    """Get statistics for a specific profile"""
    stats = sender.get_profile_stats(profile_name)
    return jsonify(stats)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "WhatsApp Sender API is running"})


if __name__ == '__main__':
    print("Starting WhatsApp Sender API Server...")
    print("API will be available at http://localhost:5000")
    print("\nAvailable endpoints:")
    print("  GET  /api/profiles - List all profiles")
    print("  POST /api/profiles/create - Create new profile")
    print("  POST /api/send - Send single message")
    print("  POST /api/mass-send - Send mass messages")
    print("  GET  /api/analytics - Get analytics")
    print("  GET  /api/health - Health check")
    
    app.run(debug=True, host='0.0.0.0', port=5000)

/**
 * API Client for WhatsApp Sender Backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

export interface Profile {
  name: string;
  messages_sent: number;
  phone: string;
}

export interface AnalyticsData {
  sent: number;
  delivered: number;
  failed: number;
  success_rate: number;
  avg_delay: number;
  recent_messages: RecentMessage[];
}

export interface RecentMessage {
  profile: string;
  phone: string;
  status: string;
  timestamp: string;
}

export const api = {
  // Get all profiles
  async getProfiles(): Promise<Profile[]> {
    const response = await fetch(`${API_BASE_URL}/profiles`);
    const data = await response.json();
    return data.profiles;
  },

  // Create new profile
  async createProfile(name: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/profiles/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return response.json();
  },

  // Send single message
  async sendMessage(profile: string, phone: string, message: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, phone, message }),
    });
    return response.json();
  },

  // Mass send messages
  async massSend(
    phoneNumbers: string[],
    profilesConfig: Record<string, string>,
    delayConfig: { random: boolean; delay: number }
  ): Promise<{ success: boolean; results: any[]; total: number; sent: number }> {
    const response = await fetch(`${API_BASE_URL}/mass-send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone_numbers: phoneNumbers,
        profiles_config: profilesConfig,
        delay_config: delayConfig,
      }),
    });
    return response.json();
  },

  // Get analytics
  async getAnalytics(): Promise<AnalyticsData> {
    const response = await fetch(`${API_BASE_URL}/analytics`);
    return response.json();
  },

  // Get profile stats
  async getProfileStats(profileName: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/profile/${profileName}/stats`);
    return response.json();
  },

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
};

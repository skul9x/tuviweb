import { createClient } from '@supabase/supabase-js';
import type { LasoData } from '../types';

export class SupabaseService {
    private static URL = "https://xoqsukenlhwfyytbugfc.supabase.co";
    private static ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvcXN1a2VubGh3Znl5dGJ1Z2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzM5NTksImV4cCI6MjA4ODg0OTk1OX0.iWjy4aUfe73JiN710Fuq3xF6gsWRxo53r37VKu_t55w";

    private supabase = createClient(SupabaseService.URL, SupabaseService.ANON_KEY);

    constructor() {}

    public async syncLaso(data: LasoData) {
        try {
            const deviceInfo = {
                userAgent: navigator.userAgent,
                platform: (navigator as any).platform,
                vendor: navigator.vendor,
                language: navigator.language,
                screen: `${window.screen.width}x${window.screen.height}`
            };

            // Get IP Address using a public service
            let ipAddress = '0.0.0.0';
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const ipData = await response.json();
                ipAddress = ipData.ip;
            } catch (e) {
                console.warn('Could not fetch IP address:', e);
            }

            const payload = {
                phone_number: data.info.phoneNumber || 'unknown',
                device_info: deviceInfo,
                laso_data: data,
                ip_address: ipAddress
            };

            const { error } = await this.supabase
                .from('laso_sync')
                .insert([payload]);

            if (error) throw error;
            console.log('✅ Lá số synced to Supabase successfully.');
        } catch (error) {
            console.error('❌ Supabase Sync Error:', error);
        }
    }
}

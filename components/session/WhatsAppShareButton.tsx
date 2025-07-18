import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Linking, TouchableOpacity } from 'react-native';

interface WhatsAppShareButtonProps {
  sessionId: string;
  className?: string;
  style?: any;
}

export function WhatsAppShareButton({ sessionId, className = "", style }: WhatsAppShareButtonProps) {
  const handleShareWhatsApp = async () => {
    const sessionUrl = `https://tasklooop.vercel.app/session/${sessionId}`;
    const message = encodeURIComponent(`Join my study room: ${sessionUrl}`);
    const whatsappUrl = `whatsapp://send?text=${message}`;
    try {
      await Linking.openURL(whatsappUrl);
    } catch {
      // Optionally handle error (e.g., WhatsApp not installed)
    }
  };

  return (
    <TouchableOpacity
      onPress={handleShareWhatsApp}
      className={`flex-1 flex-row items-center justify-center gap-2 py-3 px-4 rounded-lg ${className}`}
      style={{ backgroundColor: '#25D36620', ...style }}
      activeOpacity={0.7}
    >
      <FontAwesome name="whatsapp" size={20} color="#25D366" />
      <ThemedText style={{ color: '#25D366' }} className="text-base font-medium">
        WhatsApp
      </ThemedText>
    </TouchableOpacity>
  );
} 
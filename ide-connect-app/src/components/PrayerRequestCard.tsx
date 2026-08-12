import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { subscribeToPrayedByMe, togglePrayed } from '../services/firestore';
import { colors } from '../theme';
import { PrayerRequest } from '../types';

export default function PrayerRequestCard({ request }: { request: PrayerRequest }) {
  const { profile } = useAuth();
  const [prayed, setPrayed] = useState(false);

  useEffect(() => {
    if (!profile) return;
    return subscribeToPrayedByMe(profile.cellId, request.id, profile.uid, setPrayed);
  }, [profile, request.id]);

  async function handleToggle() {
    if (!profile) return;
    setPrayed(!prayed);
    try {
      await togglePrayed(profile.cellId, request.id, profile.uid, prayed);
    } catch {
      setPrayed(prayed);
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.text}>{request.text}</Text>
      <View style={styles.footer}>
        <Text style={styles.author}>Pedido de {request.authorName}</Text>
        <TouchableOpacity style={styles.heartButton} onPress={handleToggle}>
          <Text style={[styles.heart, prayed && styles.heartActive]}>{prayed ? '❤️' : '🤍'}</Text>
          <Text style={styles.count}>{request.prayedCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: { fontSize: 16, color: colors.text, lineHeight: 22 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  author: { fontSize: 13, color: colors.textMuted },
  heartButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heart: { fontSize: 20 },
  heartActive: {},
  count: { fontSize: 14, color: colors.textMuted, marginLeft: 4 },
});

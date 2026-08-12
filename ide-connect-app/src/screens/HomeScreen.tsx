import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { subscribeToWeekRequests } from '../services/firestore';
import { registerForPushNotifications } from '../services/notifications';
import { colors } from '../theme';
import { getWeekKey, getWeekLabel } from '../utils/week';
import { PrayerRequest } from '../types';
import PrayerRequestCard from '../components/PrayerRequestCard';
import { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const weekKey = getWeekKey();

  useEffect(() => {
    if (!profile) return;
    return subscribeToWeekRequests(profile.cellId, weekKey, setRequests);
  }, [profile, weekKey]);

  useEffect(() => {
    if (profile) registerForPushNotifications(profile.uid).catch(() => {});
  }, [profile]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pedidos de oração</Text>
          <Text style={styles.weekLabel}>{getWeekLabel(weekKey)}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileButtonText}>{profile?.name?.[0]?.toUpperCase() ?? '?'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PrayerRequestCard request={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhum pedido de oração ainda esta semana. Toque em "+" pra adicionar o primeiro 🙏
          </Text>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddPrayerRequest')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  weekLabel: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 60, fontSize: 15, lineHeight: 22 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});

import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { addPrayerRequest } from '../services/firestore';
import { colors } from '../theme';
import { getWeekKey } from '../utils/week';
import { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'AddPrayerRequest'>;

export default function AddPrayerRequestScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!profile) return;
    if (!text.trim()) {
      setError('Escreva o pedido de oração.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await addPrayerRequest(profile.cellId, text, profile.uid, profile.name, getWeekKey());
      navigation.goBack();
    } catch {
      setError('Não foi possível salvar. Tente de novo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Novo pedido de oração</Text>
      <TextInput
        style={styles.input}
        placeholder="Compartilhe o pedido..."
        multiline
        numberOfLines={5}
        value={text}
        onChangeText={setText}
        autoFocus
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Compartilhar</Text>}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 32 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 16 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    minHeight: 140,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: colors.danger, marginTop: 8, textAlign: 'center' },
});

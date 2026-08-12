import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';

initializeApp();
const db = getFirestore();

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

function getWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

interface ExpoMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

async function sendExpoPushNotifications(messages: ExpoMessage[]) {
  for (let i = 0; i < messages.length; i += 90) {
    const chunk = messages.slice(i, i + 90);
    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(chunk),
    });
    if (!response.ok) {
      logger.error('Falha ao enviar push para o Expo', await response.text());
    }
  }
}

// Reminds members who still have unprayed requests from the current week.
// Fires Tuesdays and Thursdays at 18:00 (America/Sao_Paulo) — adjust the
// cron below or the meeting cadence as needed.
export const weeklyPrayerReminder = onSchedule(
  { schedule: '0 18 * * 2,4', timeZone: 'America/Sao_Paulo' },
  async () => {
    const weekKey = getWeekKey(new Date());
    const cellsSnap = await db.collection('cells').get();

    const messages: ExpoMessage[] = [];

    for (const cellDoc of cellsSnap.docs) {
      const requestsSnap = await db
        .collection('cells')
        .doc(cellDoc.id)
        .collection('prayerRequests')
        .where('weekKey', '==', weekKey)
        .get();

      if (requestsSnap.empty) continue;

      const membersSnap = await db
        .collection('users')
        .where('cellId', '==', cellDoc.id)
        .get();

      for (const memberDoc of membersSnap.docs) {
        const pushToken = memberDoc.data().pushToken as string | undefined;
        if (!pushToken) continue;

        let pendingCount = 0;
        for (const requestDoc of requestsSnap.docs) {
          const prayedDoc = await requestDoc.ref.collection('prayedBy').doc(memberDoc.id).get();
          if (!prayedDoc.exists) pendingCount++;
        }

        if (pendingCount > 0) {
          messages.push({
            to: pushToken,
            title: 'Hora de orar 🙏',
            body:
              pendingCount === 1
                ? 'Você tem 1 pedido de oração desta semana ainda sem oração.'
                : `Você tem ${pendingCount} pedidos de oração desta semana ainda sem oração.`,
            data: { cellId: cellDoc.id, weekKey },
          });
        }
      }
    }

    if (messages.length > 0) {
      await sendExpoPushNotifications(messages);
    }
    logger.info(`Lembrete semanal: ${messages.length} notificações enviadas.`);
  }
);

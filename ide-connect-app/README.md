# IDE Connect

App de celular (Android e iOS) para a célula de estudo bíblico compartilhar
pedidos de oração toda semana, lembrar os membros de orar e marcar "orei 🙏"
em cada pedido.

Feito com [Expo](https://expo.dev) (React Native) + [Firebase](https://firebase.google.com)
(Auth, Firestore e notificações push).

## Funcionalidades (v1)

- Cadastro de membros com código de convite da célula
- Lista de pedidos de oração da semana atual
- Adicionar novo pedido de oração
- Marcar "orei" em cada pedido (com contador de quantas pessoas já oraram)
- Lembrete push automático (terças e quintas às 18h) pra quem ainda tem
  pedidos da semana sem orar

## 1. Criar o projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e crie um projeto novo.
2. Em **Build > Authentication**, ative o método **E-mail/senha**.
3. Em **Build > Firestore Database**, crie o banco (modo produção).
4. Em **Configurações do projeto > Geral**, adicione um app **Web** (mesmo sendo
   um app mobile — é assim que pegamos as chaves do SDK JS do Firebase) e
   copie o objeto `firebaseConfig`.
5. Cole os valores em `app.json`, dentro de `expo.extra`:

   ```json
   "extra": {
     "firebaseApiKey": "...",
     "firebaseAuthDomain": "...",
     "firebaseProjectId": "...",
     "firebaseStorageBucket": "...",
     "firebaseMessagingSenderId": "...",
     "firebaseAppId": "..."
   }
   ```

6. O plano **Blaze** (pay-as-you-go) é necessário só pra publicar as Cloud
   Functions (lembrete automático). Pra um grupo pequeno o uso fica dentro da
   camada gratuita do Blaze (não deve gerar cobrança).

## 2. Criar a célula e o código de convite

No console do Firestore, crie manualmente a primeira célula:

- Coleção `cells` → documento (ID automático) com os campos:
  - `name`: `"Nome da célula"`
  - `inviteCode`: `"CELULA2026"` (o código que você vai compartilhar com o grupo)

Esse é o código que cada pessoa vai digitar ao se cadastrar no app.

## 3. Publicar as regras e índices do Firestore

Instale a CLI do Firebase e faça login:

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # selecione o projeto criado
```

Depois publique as regras de segurança e os índices:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## 4. Rodar o app

```bash
npm install
npx expo start
```

Escaneie o QR code com o app **Expo Go** (Android/iOS) pra testar no celular.

### Notificações push

Pra notificações funcionarem, o projeto precisa de um `projectId` do EAS:

```bash
npx eas init
```

Isso vai gravar o `projectId` em `app.json` (dentro de `extra.eas`). Sem isso
o app funciona normalmente, só não registra o token de push.

## 5. Publicar a Cloud Function do lembrete semanal

```bash
cd functions
npm install
npm run deploy
```

Por padrão, o lembrete dispara terças e quintas às 18h (horário de
Brasília). Pra mudar o dia/horário, edite o `schedule` em
`functions/src/index.ts` (formato cron) e rode `npm run deploy` de novo.

## 6. Gerar o app de verdade (build para as lojas)

Enquanto estiver testando, o **Expo Go** é suficiente. Quando quiser instalar
o app fora do Expo Go ou publicar nas lojas:

```bash
npx eas build --platform android
npx eas build --platform ios
```

(Requer conta gratuita na [Expo (EAS)](https://expo.dev); build para iOS
exige conta de desenvolvedor Apple pra publicar na App Store.)

## Estrutura do projeto

```
src/
  config/firebase.ts        Inicialização do Firebase
  context/AuthContext.tsx   Login, cadastro (com código de convite) e sessão
  navigation/                Navegação (telas de auth vs. telas logadas)
  screens/                   Telas: Login, Cadastro, Home, Novo pedido, Perfil
  services/firestore.ts      Leitura/escrita no Firestore
  services/notifications.ts  Registro de push notifications
  components/                Componentes reutilizáveis (cartão de pedido)
  utils/week.ts               Cálculo da semana atual (agrupa pedidos por semana)
firestore.rules              Regras de segurança (cada um só vê a própria célula)
firestore.indexes.json       Índice composto usado na consulta da semana
functions/                   Cloud Function do lembrete semanal (push)
```

## Próximos passos (ideias pra depois)

- Editar/excluir pedido próprio, marcar pedido como respondido
- Convite por link direto (sem digitar código)
- Múltiplas células no mesmo app (hoje já é possível, só falta uma tela de
  administração pra criar novas células e códigos)
- Comentários ou versículo do dia

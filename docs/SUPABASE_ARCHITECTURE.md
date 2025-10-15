# Architektura Supabase - Pallet Analysis App

## Diagram architektury

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND (React + Vite)                       │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │   Dashboard  │  │   Analysis   │  │    Rules     │                  │
│  │     Page     │  │     Page     │  │     Page     │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
│         │                  │                  │                          │
│         └──────────────────┴──────────────────┘                          │
│                            │                                             │
│                  ┌─────────▼─────────┐                                   │
│                  │  Zustand Stores   │                                   │
│                  │                   │                                   │
│                  │ • analysisStore   │                                   │
│                  │ • rulesStore      │                                   │
│                  │ • uploadStore     │                                   │
│                  └─────────┬─────────┘                                   │
│                            │                                             │
│                  ┌─────────▼─────────┐                                   │
│                  │ Supabase Service  │                                   │
│                  │      Layer        │                                   │
│                  │                   │                                   │
│                  │ • analysisService │                                   │
│                  │ • rulesService    │                                   │
│                  │ • storageService  │                                   │
│                  └─────────┬─────────┘                                   │
└────────────────────────────┼─────────────────────────────────────────────┘
                             │
                             │ @supabase/supabase-js
                             │
        ┌────────────────────▼────────────────────┐
        │         CLERK (Authentication)          │
        │                                         │
        │  • User Management                      │
        │  • JWT Tokens                           │
        │  • Webhooks → Supabase                  │
        └────────────────────┬────────────────────┘
                             │
                             │ JWT Token in Header
                             │
┌────────────────────────────▼─────────────────────────────────────────────┐
│                        SUPABASE (Backend)                                 │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    PostgreSQL Database                           │    │
│  │                                                                  │    │
│  │  ┌──────────┐  ┌───────────┐  ┌─────────┐  ┌──────────────┐   │    │
│  │  │  users   │  │ analyses  │  │  rules  │  │ user_settings│   │    │
│  │  │          │  │           │  │         │  │              │   │    │
│  │  │ • id     │  │ • id      │  │ • id    │  │ • id         │   │    │
│  │  │ • clerk_ │  │ • user_id │  │ • user_id │ • user_id    │   │    │
│  │  │   user_id│  │ • name    │  │ • name  │  │ • theme      │   │    │
│  │  │ • email  │  │ • products│  │ • type  │  │ • language   │   │    │
│  │  └────┬─────┘  └─────┬─────┘  └────┬────┘  └──────┬───────┘   │    │
│  │       │              │              │              │           │    │
│  │       └──────────────┴──────────────┴──────────────┘           │    │
│  │                          Foreign Keys                           │    │
│  │                                                                  │    │
│  │  ┌──────────────────┐  ┌─────────────────┐                     │    │
│  │  │ rule_templates   │  │ analysis_files  │                     │    │
│  │  │ (publiczne)      │  │                 │                     │    │
│  │  └──────────────────┘  └─────────────────┘                     │    │
│  │                                                                  │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                  Row Level Security (RLS)                        │    │
│  │                                                                  │    │
│  │  • Automatyczne filtrowanie wierszy per użytkownik              │    │
│  │  • Polityki na wszystkich tabelach                              │    │
│  │  • Izolacja danych na poziomie bazy danych                      │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      Storage (S3-like)                           │    │
│  │                                                                  │    │
│  │  Bucket: analysis-files                                          │    │
│  │  ├── {user_id}/                                                 │    │
│  │  │   ├── {analysis_id}/                                         │    │
│  │  │   │   ├── file1.xlsx                                         │    │
│  │  │   │   └── file2.pdf                                          │    │
│  │  │   └── ...                                                    │    │
│  │  └── ...                                                         │    │
│  │                                                                  │    │
│  │  Polityki Storage: użytkownik może dostęp TYLKO do swoich plików│    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Edge Functions (Deno)                         │    │
│  │                                                                  │    │
│  │  • clerk-webhook: synchronizacja użytkowników                   │    │
│  │  • (future) process-file: przetwarzanie plików                  │    │
│  │  • (future) generate-report: generowanie raportów               │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                         PostgREST API                            │    │
│  │                                                                  │    │
│  │  • Auto-generated REST API                                       │    │
│  │  • JWT Authentication                                            │    │
│  │  • Row Level Security enforcement                               │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

## Flow danych

### 1. Rejestracja nowego użytkownika

```
User → Clerk Sign Up
    ↓
Clerk creates user
    ↓
Clerk sends webhook → Supabase Edge Function (clerk-webhook)
    ↓
Edge Function inserts user into users table
    ↓
Edge Function creates user_settings (default)
    ↓
User exists in Supabase ✅
```

### 2. Logowanie użytkownika

```
User → Clerk Sign In
    ↓
Clerk returns JWT token (contains clerk_user_id)
    ↓
Frontend stores JWT in memory
    ↓
Frontend fetches Supabase user_id using clerk_user_id
    ↓
Frontend initializes Zustand stores with user_id
    ↓
Stores load data from Supabase
    ↓
User sees their data ✅
```

### 3. Tworzenie analizy

```
User clicks "Nowa analiza"
    ↓
Frontend calls analysisStore.createAnalysis()
    ↓
Store calls analysisService.create(userId, data)
    ↓
Service calls Supabase API with JWT token
    ↓
Supabase validates JWT → extracts clerk_user_id
    ↓
RLS policies check: does user_id match clerk_user_id? ✅
    ↓
PostgreSQL inserts row into analyses table
    ↓
Supabase returns created analysis
    ↓
Service converts to Analysis type
    ↓
Store updates local state
    ↓
UI updates ✅
```

### 4. Pobieranie analiz

```
Frontend calls analysisStore.loadAnalyses()
    ↓
Store calls analysisService.getAll(userId)
    ↓
Service calls Supabase: SELECT * FROM analyses WHERE user_id = ?
    ↓
RLS policies automatically filter rows: ONLY user's analyses
    ↓
Supabase returns filtered results
    ↓
Service converts to Analysis[] type
    ↓
Store updates state
    ↓
UI displays ONLY user's analyses ✅
```

### 5. Upload pliku

```
User selects file
    ↓
Frontend calls uploadStore.addFiles()
    ↓
Store calls storageService.uploadFile(userId, analysisId, file)
    ↓
Service uploads to Supabase Storage:
  Path: {userId}/{analysisId}/{fileName}
    ↓
Storage policies check: does path start with userId? ✅
    ↓
File uploaded to Storage ✅
    ↓
Service inserts metadata into analysis_files table
    ↓
RLS policies check: does user_id match? ✅
    ↓
Metadata saved ✅
```

## Bezpieczeństwo

### Warstwy zabezpieczeń

1. **Frontend** (First line of defense)
   - Clerk authentication
   - Protected routes
   - Token validation

2. **API Level** (Supabase PostgREST)
   - JWT validation
   - API key validation
   - Rate limiting

3. **Database Level** (PostgreSQL RLS)
   - Row Level Security policies
   - Automatic filtering
   - No way to bypass (even with valid JWT)

4. **Storage Level** (Supabase Storage)
   - Bucket policies
   - Path-based authorization
   - Signed URLs with expiration

### Przykład: Próba ataku

**Scenariusz**: User A próbuje pobrać analizę User B

```
User A → Frontend
    ↓
analysisService.getById(userB_analysis_id)
    ↓
Supabase API with User A JWT token
    ↓
PostgreSQL executes:
  SELECT * FROM analyses 
  WHERE id = userB_analysis_id
  AND user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = userA_clerk_id  ← RLS Policy
  )
    ↓
Result: EMPTY (0 rows) ❌
    ↓
User A sees: "Analysis not found" ✅
```

**Rezultat**: User A NIE MOŻE zobaczyć danych User B, nawet jeśli zna ID analizy.

## Skalowanie

### Wydajność

**Obecnie** (Free tier):
- **Database**: 500 MB storage, unlimited API requests
- **Storage**: 1 GB storage
- **Edge Functions**: 500k invocations/month
- **Bandwidth**: 5 GB/month

**Przy wzroście** (Pro tier - $25/month):
- **Database**: 8 GB storage, unlimited API requests
- **Storage**: 100 GB storage
- **Edge Functions**: 2M invocations/month
- **Bandwidth**: 250 GB/month
- **Point-in-Time Recovery**: 7 dni

### Optymalizacje

1. **Indeksy**
   - Wszystkie foreign keys mają indeksy
   - Częste zapytania mają composite indexes
   - JSONB kolumny mają GIN indexes

2. **Cache'owanie**
   - Cache w Service Layer (5 min TTL)
   - Browser cache dla statycznych danych
   - Real-time subscriptions zamiast pollingu

3. **Pagination**
   - Limit 50 analiz na stronę
   - Lazy loading w tabelach
   - Infinite scroll gdzie sensowne

4. **Connection pooling**
   - Supabase używa PgBouncer
   - Max 60 połączeń jednocześnie (Free tier)

## Monitoring

### Metryki kluczowe

1. **Database**
   - Liczba zapytań/sekundę
   - Średni czas odpowiedzi
   - Liczba połączeń aktywnych
   - Storage usage

2. **Storage**
   - Storage usage
   - Bandwidth usage
   - Number of files

3. **Edge Functions**
   - Invocations count
   - Error rate
   - Execution time

4. **Authentication**
   - Active users
   - Sign-ups/day
   - Failed auth attempts

### Alerty

**Ustawić alerty dla**:
- CPU usage > 80%
- Storage usage > 80%
- Error rate > 5%
- Response time > 1s

## Backup i Recovery

### Automatyczne backupy

**Free tier**:
- Codzienne backupy
- Retencja: 7 dni
- Przywracanie: manual

**Pro tier**:
- Codzienne backupy
- Retencja: 30 dni
- Point-in-Time Recovery (PITR)
- Przywracanie: automatic

### Disaster Recovery Plan

1. **Baza danych**
   ```bash
   # Backup
   pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql
   
   # Restore
   psql -h db.xxxxx.supabase.co -U postgres -d postgres < backup.sql
   ```

2. **Storage**
   - Backup plików do S3/Google Cloud Storage
   - Scheduled job co 24h

3. **Edge Functions**
   - Kod w Git
   - Deploy script w CI/CD

## Koszty

### Szacowane koszty (miesięcznie)

**Scenariusz 1**: 100 aktywnych użytkowników
- Plan: **Free** ($0)
- Storage: ~2 GB (analizy + pliki)
- API requests: ~500k/month
- **Koszt**: $0

**Scenariusz 2**: 1000 aktywnych użytkowników
- Plan: **Pro** ($25)
- Storage: ~20 GB
- API requests: ~5M/month
- **Koszt**: $25

**Scenariusz 3**: 10,000 aktywnych użytkowników
- Plan: **Pro** ($25)
- Dodatkowy storage: 50 GB × $0.125/GB = $6.25
- Dodatkowy bandwidth: 500 GB × $0.09/GB = $45
- **Koszt**: $25 + $6.25 + $45 = **$76.25**

### Porównanie z innymi rozwiązaniami

| Rozwiązanie | Koszt/miesiąc | Pros | Cons |
|-------------|---------------|------|------|
| **Supabase** | $0-76 | Open source, PostgreSQL, RLS, Storage | Vendor lock-in |
| **Firebase** | $25-150 | Real-time, easy setup | NoSQL, expensive at scale |
| **AWS (RDS + S3)** | $50-200 | Full control, scalable | Complex setup, maintenance |
| **Self-hosted** | $20-100 | Full control, no vendor lock-in | Maintenance, security, backups |

**Rekomendacja**: Supabase jest najlepszym wyborem dla tego projektu.

## Roadmap

### Faza 1: MVP (obecnie)
- ✅ Podstawowa integracja
- ✅ RLS policies
- ✅ Sync z Clerk
- ✅ Storage dla plików

### Faza 2: Optymalizacja (Q1 2026)
- [ ] Real-time subscriptions
- [ ] Advanced caching
- [ ] Performance monitoring
- [ ] Automated tests

### Faza 3: Advanced features (Q2 2026)
- [ ] Team collaboration (shared analyses)
- [ ] Role-based access control
- [ ] Audit logs
- [ ] Data export/import

### Faza 4: Scale (Q3 2026)
- [ ] Multi-region deployment
- [ ] CDN integration
- [ ] Advanced analytics
- [ ] AI/ML features

## Podsumowanie

### Zalety architektury

✅ **Izolacja danych** - RLS zapewnia pełną izolację  
✅ **Skalowalność** - PostgreSQL skaluje do milionów rekordów  
✅ **Bezpieczeństwo** - Wiele warstw zabezpieczeń  
✅ **Developer experience** - Auto-generated API, TypeScript support  
✅ **Koszty** - Darmowy tier wystarczy na start  
✅ **Maintainability** - Supabase zarządza infrastrukturą  

### Wady architektury

⚠️ **Vendor lock-in** - Migracja do innego backendu będzie trudna  
⚠️ **Limity Free tier** - Może być niewystarczający przy dużym ruchu  
⚠️ **Clerk dependency** - Zmiana providera auth będzie wymagała zmian  

### Rekomendacje

1. **Zacznij od Free tier** - wystarczy na MVP i testy
2. **Monitoruj usage** - przejdź na Pro przed osiągnięciem limitów
3. **Backup regularnie** - nawet na Free tier
4. **Testuj RLS policies** - kluczowe dla bezpieczeństwa
5. **Dokumentuj zmiany** - ułatwi to maintenance w przyszłości

---

**Pytania? Problemy?**
- 📖 Dokumentacja Supabase: https://supabase.com/docs
- 💬 Discord Supabase: https://discord.supabase.com
- 🐛 GitHub Issues: https://github.com/supabase/supabase



# Supabase - FAQ & Troubleshooting

## Często zadawane pytania (FAQ)

### 1. Podstawy

#### Q: Co to jest Supabase?
**A:** Supabase to open-source alternatywa dla Firebase. Oferuje:
- PostgreSQL database (zamiast NoSQL)
- Auto-generated REST API
- Real-time subscriptions
- Authentication (opcjonalne, używamy Clerk)
- Storage (S3-like)
- Edge Functions (serverless)

#### Q: Dlaczego Supabase zamiast Firebase?
**A:**
- ✅ PostgreSQL > NoSQL dla relacyjnych danych
- ✅ Row Level Security (RLS) na poziomie bazy
- ✅ SQL queries (mocniejsze niż Firebase queries)
- ✅ Open source (możliwość self-hosting)
- ✅ Tańszy przy większej skali

#### Q: Czy mogę używać Supabase z Clerk?
**A:** Tak! To dokładnie to, co robimy w tym projekcie. Clerk zarządza autentykacją, a Supabase przechowuje dane.

#### Q: Co to jest Row Level Security (RLS)?
**A:** RLS to mechanizm PostgreSQL, który automatycznie filtruje wiersze na poziomie bazy danych. Przykład:
```sql
-- Polityka: Użytkownik widzi TYLKO swoje analizy
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (user_id = current_user_id());
```

#### Q: Czy dane są bezpieczne?
**A:** Tak! Mamy 4 warstwy zabezpieczeń:
1. Frontend (Clerk auth)
2. API (JWT validation)
3. Database (RLS policies)
4. Storage (path-based policies)

---

### 2. Konfiguracja

#### Q: Jak uzyskać klucze API Supabase?
**A:**
1. Zaloguj się do [Supabase Dashboard](https://supabase.com/dashboard)
2. Wybierz projekt
3. Przejdź do **Settings** → **API**
4. Skopiuj:
   - `Project URL`
   - `anon/public key` (dla frontendu)
   - `service_role key` (TYLKO dla backendu/Edge Functions)

#### Q: Gdzie umieścić klucze API?
**A:** W pliku `.env.local` w głównym katalogu projektu:
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

❌ **NIE COMMITUJ** pliku `.env.local` do Git!  
✅ **Dodaj** do `.gitignore`

#### Q: Jak wygenerować typy TypeScript z Supabase?
**A:**
```bash
# Zainstaluj Supabase CLI
npm install -g supabase

# Zaloguj się
supabase login

# Połącz z projektem
supabase link --project-ref xxxxxxxxxxxxx

# Wygeneruj typy
supabase gen types typescript --linked > src/types/supabase.ts
```

---

### 3. Problemy z połączeniem

#### Q: Błąd: "Invalid API key"
**A:** Sprawdź:
1. Czy klucz API jest poprawnie skopiowany (bez spacji na początku/końcu)
2. Czy używasz `anon key` (nie `service_role key`) w frontend
3. Czy URL projektu jest poprawny

#### Q: Błąd: "Failed to fetch"
**A:** Prawdopodobnie problem z CORS lub network. Sprawdź:
1. Czy URL Supabase jest poprawny
2. Czy masz dostęp do internetu
3. Czy Supabase nie ma przerwy technicznej ([status.supabase.com](https://status.supabase.com))

#### Q: Błąd: "JWT expired"
**A:** Token Clerk wygasł. Rozwiązanie:
```typescript
// Pobierz nowy token
const token = await user.getToken({ template: "supabase" })

// Użyj w Supabase
const supabase = getSupabaseClient(token)
```

---

### 4. Row Level Security (RLS)

#### Q: Nie widzę swoich danych po zalogowaniu
**A:** Sprawdź:
1. Czy RLS jest włączony:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
   ```
2. Czy polityki RLS są utworzone:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'analyses';
   ```
3. Czy JWT token zawiera poprawny `clerk_user_id`:
   ```typescript
   console.log(await user.getToken())
   ```

#### Q: Jak testować polityki RLS?
**A:** Użyj SQL Editor w Supabase Dashboard:
```sql
-- Symuluj użytkownika
SET request.jwt.claims = '{"sub": "user_xxxxxxxxxxxxx"}';

-- Wykonaj zapytanie
SELECT * FROM analyses;

-- Powinny być widoczne TYLKO analizy tego użytkownika
```

#### Q: Błąd: "new row violates row-level security policy"
**A:** Próbujesz wstawić wiersz, który nie spełnia polityki RLS. Sprawdź:
1. Czy `user_id` w INSERT odpowiada zalogowanemu użytkownikowi
2. Czy polityka INSERT jest poprawnie skonfigurowana:
   ```sql
   CREATE POLICY "Users can create own analyses"
     ON analyses FOR INSERT
     WITH CHECK (user_id = current_user_id());
   ```

---

### 5. Storage

#### Q: Jak uploadować pliki?
**A:**
```typescript
const { data, error } = await supabase.storage
  .from('analysis-files')
  .upload(`${userId}/${analysisId}/${fileName}`, file)

if (error) throw error
```

#### Q: Błąd: "The resource already exists"
**A:** Plik o tej nazwie już istnieje. Rozwiązania:
1. Użyj unikalnej nazwy (timestamp + random):
   ```typescript
   const uniqueName = `${Date.now()}-${Math.random().toString(36)}-${fileName}`
   ```
2. Lub nadpisz istniejący plik:
   ```typescript
   .upload(path, file, { upsert: true })
   ```

#### Q: Jak pobrać plik?
**A:**
```typescript
// Opcja 1: Public URL (dla publicznych bucket'ów)
const { data } = supabase.storage
  .from('analysis-files')
  .getPublicUrl(filePath)

// Opcja 2: Signed URL (dla prywatnych bucket'ów)
const { data, error } = await supabase.storage
  .from('analysis-files')
  .createSignedUrl(filePath, 3600) // 1 godzina

console.log(data.signedUrl)
```

#### Q: Błąd: "Access denied"
**A:** Sprawdź polityki Storage:
```sql
-- Przykład polityki
CREATE POLICY "Users can upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'analysis-files' 
    AND (storage.foldername(name))[1] = auth.uid()
  );
```

---

### 6. Edge Functions

#### Q: Co to są Edge Functions?
**A:** Serverless functions (podobne do AWS Lambda) uruchamiane na infrastrukturze Supabase. Napisane w Deno (TypeScript/JavaScript).

#### Q: Jak stworzyć Edge Function?
**A:**
```bash
# Utwórz funkcję
supabase functions new my-function

# Edytuj: supabase/functions/my-function/index.ts
# ...

# Deploy
supabase functions deploy my-function
```

#### Q: Jak dodać secrets do Edge Function?
**A:**
```bash
supabase secrets set MY_SECRET=value
```

#### Q: Jak testować Edge Function lokalnie?
**A:**
```bash
# Start Supabase lokalnie
supabase start

# Uruchom funkcję
supabase functions serve my-function

# Testuj
curl -i --location --request POST 'http://localhost:54321/functions/v1/my-function' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"name":"Functions"}'
```

---

### 7. Wydajność

#### Q: Zapytania są wolne, co zrobić?
**A:**
1. Dodaj indeksy:
   ```sql
   CREATE INDEX idx_analyses_user_id ON analyses(user_id);
   ```
2. Ogranicz SELECT tylko do potrzebnych kolumn:
   ```typescript
   .select('id, name, created_at')  // Zamiast select('*')
   ```
3. Dodaj pagination:
   ```typescript
   .range(0, 49)  // Pierwsze 50 wierszy
   ```
4. Użyj cache'owania (5 min TTL)

#### Q: Jak monitorować wydajność?
**A:** Supabase Dashboard → **Reports**
- Liczba zapytań
- Średni czas odpowiedzi
- Wolne zapytania (slow queries)
- CPU/Memory usage

#### Q: Osiągnąłem limity Free tier, co teraz?
**A:** Limity Free tier:
- 500 MB database storage
- 1 GB file storage
- 5 GB bandwidth/month

Rozwiązania:
1. **Upgrade do Pro** ($25/month)
2. **Optymalizuj**:
   - Usuń stare dane
   - Kompresuj pliki
   - Zmniejsz rozmiar JSONB kolumn

---

### 8. Migracje

#### Q: Jak wykonać migrację SQL?
**A:**
1. **W Dashboard**: SQL Editor → New Query → Paste & Run
2. **Przez CLI**:
   ```bash
   supabase db push
   ```

#### Q: Jak rollback migracji?
**A:**
```bash
# Przywróć backup
supabase db reset

# Lub ręcznie w SQL:
DROP TABLE my_table CASCADE;
```

#### Q: Jak migrować dane z localStorage do Supabase?
**A:**
```typescript
// 1. Pobierz dane z localStorage
const oldAnalyses = JSON.parse(localStorage.getItem('analyses') || '[]')

// 2. Zapisz do Supabase
for (const analysis of oldAnalyses) {
  await analysisService.create(userId, analysis)
}

// 3. Wyczyść localStorage
localStorage.removeItem('analyses')
```

---

### 9. Bezpieczeństwo

#### Q: Czy mogę użyć service_role key w frontend?
**A:** ❌ **NIE!** Service role key omija RLS i daje pełen dostęp do bazy. Używaj TYLKO w:
- Edge Functions
- Backend servers
- Skryptach administracyjnych

W frontend używaj **anon key**.

#### Q: Jak zabezpieczyć Edge Function?
**A:**
```typescript
// Weryfikacja JWT
const authHeader = req.headers.get('Authorization')
if (!authHeader) {
  return new Response('Unauthorized', { status: 401 })
}

// Weryfikacja podpisu (dla webhooków)
const signature = req.headers.get('svix-signature')
// Użyj biblioteki Svix do weryfikacji
```

#### Q: Co zrobić jeśli klucz API wyciekł?
**A:**
1. **Natychmiast** → Supabase Dashboard → Settings → API → **Regenerate** anon key
2. Zaktualizuj `.env.local` w projekcie
3. Zrestartuj aplikację
4. Rozważ rotację service_role key (jeśli też wyciekł)

---

### 10. Backup i Recovery

#### Q: Jak zrobić backup bazy danych?
**A:**
```bash
# Przez CLI
supabase db dump > backup.sql

# Lub przez pg_dump
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql
```

#### Q: Jak przywrócić backup?
**A:**
```bash
# Przez CLI
supabase db reset --from backup.sql

# Lub przez psql
psql -h db.xxxxx.supabase.co -U postgres -d postgres < backup.sql
```

#### Q: Czy Supabase robi automatyczne backupy?
**A:**
- **Free tier**: Tak, codziennie (7 dni retencji)
- **Pro tier**: Tak, codziennie (30 dni retencji) + Point-in-Time Recovery

#### Q: Jak przywrócić bazę do wcześniejszego stanu?
**A:**
**Pro tier only**: Dashboard → Database → Backups → Point-in-Time Recovery

**Free tier**: Musisz przywrócić z backup'u (7 dni wstecz)

---

### 11. Real-time

#### Q: Jak używać Real-time subscriptions?
**A:**
```typescript
// Subscribe do zmian w tabeli
const subscription = supabase
  .channel('analyses-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'analyses' },
    (payload) => {
      console.log('Change received!', payload)
      // Update UI
    }
  )
  .subscribe()

// Unsubscribe
subscription.unsubscribe()
```

#### Q: Real-time nie działa, co robić?
**A:** Sprawdź:
1. Czy Real-time jest włączony w projekcie (Dashboard → Settings → API → Realtime)
2. Czy tabela ma Replica Identity:
   ```sql
   ALTER TABLE analyses REPLICA IDENTITY FULL;
   ```
3. Czy RLS policies pozwalają na SELECT (Real-time wymaga tego)

---

### 12. TypeScript

#### Q: Typy są nieaktualne po zmianie schematu
**A:** Wygeneruj typy ponownie:
```bash
supabase gen types typescript --linked > src/types/supabase.ts
```

#### Q: Błąd: "Property does not exist on type"
**A:** Przykład:
```typescript
// ❌ Zły kod
const analysis = data[0]
analysis.name  // Błąd: property 'name' nie istnieje

// ✅ Dobry kod
const analysis = data[0] as Database['public']['Tables']['analyses']['Row']
analysis.name  // OK
```

---

### 13. Debugowanie

#### Q: Jak debugować zapytania SQL?
**A:**
1. Włącz logi w Supabase client:
   ```typescript
   const supabase = createClient(url, key, {
     db: { schema: 'public' },
     global: { fetch: (...args) => {
       console.log('Supabase fetch:', args)
       return fetch(...args)
     }}
   })
   ```

2. Sprawdź logi w Dashboard → Logs → Postgres Logs

#### Q: Jak zobaczyć wygenerowane SQL?
**A:** W przeglądarce → Network tab → Filtruj: `supabase.co` → Sprawdź payload

#### Q: Error: "Cannot read property of undefined"
**A:** Najprawdopodobniej zapytanie zwróciło `null` zamiast obiektu. Zawsze sprawdzaj:
```typescript
const { data, error } = await supabase
  .from('analyses')
  .select('*')
  .eq('id', id)
  .single()

if (error) throw error
if (!data) throw new Error('Analysis not found')

// Teraz możesz bezpiecznie użyć data
console.log(data.name)
```

---

### 14. Deployment

#### Q: Jak zadeploy aplikację na Vercel?
**A:**
1. Dodaj zmienne środowiskowe w Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_CLERK_PUBLISHABLE_KEY`

2. Deploy:
   ```bash
   git push origin main
   # Vercel auto-deploy
   ```

#### Q: Czy potrzebuję osobnego projektu Supabase dla produkcji?
**A:** Zalecane:
- **Development**: Jeden projekt Supabase
- **Production**: Osobny projekt Supabase

Dlaczego? Izolacja danych, testy, różne konfiguracje.

---

### 15. Koszty

#### Q: Ile kosztuje Supabase?
**A:**
- **Free tier**: $0/miesiąc
  - 500 MB database
  - 1 GB storage
  - 5 GB bandwidth
  - Unlimited API requests

- **Pro tier**: $25/miesiąc
  - 8 GB database
  - 100 GB storage
  - 250 GB bandwidth
  - Daily backups (30 dni)
  - Point-in-Time Recovery

#### Q: Co się stanie jak przekroczę limity Free tier?
**A:** Supabase **nie wyłączy** projektu automatycznie, ale:
- Wydajność może spaść
- Otrzymasz email z prośbą o upgrade

Zalecane: **Monitoruj usage** w Dashboard → Settings → Usage

---

## Troubleshooting - Najczęstsze problemy

### Problem 1: "No rows returned" po zalogowaniu

**Objawy**: Po zalogowaniu nie widzę swoich analiz, ale wiem że istnieją

**Przyczyna**: RLS blokuje dostęp lub użytkownik nie jest zsynchronizowany

**Rozwiązanie**:
```typescript
// 1. Sprawdź czy użytkownik istnieje w Supabase
const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('clerk_user_id', clerkUser.id)
  .single()

console.log('Supabase user:', user)

// 2. Jeśli nie istnieje, synchronizuj ręcznie
if (!user) {
  await supabase.from('users').insert({
    clerk_user_id: clerkUser.id,
    email: clerkUser.emailAddresses[0].emailAddress,
    full_name: `${clerkUser.firstName} ${clerkUser.lastName}`
  })
}

// 3. Sprawdź polityki RLS
// Dashboard → Database → Tables → analyses → Policies
```

### Problem 2: Edge Function nie działa

**Objawy**: Webhook z Clerk nie synchronizuje użytkowników

**Przyczyna**: Błąd w funkcji lub brak secrets

**Rozwiązanie**:
```bash
# 1. Sprawdź logi
supabase functions logs clerk-webhook

# 2. Sprawdź czy secrets są ustawione
supabase secrets list

# 3. Ustaw secrets jeśli brakuje
supabase secrets set CLERK_WEBHOOK_SECRET=whsec_xxxxx
supabase secrets set SUPABASE_URL=https://xxxxx.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# 4. Redeploy
supabase functions deploy clerk-webhook

# 5. Testuj ręcznie
curl -X POST https://xxxxx.supabase.co/functions/v1/clerk-webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"user.created","data":{"id":"test","email":"test@test.com"}}'
```

### Problem 3: Wolne zapytania

**Objawy**: Ładowanie danych trwa > 2 sekundy

**Przyczyna**: Brak indeksów lub duża ilość danych w JSONB

**Rozwiązanie**:
```sql
-- 1. Sprawdź wolne zapytania
-- Dashboard → Reports → Slow Queries

-- 2. Dodaj brakujące indeksy
CREATE INDEX idx_analyses_user_created ON analyses(user_id, created_at DESC);

-- 3. Użyj EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT * FROM analyses WHERE user_id = 'xxx';

-- 4. Ogranicz SELECT
-- Zamiast: select('*')
-- Użyj: select('id, name, created_at')
```

### Problem 4: Storage quota exceeded

**Objawy**: Nie mogę uploadować plików

**Przyczyna**: Przekroczono limit 1 GB (Free tier)

**Rozwiązanie**:
```bash
# 1. Sprawdź użycie Storage
# Dashboard → Storage → Usage

# 2. Opcja A: Usuń stare pliki
const { data: oldFiles } = await supabase.storage
  .from('analysis-files')
  .list()

// Usuń pliki starsze niż 90 dni
for (const file of oldFiles) {
  if (isOlderThan90Days(file.created_at)) {
    await supabase.storage
      .from('analysis-files')
      .remove([file.name])
  }
}

# 3. Opcja B: Upgrade do Pro tier ($25/month)
```

---

## Dodatkowe zasoby

### Dokumentacja
- 📖 **Supabase Docs**: https://supabase.com/docs
- 📖 **PostgreSQL Docs**: https://www.postgresql.org/docs/
- 📖 **Clerk Docs**: https://clerk.com/docs

### Społeczność
- 💬 **Discord Supabase**: https://discord.supabase.com
- 💬 **Discord Clerk**: https://discord.com/invite/clerk
- 🐦 **Twitter**: @supabase, @ClerkDev

### Narzędzia
- 🛠️ **Supabase CLI**: https://github.com/supabase/cli
- 🛠️ **pgAdmin**: https://www.pgadmin.org (GUI dla PostgreSQL)
- 🛠️ **Postico**: https://eggerapps.at/postico/ (macOS)

### Kursy i tutoriale
- 🎓 **Supabase YouTube**: https://youtube.com/@Supabase
- 🎓 **Fireship Supabase Tutorial**: https://www.youtube.com/watch?v=7uKQBl9uZ00
- 🎓 **Official Supabase Tutorial**: https://supabase.com/docs/guides/getting-started

---

**Nie znalazłeś odpowiedzi?**
- 🐛 Zgłoś issue: https://github.com/supabase/supabase/issues
- 💬 Zadaj pytanie na Discord: https://discord.supabase.com
- 📧 Skontaktuj się z supportem: support@supabase.com



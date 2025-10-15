// Alternatywny sposób czyszczenia przez Node.js
// Uruchom: node clean-database.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qccbhzvgcelapbbyqzft.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjY2JoenZnY2VsYXBiYnlxemZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjg1NDAsImV4cCI6MjA3NTc0NDU0MH0.ifHb1nvcqHYyyXei_mCh2JVaPiTTruhw2ajVUX1W_rA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function cleanDatabase() {
  console.log('🗑️  Czyszczenie bazy danych...\n')

  try {
    // Sprawdź ile jest rekordów PRZED
    const { count: usersBefore } = await supabase.from('users').select('*', { count: 'exact', head: true })
    const { count: analysesBefore } = await supabase.from('analyses').select('*', { count: 'exact', head: true })
    
    console.log('📊 PRZED:')
    console.log(`  - Użytkownicy: ${usersBefore}`)
    console.log(`  - Analizy: ${analysesBefore}\n`)

    // Usuń dane (kolejność ważna!)
    console.log('🔄 Usuwanie...')
    
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('  ✓ Produkty usunięte')
    
    await supabase.from('analysis_files').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('  ✓ Pliki usunięte')
    
    await supabase.from('analyses').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('  ✓ Analizy usunięte')
    
    await supabase.from('rules').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('  ✓ Reguły usunięte')
    
    await supabase.from('user_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('  ✓ Ustawienia usunięte')
    
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('  ✓ Użytkownicy usunięci\n')

    // Sprawdź ile jest POTEM
    const { count: usersAfter } = await supabase.from('users').select('*', { count: 'exact', head: true })
    const { count: analysesAfter } = await supabase.from('analyses').select('*', { count: 'exact', head: true })
    
    console.log('📊 PO:')
    console.log(`  - Użytkownicy: ${usersAfter}`)
    console.log(`  - Analizy: ${analysesAfter}\n`)

    console.log('✅ Gotowe!')
    console.log('\n💡 Następne kroki:')
    console.log('  1. Uruchom CREATE_PRODUCTS_TABLE.sql w Supabase (jeśli nie ma tabeli)')
    console.log('  2. Zrestartuj aplikację: npm run dev')
    console.log('  3. Zaloguj się ponownie')

  } catch (error) {
    console.error('❌ Błąd:', error.message)
  }
}

cleanDatabase()







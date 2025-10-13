// Funkcje testowe dla Supabase - dostępne w konsoli przeglądarki
import { supabaseAnalysisService } from '../services/supabaseAnalysisService'
import { supabaseRulesService } from '../services/supabaseRulesService'

// Generuj prawdziwy UUID dla testów (ten sam w całym teście)
const TEST_USER_ID = crypto.randomUUID()

// Funkcja pomocnicza - utwórz użytkownika testowego i zwróć jego ID
async function ensureTestUser(): Promise<string> {
  try {
    // Używamy prostszego podejścia - sprawdźmy czy istnieje jakikolwiek użytkownik
    const { data: users, error: checkError } = await supabaseAnalysisService.supabase
      .from('users')
      .select('id, clerk_user_id')
      .limit(1)

    if (checkError) {
      throw checkError
    }

    // Jeśli istnieją użytkownicy, użyj pierwszego
    if (users && users.length > 0) {
      console.log('✅ Używam istniejącego użytkownika:', users[0].id)
      return users[0].id
    }

    // Jeśli nie ma użytkowników, utwórz nowego
    const { data: newUser, error: insertError } = await supabaseAnalysisService.supabase
      .from('users')
      .insert({
        clerk_user_id: TEST_USER_ID,
        email: `test-${TEST_USER_ID}@example.com`,
        full_name: 'Test User',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (insertError) {
      throw insertError
    }

    console.log('✅ Utworzono użytkownika testowego:', TEST_USER_ID, 'ID:', newUser.id)
    return newUser.id
  } catch (error) {
    console.error('❌ Błąd tworzenia użytkownika testowego:', error)
    throw error
  }
}

// Funkcja testowa - tworzenie analizy
export async function testCreateAnalysis() {
  console.log('🧪 Test: Tworzenie analizy...')
  try {
    // Najpierw upewnij się, że użytkownik istnieje i pobierz jego prawdziwy ID
    const userId = await ensureTestUser()
    
    const analysis = await supabaseAnalysisService.createAnalysis({
      name: 'Test Analysis ' + new Date().toLocaleTimeString(),
      description: 'Analiza testowa utworzona przez funkcję testową',
      type: 'file_upload',
      status: 'pending',
      files: [],
      products: [],
      totalProducts: 0,
      validProducts: 0,
      invalidProducts: 0,
      evaluations: [],
      averageScore: 0,
      stats: {
        totalProducts: 0,
        validProducts: 0,
        invalidProducts: 0,
        averageScore: 0,
        blockedProducts: 0,
        warningProducts: 0,
        okProducts: 0,
        categoryStats: {},
        priceStats: {
          min: 0,
          max: 0,
          average: 0,
          median: 0,
          total: 0
        },
        rulesStats: {
          totalRules: 0,
          activeRules: 0,
          appliedRules: 0,
          mostViolatedRule: undefined
        },
        processingTime: 0,
        filesProcessed: 0
      },
      metadata: {
        version: '1.0.0',
        rulesVersion: '1.0.0',
        parserVersion: '1.0.0',
        tags: [],
        notes: ''
      }
    }, userId)
    console.log('✅ Analiza utworzona:', analysis)
    return analysis
  } catch (error) {
    console.error('❌ Błąd tworzenia analizy:', error)
    throw error
  }
}

// Funkcja testowa - pobieranie analiz
export async function testGetAnalyses() {
  console.log('🧪 Test: Pobieranie analiz...')
  try {
    // Najpierw upewnij się, że użytkownik istnieje i pobierz jego prawdziwy ID
    const userId = await ensureTestUser()
    const analyses = await supabaseAnalysisService.getAnalyses(userId)
    console.log('✅ Pobrano analiz:', analyses.length)
    console.table(analyses.map(a => ({
      id: a.id.substring(0, 8) + '...',
      name: a.name,
      status: a.status,
      products: a.totalProducts
    })))
    return analyses
  } catch (error) {
    console.error('❌ Błąd pobierania analiz:', error)
    throw error
  }
}

// Funkcja testowa - aktualizacja analizy
export async function testUpdateAnalysis(analysisId?: string) {
  console.log('🧪 Test: Aktualizacja analizy...')
  try {
    // Jeśli nie podano ID, pobierz pierwszą analizę
    if (!analysisId) {
      // Najpierw upewnij się, że użytkownik istnieje i pobierz jego prawdziwy ID
      const userId = await ensureTestUser()
      const analyses = await supabaseAnalysisService.getAnalyses(userId)
      const firstAnalysis = analyses[0]
      if (!firstAnalysis) {
        console.log('⚠️ Brak analiz do zaktualizowania. Utwórz najpierw analizę.')
        return null
      }
      analysisId = firstAnalysis.id
    }
    
    // Najpierw upewnij się, że użytkownik istnieje i pobierz jego prawdziwy ID
    const userId = await ensureTestUser()
    await supabaseAnalysisService.updateAnalysis(analysisId, {
      status: 'in_progress',
      totalProducts: 5,
      validProducts: 5,
      invalidProducts: 0
    }, userId)
    console.log('✅ Analiza zaktualizowana:', analysisId)
    return analysisId
  } catch (error) {
    console.error('❌ Błąd aktualizacji analizy:', error)
    throw error
  }
}

// Funkcja testowa - usuwanie analizy
export async function testDeleteAnalysis(analysisId?: string) {
  console.log('🧪 Test: Usuwanie analizy...')
  try {
    // Jeśli nie podano ID, pobierz ostatnią analizę
    if (!analysisId) {
      // Najpierw upewnij się, że użytkownik istnieje i pobierz jego prawdziwy ID
      const userId = await ensureTestUser()
      const analyses = await supabaseAnalysisService.getAnalyses(userId)
      const lastAnalysis = analyses[analyses.length - 1]
      if (!lastAnalysis) {
        console.log('⚠️ Brak analiz do usunięcia.')
        return null
      }
      analysisId = lastAnalysis.id
    }
    
    // Najpierw upewnij się, że użytkownik istnieje i pobierz jego prawdziwy ID
    const userId = await ensureTestUser()
    await supabaseAnalysisService.deleteAnalysis(analysisId, userId)
    console.log('✅ Analiza usunięta:', analysisId)
    return analysisId
  } catch (error) {
    console.error('❌ Błąd usuwania analizy:', error)
    throw error
  }
}

// Funkcja testowa - tworzenie reguły
export async function testCreateRule() {
  console.log('🧪 Test: Tworzenie reguły...')
  try {
    // Najpierw upewnij się, że użytkownik istnieje i pobierz jego prawdziwy ID
    const userId = await ensureTestUser()
    
    const rule = await supabaseRulesService.createRule({
      name: 'Test Rule ' + new Date().toLocaleTimeString(),
      description: 'Reguła testowa',
      type: 'budget',
      action: 'warn',
      weight: 5,
      status: 'active',
      conditions: {
        maxPrice: 1000,
        currency: 'PLN'
      }
    }, userId)
    console.log('✅ Reguła utworzona:', rule)
    return rule
  } catch (error) {
    console.error('❌ Błąd tworzenia reguły:', error)
    throw error
  }
}

// Funkcja testowa - pobieranie reguł
export async function testGetRules() {
  console.log('🧪 Test: Pobieranie reguł...')
  try {
    // Najpierw upewnij się, że użytkownik istnieje i pobierz jego prawdziwy ID
    const userId = await ensureTestUser()
    const rules = await supabaseRulesService.getRules(userId)
    console.log('✅ Pobrano reguł:', rules.length)
    console.table(rules.map(r => ({
      id: r.id.substring(0, 8) + '...',
      name: r.name,
      type: r.type,
      action: r.action,
      status: r.status
    })))
    return rules
  } catch (error) {
    console.error('❌ Błąd pobierania reguł:', error)
    throw error
  }
}

// Funkcja testowa - pobieranie szablonów reguł
export async function testGetTemplates() {
  console.log('🧪 Test: Pobieranie szablonów reguł...')
  try {
    const templates = await supabaseRulesService.getRuleTemplates()
    console.log('✅ Pobrano szablonów:', templates.length)
    console.table(templates.map(t => ({
      id: t.id,
      name: t.name,
      type: t.type,
      action: t.action
    })))
    return templates
  } catch (error) {
    console.error('❌ Błąd pobierania szablonów:', error)
    throw error
  }
}

// Funkcja testowa - pełny test przepływu
export async function testFullFlow() {
  console.log('🧪 ============================================')
  console.log('🧪 TEST PEŁNEGO PRZEPŁYWU SUPABASE')
  console.log('🧪 ============================================')
  
  try {
    // 1. Utwórz analizę
    console.log('\n📊 1. Tworzenie analizy...')
    const analysis = await testCreateAnalysis()
    
    // 2. Pobierz wszystkie analizy
    console.log('\n📊 2. Pobieranie wszystkich analiz...')
    await testGetAnalyses()
    
    // 3. Zaktualizuj analizę
    console.log('\n📊 3. Aktualizacja analizy...')
    await testUpdateAnalysis(analysis.id)
    
    // 4. Utwórz regułę
    console.log('\n📋 4. Tworzenie reguły...')
    await testCreateRule()
    
    // 5. Pobierz wszystkie reguły
    console.log('\n📋 5. Pobieranie wszystkich reguł...')
    await testGetRules()
    
    // 6. Pobierz szablony
    console.log('\n📋 6. Pobieranie szablonów reguł...')
    await testGetTemplates()
    
    // 7. Usuń analizę
    console.log('\n📊 7. Usuwanie analizy...')
    await testDeleteAnalysis(analysis.id)
    
    console.log('\n🎉 ============================================')
    console.log('🎉 WSZYSTKIE TESTY PRZESZŁY POMYŚLNIE!')
    console.log('🎉 ============================================')
    
    return {
      success: true,
      message: 'Integracja Supabase działa poprawnie!'
    }
  } catch (error) {
    console.error('\n❌ ============================================')
    console.error('❌ TEST ZAKOŃCZONY BŁĘDEM')
    console.error('❌ ============================================')
    console.error(error)
    throw error
  }
}

// Eksportuj funkcje do window w trybie deweloperskim
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).testSupabase = {
    createAnalysis: testCreateAnalysis,
    getAnalyses: testGetAnalyses,
    updateAnalysis: testUpdateAnalysis,
    deleteAnalysis: testDeleteAnalysis,
    createRule: testCreateRule,
    getRules: testGetRules,
    getTemplates: testGetTemplates,
    fullFlow: testFullFlow
  }
  
  console.log(`
🔧 ============================================
🔧 FUNKCJE TESTOWE SUPABASE DOSTĘPNE!
🔧 ============================================

Dostępne testy w konsoli:

📊 TESTY ANALIZ:
  testSupabase.createAnalysis()  - Utwórz nową analizę
  testSupabase.getAnalyses()     - Pobierz wszystkie analizy
  testSupabase.updateAnalysis()  - Zaktualizuj analizę
  testSupabase.deleteAnalysis()  - Usuń analizę

📋 TESTY REGUŁ:
  testSupabase.createRule()      - Utwórz nową regułę
  testSupabase.getRules()        - Pobierz wszystkie reguły
  testSupabase.getTemplates()    - Pobierz szablony reguł

🎯 TEST PEŁNY:
  testSupabase.fullFlow()        - Wykonaj wszystkie testy

Przykład użycia:
  await testSupabase.fullFlow()
  
🔧 ============================================
  `)
}

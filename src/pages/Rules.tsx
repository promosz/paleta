import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, Button } from '../components/ui'
import { RuleForm } from '../components/forms'
import { RulesList, RuleTemplates } from '../components/rules'
import { useRulesStore } from '../stores/rulesStoreSupabase'
import { useCurrentUser } from '../hooks/useCurrentUser'
import type { Rule } from '../types/rules'

const Rules: React.FC = () => {
  const { supabaseUserId, loading: userLoading } = useCurrentUser()
  const { 
    rules, 
    templates, 
    stats, 
    addRule, 
    updateRule, 
    deleteRule,
    clearAllRules,
    loadRules,
    loadTemplates
  } = useRulesStore()
  
  const [showForm, setShowForm] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)

  // Ładowanie reguł i szablonów z Supabase przy starcie
  useEffect(() => {
    if (supabaseUserId && !userLoading) {
      console.log('Rules: Ładowanie reguł dla użytkownika:', supabaseUserId)
      loadRules(supabaseUserId)
      loadTemplates()
    }
  }, [supabaseUserId, userLoading, loadRules, loadTemplates])

  // Obsługa zapisywania reguły
  const handleSaveRule = (rule: Rule) => {
    if (!supabaseUserId) return
    
    if (editingRule) {
      updateRule(editingRule.id, rule, supabaseUserId)
    } else {
      addRule(rule, supabaseUserId)
    }
    setShowForm(false)
    setEditingRule(null)
  }

  // Obsługa anulowania formularza
  const handleCancelForm = () => {
    setShowForm(false)
    setEditingRule(null)
  }

  // Obsługa edycji reguły
  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule)
    setShowForm(true)
  }

  // Obsługa usuwania reguły
  const handleDeleteRule = (rule: Rule) => {
    if (!supabaseUserId) return
    
    if (window.confirm(`Czy na pewno chcesz usunąć regułę "${rule.name}"?`)) {
      deleteRule(rule.id, supabaseUserId)
    }
  }

  // Obsługa wyboru szablonu
  const handleSelectTemplate = () => {
    setShowTemplates(false)
    setShowForm(true)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Reguły
        </h1>
        <p className="text-neutral-600">
          Zarządzaj regułami analizy produktów
        </p>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">{stats.totalRules}</div>
              <div className="text-sm text-neutral-600">Wszystkie reguły</div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-success-500 mb-2">{stats.activeRules}</div>
              <div className="text-sm text-neutral-600">Aktywne</div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning-500 mb-2">{stats.inactiveRules}</div>
              <div className="text-sm text-neutral-600">Nieaktywne</div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-neutral-500 mb-2">{stats.averageWeight}</div>
              <div className="text-sm text-neutral-600">Średnia waga</div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Formularz reguły */}
      {showForm && (
        <div className="mb-8">
          <RuleForm
            rule={editingRule || undefined}
            onSave={handleSaveRule}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Szablony reguł */}
      {showTemplates && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-neutral-800">
                  Szablony reguł
                </h2>
                <Button
                  variant="secondary"
                  onClick={() => setShowTemplates(false)}
                >
                  Zamknij
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <RuleTemplates
                templates={templates}
                onSelectTemplate={handleSelectTemplate}
              />
            </CardBody>
          </Card>
        </div>
      )}

      {/* Akcje */}
      {!showForm && !showTemplates && (
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-800">
              Zarządzanie regułami
            </h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                onClick={() => setShowForm(true)}
              >
                ➕ Dodaj nową regułę
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => setShowTemplates(true)}
              >
                📋 Użyj szablonu
              </Button>
              
              {rules.length > 0 && (
                <Button
                  variant="danger"
                  onClick={() => {
                    if (window.confirm('Czy na pewno chcesz usunąć wszystkie reguły?')) {
                      clearAllRules()
                    }
                  }}
                >
                  🗑️ Usuń wszystkie
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Lista reguł */}
      {!showForm && !showTemplates && (
        <RulesList
          rules={rules}
          onEdit={handleEditRule}
          onDelete={handleDeleteRule}
        />
      )}
    </div>
  )
}

export default Rules

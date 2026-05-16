import React, { useState, useEffect, useCallback } from 'react'
import DDTForm from './components/DDTForm'
import SettingsModal from './components/SettingsModal'
import { previewDDT, downloadDDT } from './utils/pdfGenerator'
import {
  saveDDTData,
  loadDDTData,
  getNextDDTNumber,
  getCurrentDDTNumber,
  loadCompanySettings,
  clearDDTData,
} from './utils/storage'
import { emptyArticolo } from './components/ArticoliTable'

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

function buildDefaultForm(numero, companySettings) {
  const cs = companySettings || {}
  return {
    numeroDDT: numero,
    data: todayISO(),
    // Mittente
    mittenteRagioneSociale: cs.ragioneSociale || '',
    mittenteIndirizzo: cs.indirizzo || '',
    mittenteCAP: cs.cap || '',
    mittenteCitta: cs.citta || '',
    mittenteProvincia: cs.provincia || '',
    mittentePIVA: cs.piva || '',
    // Destinatario
    destinatarioRagioneSociale: '',
    destinatarioIndirizzo: '',
    destinatarioCAP: '',
    destinatarioCitta: '',
    destinatarioProvincia: '',
    destinatarioPIVA: '',
    destinatarioLuogoConsegna: '',
    // Vettore
    vettoreNome: '',
    vettoreTarga: '',
    // Trasporto
    causale: 'Vendita',
    aspetto: 'Cartoni',
    numeroColli: '',
    pesoLordo: '',
    porto: 'Franco',
    dataInizioTrasporto: '',
    // Articoli
    articoli: [emptyArticolo()],
    // Note
    note: '',
  }
}

export default function App() {
  const [formData, setFormData] = useState(null)
  const [showPrezzo, setShowPrezzo] = useState(false)
  const [showIVA, setShowIVA] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // 'saved' | 'error'
  const [notification, setNotification] = useState(null)

  // Load on mount
  useEffect(() => {
    const saved = loadDDTData()
    if (saved) {
      setFormData(saved.formData)
      setShowPrezzo(saved.showPrezzo || false)
      setShowIVA(saved.showIVA || false)
    } else {
      const cs = loadCompanySettings()
      const numero = getCurrentDDTNumber() || getNextDDTNumber()
      setFormData(buildDefaultForm(numero, cs))
    }
  }, [])

  // Auto-save with debounce
  useEffect(() => {
    if (!formData) return
    const timer = setTimeout(() => {
      saveDDTData({ formData, showPrezzo, showIVA })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(null), 2000)
    }, 800)
    return () => clearTimeout(timer)
  }, [formData, showPrezzo, showIVA])

  function showNotification(msg, type = 'success') {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3000)
  }

  function handleNewDDT() {
    if (!window.confirm('Creare un nuovo DDT? Il modulo corrente verrà svuotato.')) return
    const cs = loadCompanySettings()
    const numero = getNextDDTNumber()
    clearDDTData()
    setFormData(buildDefaultForm(numero, cs))
    setShowPrezzo(false)
    setShowIVA(false)
    showNotification(`Nuovo DDT n° ${String(numero).padStart(4, '0')} creato`)
  }

  function handlePreview() {
    if (!formData) return
    try {
      previewDDT(formData, { showPrezzo, showIVA })
    } catch (e) {
      console.error(e)
      showNotification('Errore nella generazione del PDF', 'error')
    }
  }

  function handleDownload() {
    if (!formData) return
    try {
      downloadDDT(formData, { showPrezzo, showIVA })
      showNotification('PDF scaricato con successo')
    } catch (e) {
      console.error(e)
      showNotification('Errore nel download del PDF', 'error')
    }
  }

  function handleSettingsSave(settings) {
    if (!formData) return
    setFormData(prev => ({
      ...prev,
      mittenteRagioneSociale: settings.ragioneSociale,
      mittenteIndirizzo: settings.indirizzo,
      mittenteCAP: settings.cap,
      mittenteCitta: settings.citta,
      mittenteProvincia: settings.provincia,
      mittentePIVA: settings.piva,
    }))
    showNotification('Impostazioni azienda salvate')
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-sm font-medium">Caricamento...</span>
        </div>
      </div>
    )
  }

  const ddtNumeroFormatted = String(formData.numeroDDT || 1).padStart(4, '0')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── TOPBAR ──────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 leading-tight">DDT Generator</h1>
                <p className="text-xs text-gray-400 leading-tight">Documento di Trasporto N° {ddtNumeroFormatted}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Save indicator */}
              {saveStatus === 'saved' && (
                <span className="hidden sm:flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvato
                </span>
              )}

              <button
                onClick={() => setShowSettings(true)}
                className="btn-secondary hidden sm:inline-flex"
                title="Impostazioni azienda"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Impostazioni
              </button>

              <button
                onClick={handleNewDDT}
                className="btn-secondary"
                title="Nuovo DDT"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Nuovo DDT</span>
              </button>

              <button
                onClick={handlePreview}
                className="btn-secondary"
                title="Anteprima PDF"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3-9a9 9 0 100 18A9 9 0 009 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden sm:inline">Anteprima</span>
              </button>

              <button
                onClick={handleDownload}
                className="btn-success"
                title="Scarica PDF"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Scarica PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── NOTIFICATION ─────────────────────────────────────────── */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          notification.type === 'error'
            ? 'bg-red-600 text-white'
            : 'bg-green-600 text-white'
        }`}>
          {notification.type === 'error' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {notification.msg}
        </div>
      )}

      {/* ── MOBILE ACTIONS ───────────────────────────────────────── */}
      <div className="sm:hidden bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => setShowSettings(true)}
          className="text-sm text-gray-500 flex items-center gap-1.5 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Impostazioni azienda
        </button>
        {saveStatus === 'saved' && (
          <span className="text-xs text-green-600 font-medium">Salvato</span>
        )}
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <DDTForm
          formData={formData}
          onChange={setFormData}
          showPrezzo={showPrezzo}
          showIVA={showIVA}
          onTogglePrezzo={setShowPrezzo}
          onToggleIVA={setShowIVA}
        />

        {/* Bottom action bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            I dati vengono salvati automaticamente nel browser
          </div>
          <div className="flex gap-3">
            <button onClick={handlePreview} className="btn-secondary flex-1 sm:flex-none justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3-9a9 9 0 100 18A9 9 0 009 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Anteprima PDF
            </button>
            <button onClick={handleDownload} className="btn-success flex-1 sm:flex-none justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Scarica PDF
            </button>
          </div>
        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="mt-8 pb-6 text-center text-xs text-gray-400">
        DDT Generator &mdash; Generazione PDF locale, nessun dato inviato a server
      </footer>

      {/* Settings modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSave}
        />
      )}
    </div>
  )
}

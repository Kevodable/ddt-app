import React, { useState, useEffect } from 'react'
import { loadCompanySettings, saveCompanySettings } from '../utils/storage'

const defaultSettings = {
  ragioneSociale: '',
  indirizzo: '',
  cap: '',
  citta: '',
  provincia: '',
  piva: '',
}

export default function SettingsModal({ onClose, onSave }) {
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    const saved = loadCompanySettings()
    if (saved) setSettings(saved)
  }, [])

  function handleChange(field, value) {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    saveCompanySettings(settings)
    onSave(settings)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Impostazioni azienda</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-500">
            Queste informazioni verranno precompilate nel campo "Mittente" per ogni nuovo DDT.
          </p>

          <div>
            <label className="form-label">Ragione Sociale</label>
            <input
              type="text"
              value={settings.ragioneSociale}
              onChange={e => handleChange('ragioneSociale', e.target.value)}
              className="form-input"
              placeholder="Mario Rossi S.r.l."
            />
          </div>

          <div>
            <label className="form-label">Indirizzo</label>
            <input
              type="text"
              value={settings.indirizzo}
              onChange={e => handleChange('indirizzo', e.target.value)}
              className="form-input"
              placeholder="Via Roma, 1"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="form-label">CAP</label>
              <input
                type="text"
                value={settings.cap}
                onChange={e => handleChange('cap', e.target.value)}
                className="form-input"
                placeholder="20100"
                maxLength={5}
              />
            </div>
            <div className="col-span-1">
              <label className="form-label">Città</label>
              <input
                type="text"
                value={settings.citta}
                onChange={e => handleChange('citta', e.target.value)}
                className="form-input"
                placeholder="Milano"
              />
            </div>
            <div>
              <label className="form-label">Prov.</label>
              <input
                type="text"
                value={settings.provincia}
                onChange={e => handleChange('provincia', e.target.value.toUpperCase())}
                className="form-input"
                placeholder="MI"
                maxLength={2}
              />
            </div>
          </div>

          <div>
            <label className="form-label">P.IVA / Codice Fiscale</label>
            <input
              type="text"
              value={settings.piva}
              onChange={e => handleChange('piva', e.target.value)}
              className="form-input"
              placeholder="IT12345678901"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="btn-secondary">
            Annulla
          </button>
          <button onClick={handleSave} className="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Salva impostazioni
          </button>
        </div>
      </div>
    </div>
  )
}

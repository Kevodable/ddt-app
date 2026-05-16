import React from 'react'
import ArticoliTable, { emptyArticolo } from './ArticoliTable'


function SectionCard({ title, icon, children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      <div className="section-title flex items-center gap-2">
        {icon && <span className="text-blue-500">{icon}</span>}
        {title}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  )
}

export default function DDTForm({ formData, onChange, showPrezzo, showIVA, onTogglePrezzo, onToggleIVA }) {
  function set(field, value) {
    onChange({ ...formData, [field]: value })
  }

  function setArticoli(articoli) {
    onChange({ ...formData, articoli })
  }

  return (
    <div className="space-y-5">
      {/* ── TESTATA ─────────────────────────────────────────────── */}
      <SectionCard
        title="Testata DDT"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Numero DDT" className="sm:col-span-1">
            <input
              type="number"
              value={formData.numeroDDT}
              onChange={e => set('numeroDDT', e.target.value)}
              className="form-input font-mono font-bold text-blue-700"
              min="1"
            />
          </Field>
          <Field label="Data DDT" className="sm:col-span-1">
            <input
              type="date"
              value={formData.data}
              onChange={e => set('data', e.target.value)}
              className="form-input"
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── MITTENTE / DESTINATARIO ─────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Mittente */}
        <SectionCard
          title="Mittente"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        >
          <div className="space-y-3">
            <Field label="Ragione Sociale">
              <input
                type="text"
                value={formData.mittenteRagioneSociale}
                onChange={e => set('mittenteRagioneSociale', e.target.value)}
                className="form-input"
                placeholder="Nome azienda"
              />
            </Field>
            <Field label="Indirizzo">
              <input
                type="text"
                value={formData.mittenteIndirizzo}
                onChange={e => set('mittenteIndirizzo', e.target.value)}
                className="form-input"
                placeholder="Via Roma, 1"
              />
            </Field>
            <div className="grid grid-cols-5 gap-2">
              <Field label="CAP" className="col-span-1">
                <input
                  type="text"
                  value={formData.mittenteCAP}
                  onChange={e => set('mittenteCAP', e.target.value)}
                  className="form-input"
                  placeholder="20100"
                  maxLength={5}
                />
              </Field>
              <Field label="Città" className="col-span-3">
                <input
                  type="text"
                  value={formData.mittenteCitta}
                  onChange={e => set('mittenteCitta', e.target.value)}
                  className="form-input"
                  placeholder="Milano"
                />
              </Field>
              <Field label="Prov." className="col-span-1">
                <input
                  type="text"
                  value={formData.mittenteProvincia}
                  onChange={e => set('mittenteProvincia', e.target.value.toUpperCase())}
                  className="form-input"
                  placeholder="MI"
                  maxLength={2}
                />
              </Field>
            </div>
            <Field label="P.IVA / C.F.">
              <input
                type="text"
                value={formData.mittentePIVA}
                onChange={e => set('mittentePIVA', e.target.value)}
                className="form-input font-mono"
                placeholder="IT12345678901"
              />
            </Field>
          </div>
        </SectionCard>

        {/* Destinatario */}
        <SectionCard
          title="Destinatario"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        >
          <div className="space-y-3">
            <Field label="Ragione Sociale">
              <input
                type="text"
                value={formData.destinatarioRagioneSociale}
                onChange={e => set('destinatarioRagioneSociale', e.target.value)}
                className="form-input"
                placeholder="Nome azienda destinataria"
              />
            </Field>
            <Field label="Indirizzo">
              <input
                type="text"
                value={formData.destinatarioIndirizzo}
                onChange={e => set('destinatarioIndirizzo', e.target.value)}
                className="form-input"
                placeholder="Via Roma, 1"
              />
            </Field>
            <div className="grid grid-cols-5 gap-2">
              <Field label="CAP" className="col-span-1">
                <input
                  type="text"
                  value={formData.destinatarioCAP}
                  onChange={e => set('destinatarioCAP', e.target.value)}
                  className="form-input"
                  placeholder="20100"
                  maxLength={5}
                />
              </Field>
              <Field label="Città" className="col-span-3">
                <input
                  type="text"
                  value={formData.destinatarioCitta}
                  onChange={e => set('destinatarioCitta', e.target.value)}
                  className="form-input"
                  placeholder="Milano"
                />
              </Field>
              <Field label="Prov." className="col-span-1">
                <input
                  type="text"
                  value={formData.destinatarioProvincia}
                  onChange={e => set('destinatarioProvincia', e.target.value.toUpperCase())}
                  className="form-input"
                  placeholder="MI"
                  maxLength={2}
                />
              </Field>
            </div>
            <Field label="P.IVA / C.F.">
              <input
                type="text"
                value={formData.destinatarioPIVA}
                onChange={e => set('destinatarioPIVA', e.target.value)}
                className="form-input font-mono"
                placeholder="IT12345678901"
              />
            </Field>
            <Field label="Luogo di consegna (se diverso)">
              <input
                type="text"
                value={formData.destinatarioLuogoConsegna}
                onChange={e => set('destinatarioLuogoConsegna', e.target.value)}
                className="form-input"
                placeholder="Es. Magazzino Via Verdi, 5 - Milano"
              />
            </Field>
          </div>
        </SectionCard>
      </div>

      {/* ── VETTORE + DATI TRASPORTO ─────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Vettore */}
        <SectionCard
          title="Vettore"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10M13 16l2-2h4l2 2M13 16H9m4-10l2 5h4l2-5" />
            </svg>
          }
        >
          <div className="space-y-3">
            <Field label="Nome / Ragione Sociale">
              <input
                type="text"
                value={formData.vettoreNome}
                onChange={e => set('vettoreNome', e.target.value)}
                className="form-input"
                placeholder="Trasporti Bianchi S.r.l."
              />
            </Field>
            <Field label="Targa veicolo">
              <input
                type="text"
                value={formData.vettoreTarga}
                onChange={e => set('vettoreTarga', e.target.value.toUpperCase())}
                className="form-input font-mono tracking-wider"
                placeholder="AA000BB"
              />
            </Field>
          </div>
        </SectionCard>

        {/* Dati trasporto */}
        <SectionCard
          title="Dati trasporto"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Causale trasporto">
                <input
                  type="text"
                  value={formData.causale}
                  onChange={e => set('causale', e.target.value)}
                  className="form-input"
                  placeholder="Es. Vendita, Reso, Omaggio..."
                />
              </Field>
              <Field label="Aspetto esteriore beni">
                <input
                  type="text"
                  value={formData.aspetto}
                  onChange={e => set('aspetto', e.target.value)}
                  className="form-input"
                  placeholder="Es. Cartoni, Bancali, Colli..."
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Numero colli">
                <input
                  type="number"
                  value={formData.numeroColli}
                  onChange={e => set('numeroColli', e.target.value)}
                  className="form-input"
                  placeholder="0"
                  min="0"
                />
              </Field>
              <Field label="Peso lordo (kg)">
                <input
                  type="number"
                  value={formData.pesoLordo}
                  onChange={e => set('pesoLordo', e.target.value)}
                  className="form-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </Field>
            </div>
            <Field label="Porto">
              <div className="flex gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="porto"
                    value="Franco"
                    checked={formData.porto === 'Franco'}
                    onChange={e => set('porto', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 font-medium">Franco</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="porto"
                    value="Assegnato"
                    checked={formData.porto === 'Assegnato'}
                    onChange={e => set('porto', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 font-medium">Assegnato</span>
                </label>
              </div>
            </Field>
            <Field label="Data e ora inizio trasporto">
              <input
                type="datetime-local"
                value={formData.dataInizioTrasporto}
                onChange={e => set('dataInizioTrasporto', e.target.value)}
                className="form-input"
              />
            </Field>
          </div>
        </SectionCard>
      </div>

      {/* ── ARTICOLI ─────────────────────────────────────────────── */}
      <SectionCard
        title="Articoli"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        }
      >
        <ArticoliTable
          articoli={formData.articoli}
          onChange={setArticoli}
          showPrezzo={showPrezzo}
          showIVA={showIVA}
          onTogglePrezzo={onTogglePrezzo}
          onToggleIVA={onToggleIVA}
        />
      </SectionCard>

      {/* ── NOTE ─────────────────────────────────────────────────── */}
      <SectionCard
        title="Note"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        }
      >
        <textarea
          value={formData.note}
          onChange={e => set('note', e.target.value)}
          className="form-input resize-none h-24"
          placeholder="Note aggiuntive per il trasporto..."
        />
      </SectionCard>
    </div>
  )
}

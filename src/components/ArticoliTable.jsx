import React from 'react'

const UM_OPTIONS = ['PZ', 'KG', 'MT', 'LT', 'SC', 'CF']

const emptyArticolo = () => ({
  id: crypto.randomUUID(),
  codice: '',
  descrizione: '',
  quantita: '',
  um: 'PZ',
  prezzoUnitario: '',
  iva: '',
})

export default function ArticoliTable({ articoli, onChange, showPrezzo, showIVA, onTogglePrezzo, onToggleIVA }) {
  function updateArticolo(id, field, value) {
    onChange(articoli.map(a => a.id === id ? { ...a, [field]: value } : a))
  }

  function addRow() {
    onChange([...articoli, emptyArticolo()])
  }

  function removeRow(id) {
    if (articoli.length === 1) return
    onChange(articoli.filter(a => a.id !== id))
  }

  function calcImporto(art) {
    const q = parseFloat(art.quantita)
    const p = parseFloat(art.prezzoUnitario)
    if (!isNaN(q) && !isNaN(p) && q > 0 && p > 0) {
      return (q * p).toFixed(2)
    }
    return ''
  }

  const colSpan = 5 + (showPrezzo ? 2 : 0) + (showIVA ? 1 : 0)

  return (
    <div>
      {/* Options row */}
      <div className="flex items-center gap-6 mb-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showPrezzo}
            onChange={e => onTogglePrezzo(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600 font-medium">Mostra prezzi</span>
        </label>
        {showPrezzo && (
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showIVA}
              onChange={e => onToggleIVA(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 font-medium">Mostra IVA</span>
          </label>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="px-3 py-2.5 text-center w-10 font-semibold text-xs">N°</th>
              <th className="px-3 py-2.5 text-left w-28 font-semibold text-xs">Codice</th>
              <th className="px-3 py-2.5 text-left font-semibold text-xs">Descrizione</th>
              <th className="px-3 py-2.5 text-center w-20 font-semibold text-xs">Q.tà</th>
              <th className="px-3 py-2.5 text-center w-20 font-semibold text-xs">U.M.</th>
              {showPrezzo && (
                <th className="px-3 py-2.5 text-right w-28 font-semibold text-xs">Prezzo (€)</th>
              )}
              {showPrezzo && showIVA && (
                <th className="px-3 py-2.5 text-center w-20 font-semibold text-xs">IVA %</th>
              )}
              {showPrezzo && (
                <th className="px-3 py-2.5 text-right w-28 font-semibold text-xs">Importo (€)</th>
              )}
              <th className="px-2 py-2.5 text-center w-10 font-semibold text-xs"></th>
            </tr>
          </thead>
          <tbody>
            {articoli.map((art, idx) => (
              <tr
                key={art.id}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
              >
                <td className="px-3 py-1.5 text-center text-gray-500 font-medium text-xs">{idx + 1}</td>
                <td className="px-2 py-1.5">
                  <input
                    type="text"
                    value={art.codice}
                    onChange={e => updateArticolo(art.id, 'codice', e.target.value)}
                    className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Codice"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="text"
                    value={art.descrizione}
                    onChange={e => updateArticolo(art.id, 'descrizione', e.target.value)}
                    className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descrizione articolo"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="number"
                    value={art.quantita}
                    onChange={e => updateArticolo(art.id, 'quantita', e.target.value)}
                    className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="any"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <select
                    value={art.um}
                    onChange={e => updateArticolo(art.id, 'um', e.target.value)}
                    className="w-full border border-gray-200 rounded px-1 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    {UM_OPTIONS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </td>
                {showPrezzo && (
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={art.prezzoUnitario}
                      onChange={e => updateArticolo(art.id, 'prezzoUnitario', e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-right focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </td>
                )}
                {showPrezzo && showIVA && (
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={art.iva}
                      onChange={e => updateArticolo(art.id, 'iva', e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="22"
                      min="0"
                      max="100"
                    />
                  </td>
                )}
                {showPrezzo && (
                  <td className="px-2 py-1.5 text-right">
                    <span className="text-xs font-semibold text-blue-700">
                      {calcImporto(art) ? `${calcImporto(art)} €` : ''}
                    </span>
                  </td>
                )}
                <td className="px-2 py-1.5 text-center">
                  <button
                    onClick={() => removeRow(art.id)}
                    disabled={articoli.length === 1}
                    className="text-red-400 hover:text-red-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors p-1 rounded hover:bg-red-50"
                    title="Rimuovi riga"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total row */}
      {showPrezzo && (
        <div className="flex justify-end mt-2 pr-10">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm">
            <span className="text-gray-500 font-medium mr-3">Totale imponibile:</span>
            <span className="font-bold text-blue-700 text-base">
              {articoli.reduce((sum, art) => {
                const q = parseFloat(art.quantita) || 0
                const p = parseFloat(art.prezzoUnitario) || 0
                return sum + q * p
              }, 0).toFixed(2)} €
            </span>
          </div>
        </div>
      )}

      {/* Add row button */}
      <button
        onClick={addRow}
        className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors px-2 py-1 rounded hover:bg-blue-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Aggiungi riga
      </button>
    </div>
  )
}

export { emptyArticolo }

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDateTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatCurrency(val) {
  const n = parseFloat(val)
  if (isNaN(n)) return ''
  return n.toFixed(2).replace('.', ',') + ' €'
}

function formatNumber(val) {
  const n = parseFloat(val)
  if (isNaN(n)) return val || ''
  return n % 1 === 0 ? String(n) : n.toFixed(2).replace('.', ',')
}

const COLORS = {
  primary: '#1e40af',
  primaryLight: '#dbeafe',
  headerBg: '#1e3a8a',
  headerText: '#ffffff',
  rowAlt: '#f8fafc',
  border: '#cbd5e1',
  textDark: '#1e293b',
  textGray: '#64748b',
  sectionBg: '#f1f5f9',
}

function sectionHeader(text) {
  return {
    text: text.toUpperCase(),
    style: 'sectionHeader',
    margin: [0, 0, 0, 6],
  }
}

function infoRow(label, value) {
  return {
    columns: [
      { text: label + ':', style: 'infoLabel', width: 'auto' },
      { text: value || '—', style: 'infoValue', margin: [4, 0, 0, 0] },
    ],
    margin: [0, 1, 0, 1],
  }
}

function addressBlock(data, prefix) {
  const lines = []
  if (data[`${prefix}RagioneSociale`]) lines.push(data[`${prefix}RagioneSociale`])
  if (data[`${prefix}Indirizzo`]) lines.push(data[`${prefix}Indirizzo`])
  const cityLine = [
    data[`${prefix}CAP`],
    data[`${prefix}Citta`],
    data[`${prefix}Provincia`] ? `(${data[`${prefix}Provincia`]})` : '',
  ]
    .filter(Boolean)
    .join(' ')
  if (cityLine) lines.push(cityLine)
  if (data[`${prefix}PIVA`]) lines.push(`P.IVA/C.F.: ${data[`${prefix}PIVA`]}`)
  return lines
}

export function generateDDT(formData, options = {}) {
  const { showPrezzo = false, showIVA = false } = options

  const mittenteLines = addressBlock(formData, 'mittente')
  const destinatarioLines = addressBlock(formData, 'destinatario')

  // Articles table
  const showPrezzi = showPrezzo
  const showIVACol = showIVA

  const tableHeaderCells = [
    { text: 'N°', style: 'tableHeader', alignment: 'center', width: 20 },
    { text: 'Codice', style: 'tableHeader', width: 60 },
    { text: 'Descrizione', style: 'tableHeader' },
    { text: 'Q.tà', style: 'tableHeader', alignment: 'center', width: 45 },
    { text: 'U.M.', style: 'tableHeader', alignment: 'center', width: 35 },
  ]
  if (showPrezzi) {
    tableHeaderCells.push({ text: 'Prezzo', style: 'tableHeader', alignment: 'right', width: 55 })
  }
  if (showIVACol) {
    tableHeaderCells.push({ text: 'IVA %', style: 'tableHeader', alignment: 'center', width: 40 })
  }
  if (showPrezzi) {
    tableHeaderCells.push({ text: 'Importo', style: 'tableHeader', alignment: 'right', width: 65 })
  }

  const articoli = formData.articoli || []
  const tableRows = articoli.map((art, idx) => {
    const qty = parseFloat(art.quantita) || 0
    const price = parseFloat(art.prezzoUnitario) || 0
    const importo = qty * price

    const cells = [
      { text: String(idx + 1), alignment: 'center', style: 'tableCell' },
      { text: art.codice || '', style: 'tableCell' },
      { text: art.descrizione || '', style: 'tableCell' },
      { text: formatNumber(art.quantita), alignment: 'center', style: 'tableCell' },
      { text: art.um || '', alignment: 'center', style: 'tableCell' },
    ]
    if (showPrezzi) {
      cells.push({ text: price > 0 ? formatCurrency(price) : '', alignment: 'right', style: 'tableCell' })
    }
    if (showIVACol) {
      cells.push({ text: art.iva ? `${art.iva}%` : '', alignment: 'center', style: 'tableCell' })
    }
    if (showPrezzi) {
      cells.push({ text: importo > 0 ? formatCurrency(importo) : '', alignment: 'right', style: 'tableCell' })
    }
    return cells
  })

  // Pad to at least 5 rows for visual appearance
  while (tableRows.length < 5) {
    const emptyCells = [
      { text: String(tableRows.length + 1), alignment: 'center', style: 'tableCellEmpty' },
      { text: '', style: 'tableCellEmpty' },
      { text: '', style: 'tableCellEmpty' },
      { text: '', style: 'tableCellEmpty' },
      { text: '', style: 'tableCellEmpty' },
    ]
    if (showPrezzi) emptyCells.push({ text: '', style: 'tableCellEmpty' })
    if (showIVACol) emptyCells.push({ text: '', style: 'tableCellEmpty' })
    if (showPrezzi) emptyCells.push({ text: '', style: 'tableCellEmpty' })
    tableRows.push(emptyCells)
  }

  // Build column widths for articles table
  const colWidths = ['auto', 60, '*', 45, 35]
  if (showPrezzi) colWidths.push(55)
  if (showIVACol) colWidths.push(40)
  if (showPrezzi) colWidths.push(65)

  // Totale importo if prezzi shown
  let totaleRow = null
  if (showPrezzi && articoli.length > 0) {
    const totale = articoli.reduce((sum, art) => {
      return sum + (parseFloat(art.quantita) || 0) * (parseFloat(art.prezzoUnitario) || 0)
    }, 0)
    const totaleCols = showIVACol ? colWidths.length - 2 : colWidths.length - 1
    totaleRow = {
      columns: [
        { text: '', width: '*' },
        {
          width: 'auto',
          table: {
            body: [
              [
                { text: 'TOTALE IMPONIBILE', style: 'totalLabel', alignment: 'right' },
                { text: formatCurrency(totale), style: 'totalValue', alignment: 'right' },
              ],
            ],
          },
          layout: 'noBorders',
        },
      ],
      margin: [0, 4, 0, 0],
    }
  }

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [30, 30, 30, 50],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 8.5,
      color: COLORS.textDark,
    },
    styles: {
      companyName: {
        fontSize: 16,
        bold: true,
        color: COLORS.primary,
      },
      companyAddress: {
        fontSize: 8,
        color: COLORS.textGray,
        lineHeight: 1.3,
      },
      ddtTitle: {
        fontSize: 22,
        bold: true,
        color: COLORS.headerBg,
      },
      ddtNumber: {
        fontSize: 13,
        bold: true,
        color: COLORS.primary,
      },
      ddtDate: {
        fontSize: 9,
        color: COLORS.textGray,
      },
      sectionHeader: {
        fontSize: 7.5,
        bold: true,
        color: COLORS.primary,
        letterSpacing: 1,
      },
      infoLabel: {
        fontSize: 8,
        color: COLORS.textGray,
        bold: true,
      },
      infoValue: {
        fontSize: 8.5,
        color: COLORS.textDark,
      },
      recipientName: {
        fontSize: 10,
        bold: true,
        color: COLORS.textDark,
      },
      tableHeader: {
        fontSize: 7.5,
        bold: true,
        color: COLORS.headerText,
        fillColor: COLORS.headerBg,
        margin: [3, 4, 3, 4],
      },
      tableCell: {
        fontSize: 8.5,
        margin: [3, 3, 3, 3],
      },
      tableCellEmpty: {
        fontSize: 8.5,
        margin: [3, 3, 3, 3],
        color: '#e2e8f0',
      },
      sectionBox: {
        fillColor: COLORS.sectionBg,
      },
      noteLabel: {
        fontSize: 7.5,
        bold: true,
        color: COLORS.textGray,
        margin: [0, 0, 0, 3],
      },
      signatureLabel: {
        fontSize: 8,
        bold: true,
        color: COLORS.textGray,
        alignment: 'center',
      },
      totalLabel: {
        fontSize: 9,
        bold: true,
        color: COLORS.textGray,
        margin: [0, 3, 8, 3],
      },
      totalValue: {
        fontSize: 10,
        bold: true,
        color: COLORS.primary,
        margin: [0, 3, 0, 3],
      },
      footerText: {
        fontSize: 7,
        color: COLORS.textGray,
      },
    },
    content: [
      // ── HEADER ──────────────────────────────────────────────────────────────
      {
        columns: [
          // Left: company info
          {
            width: '*',
            stack: [
              {
                text: formData.mittenteRagioneSociale || 'RAGIONE SOCIALE',
                style: 'companyName',
              },
              {
                text: [
                  formData.mittenteIndirizzo ? formData.mittenteIndirizzo + '\n' : '',
                  [formData.mittenteCAP, formData.mittenteCitta, formData.mittenteProvincia ? `(${formData.mittenteProvincia})` : ''].filter(Boolean).join(' '),
                  formData.mittentePIVA ? '\nP.IVA/C.F.: ' + formData.mittentePIVA : '',
                ].join(''),
                style: 'companyAddress',
                margin: [0, 4, 0, 0],
              },
            ],
          },
          // Right: DDT number/date
          {
            width: 'auto',
            stack: [
              { text: 'DOCUMENTO DI TRASPORTO', style: 'ddtTitle', alignment: 'right' },
              {
                columns: [
                  { text: 'N°', style: 'ddtDate', width: 'auto', margin: [0, 2, 6, 0] },
                  {
                    text: formData.numeroDDT ? String(formData.numeroDDT).padStart(4, '0') : '0001',
                    style: 'ddtNumber',
                    alignment: 'right',
                  },
                ],
                margin: [0, 6, 0, 2],
              },
              {
                text: 'Data: ' + formatDate(formData.data),
                style: 'ddtDate',
                alignment: 'right',
              },
            ],
          },
        ],
        margin: [0, 0, 0, 0],
      },

      // Separator line
      {
        canvas: [
          {
            type: 'line',
            x1: 0, y1: 0, x2: 535, y2: 0,
            lineWidth: 2,
            lineColor: COLORS.primary,
          },
        ],
        margin: [0, 8, 0, 10],
      },

      // ── MITTENTE / DESTINATARIO ──────────────────────────────────────────────
      {
        columns: [
          // Mittente
          {
            width: '47%',
            stack: [
              sectionHeader('Mittente'),
              {
                stack: [
                  {
                    text: formData.mittenteRagioneSociale || '',
                    style: 'recipientName',
                    margin: [0, 0, 0, 2],
                  },
                  ...mittenteLines.slice(1).map(line => ({
                    text: line,
                    style: 'companyAddress',
                    lineHeight: 1.4,
                  })),
                ],
                fillColor: COLORS.sectionBg,
                margin: [-4, 0, 0, 0],
                padding: [6, 6, 6, 6],
              },
            ],
          },
          { width: '6%', text: '' },
          // Destinatario
          {
            width: '47%',
            stack: [
              sectionHeader('Destinatario'),
              {
                stack: [
                  {
                    text: formData.destinatarioRagioneSociale || '',
                    style: 'recipientName',
                    margin: [0, 0, 0, 2],
                  },
                  ...destinatarioLines.slice(1).map(line => ({
                    text: line,
                    style: 'companyAddress',
                    lineHeight: 1.4,
                  })),
                  formData.destinatarioLuogoConsegna
                    ? {
                        text: 'Luogo consegna: ' + formData.destinatarioLuogoConsegna,
                        style: 'companyAddress',
                        margin: [0, 4, 0, 0],
                        italics: true,
                      }
                    : null,
                ].filter(Boolean),
                fillColor: '#fafafa',
                margin: [-4, 0, 0, 0],
                padding: [6, 6, 6, 6],
              },
            ],
          },
        ],
        margin: [0, 0, 0, 10],
      },

      // ── VETTORE + DATI TRASPORTO ─────────────────────────────────────────────
      {
        columns: [
          // Vettore
          {
            width: '30%',
            stack: [
              sectionHeader('Vettore'),
              infoRow('Ragione Sociale', formData.vettoreNome),
              infoRow('Targa', formData.vettoreTarga),
            ],
          },
          { width: '5%', text: '' },
          // Causale / Aspetto
          {
            width: '30%',
            stack: [
              sectionHeader('Trasporto'),
              infoRow('Causale', formData.causale),
              infoRow('Aspetto beni', formData.aspetto),
              infoRow('Porto', formData.porto),
            ],
          },
          { width: '5%', text: '' },
          // Colli / Peso / Data
          {
            width: '30%',
            stack: [
              sectionHeader('Dettagli'),
              infoRow('N° colli', formData.numeroColli),
              infoRow('Peso lordo', formData.pesoLordo ? formData.pesoLordo + ' kg' : ''),
              infoRow('Inizio trasporto', formatDateTime(formData.dataInizioTrasporto)),
            ],
          },
        ],
        margin: [0, 0, 0, 12],
      },

      // Thin divider
      {
        canvas: [
          {
            type: 'line',
            x1: 0, y1: 0, x2: 535, y2: 0,
            lineWidth: 0.5,
            lineColor: COLORS.border,
          },
        ],
        margin: [0, 0, 0, 10],
      },

      // ── ARTICOLI ────────────────────────────────────────────────────────────
      sectionHeader('Articoli'),
      {
        table: {
          headerRows: 1,
          widths: colWidths,
          body: [tableHeaderCells, ...tableRows],
        },
        layout: {
          hLineWidth: (i) => (i === 0 || i === 1 ? 0 : 0.5),
          vLineWidth: () => 0.5,
          hLineColor: () => COLORS.border,
          vLineColor: () => COLORS.border,
          fillColor: (rowIndex) => {
            if (rowIndex === 0) return COLORS.headerBg
            return rowIndex % 2 === 0 ? COLORS.rowAlt : null
          },
        },
        margin: [0, 0, 0, 4],
      },

      // Totale
      totaleRow || { text: '', margin: [0, 0, 0, 0] },

      // ── NOTE ────────────────────────────────────────────────────────────────
      formData.note
        ? {
            stack: [
              { text: 'NOTE', style: 'noteLabel', margin: [0, 10, 0, 2] },
              {
                text: formData.note,
                fontSize: 8.5,
                color: COLORS.textDark,
                fillColor: COLORS.sectionBg,
                margin: [0, 0, 0, 0],
                padding: [6, 6, 6, 6],
              },
            ],
            margin: [0, 8, 0, 0],
          }
        : { text: '', margin: [0, 8, 0, 0] },

      // ── FIRME ───────────────────────────────────────────────────────────────
      {
        margin: [0, 20, 0, 0],
        columns: [
          // Mittente firma
          {
            width: '30%',
            stack: [
              {
                canvas: [
                  { type: 'line', x1: 0, y1: 0, x2: 155, y2: 0, lineWidth: 0.8, lineColor: COLORS.border },
                ],
                margin: [0, 0, 0, 4],
              },
              { text: 'MITTENTE', style: 'signatureLabel' },
            ],
          },
          { width: '5%', text: '' },
          // Vettore firma
          {
            width: '30%',
            stack: [
              {
                canvas: [
                  { type: 'line', x1: 0, y1: 0, x2: 155, y2: 0, lineWidth: 0.8, lineColor: COLORS.border },
                ],
                margin: [0, 0, 0, 4],
              },
              { text: 'VETTORE', style: 'signatureLabel' },
            ],
          },
          { width: '5%', text: '' },
          // Destinatario firma
          {
            width: '30%',
            stack: [
              {
                canvas: [
                  { type: 'line', x1: 0, y1: 0, x2: 155, y2: 0, lineWidth: 0.8, lineColor: COLORS.border },
                ],
                margin: [0, 0, 0, 4],
              },
              { text: 'DESTINATARIO', style: 'signatureLabel' },
            ],
          },
        ],
      },
    ],

    footer: (currentPage, pageCount) => ({
      columns: [
        {
          text: `DDT N° ${formData.numeroDDT ? String(formData.numeroDDT).padStart(4, '0') : '0001'} del ${formatDate(formData.data)}`,
          style: 'footerText',
          margin: [30, 0, 0, 0],
        },
        {
          text: `Pagina ${currentPage} di ${pageCount}`,
          style: 'footerText',
          alignment: 'right',
          margin: [0, 0, 30, 0],
        },
      ],
      margin: [0, 10, 0, 0],
    }),
  }

  return docDefinition
}

export function previewDDT(formData, options) {
  const doc = generateDDT(formData, options)
  pdfMake.createPdf(doc).open()
}

export function downloadDDT(formData, options) {
  const doc = generateDDT(formData, options)
  const numero = formData.numeroDDT ? String(formData.numeroDDT).padStart(4, '0') : '0001'
  pdfMake.createPdf(doc).download(`DDT_${numero}.pdf`)
}

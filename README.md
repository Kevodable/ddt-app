# DDT Generator

Applicazione web per la generazione di **Documenti di Trasporto (DDT)** in formato PDF, sviluppata in React + Vite con Tailwind CSS.

Tutto avviene **lato client**: nessun backend, nessun dato inviato a server. I dati vengono salvati automaticamente nel `localStorage` del browser.

---

## Funzionalità

- Compilazione completa di tutti i campi DDT standard italiani
- Tabella articoli dinamica (aggiunta/rimozione righe)
- Opzione per mostrare prezzi e IVA
- Generazione PDF professionale con **pdfmake**
- Anteprima PDF in nuova scheda
- Download PDF
- Salvataggio automatico nel browser (localStorage)
- Impostazioni azienda (mittente precompilato)
- Numerazione DDT automatica con incremento
- Layout responsive (mobile-friendly)

---

## Avvio locale

### Prerequisiti

- Node.js 18+
- npm

### Installazione e avvio

```bash
# Clona il repository
git clone https://github.com/TUO_USERNAME/ddt-app.git
cd ddt-app

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

### Build di produzione

```bash
npm run build
```

I file compilati vengono generati nella cartella `dist/`.

---

## Deploy su GitHub Pages

### Configurazione automatica (GitHub Actions)

Il file `.github/workflows/deploy.yml` configura il deploy automatico ad ogni push sul branch `main`.

**Passi per il primo deploy:**

1. Crea un nuovo repository su GitHub e carica il codice:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/ddt-app.git
git push -u origin main
```

2. Vai su **Settings → Pages** nel repository GitHub
3. In "Source" seleziona **GitHub Actions**
4. Il primo deploy partirà automaticamente al push

L'app sarà disponibile su: `https://TUO_USERNAME.github.io/ddt-app/`

### Deploy manuale

```bash
npm run build
# Carica il contenuto della cartella dist/ su GitHub Pages manualmente
```

---

## Struttura del progetto

```
ddt-app/
├── src/
│   ├── components/
│   │   ├── DDTForm.jsx          # Form principale con tutti i campi
│   │   ├── ArticoliTable.jsx    # Tabella articoli dinamica
│   │   └── SettingsModal.jsx    # Modal impostazioni azienda
│   ├── utils/
│   │   ├── pdfGenerator.js      # Logica generazione PDF con pdfmake
│   │   └── storage.js           # Helpers per localStorage
│   ├── App.jsx                  # Componente principale
│   ├── main.jsx                 # Entry point
│   └── index.css                # Stili Tailwind
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions deploy
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Stack tecnologico

| Tecnologia | Versione | Scopo |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Stili |
| pdfmake | 0.2 | Generazione PDF lato client |

---

## Licenza

MIT

const KEYS = {
  DDT_DATA: 'ddt_current_data',
  DDT_COUNTER: 'ddt_counter',
  COMPANY_SETTINGS: 'ddt_company_settings',
}

export function saveDDTData(data) {
  try {
    localStorage.setItem(KEYS.DDT_DATA, JSON.stringify(data))
  } catch (e) {
    console.error('Errore nel salvataggio:', e)
  }
}

export function loadDDTData() {
  try {
    const raw = localStorage.getItem(KEYS.DDT_DATA)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.error('Errore nel caricamento:', e)
    return null
  }
}

export function getNextDDTNumber() {
  try {
    const current = parseInt(localStorage.getItem(KEYS.DDT_COUNTER) || '0', 10)
    const next = current + 1
    localStorage.setItem(KEYS.DDT_COUNTER, String(next))
    return next
  } catch (e) {
    return 1
  }
}

export function getCurrentDDTNumber() {
  try {
    return parseInt(localStorage.getItem(KEYS.DDT_COUNTER) || '0', 10)
  } catch (e) {
    return 0
  }
}

export function saveCompanySettings(settings) {
  try {
    localStorage.setItem(KEYS.COMPANY_SETTINGS, JSON.stringify(settings))
  } catch (e) {
    console.error('Errore nel salvataggio impostazioni:', e)
  }
}

export function loadCompanySettings() {
  try {
    const raw = localStorage.getItem(KEYS.COMPANY_SETTINGS)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function clearDDTData() {
  try {
    localStorage.removeItem(KEYS.DDT_DATA)
  } catch (e) {
    console.error('Errore nella cancellazione:', e)
  }
}

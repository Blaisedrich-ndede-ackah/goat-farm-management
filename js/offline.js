// Offline functionality and PWA features

let offlineData = []
let updateOnlineStatus
let showToast
let handleSync
let loadDashboardData

// Initialize offline capabilities
document.addEventListener("DOMContentLoaded", () => {
  initializeOfflineStorage()
  setupOfflineEventListeners()
})

function initializeOfflineStorage() {
  // Load offline data from localStorage
  const offlineDataStr = localStorage.getItem("offline_data")
  if (offlineDataStr) {
    offlineData = JSON.parse(offlineDataStr)
  }

  // Initialize IndexedDB for more complex offline storage if needed
  if ("indexedDB" in window) {
    initializeIndexedDB()
  }
}

function setupOfflineEventListeners() {
  // Listen for online/offline events
  window.addEventListener("online", handleOnline)
  window.addEventListener("offline", handleOffline)

  // Listen for beforeunload to save any pending data
  window.addEventListener("beforeunload", savePendingData)
}

function handleOnline() {
  console.log("App is online")
  updateOnlineStatus()

  // Auto-sync offline data
  const offlineDataStr = localStorage.getItem("offline_data")
  if (offlineDataStr && JSON.parse(offlineDataStr).length > 0) {
    showToast("Connection restored. Syncing offline data...", "success")
    setTimeout(handleSync, 2000)
  }
}

function handleOffline() {
  console.log("App is offline")
  updateOnlineStatus()
  showToast("You are now offline. Data will be saved locally.", "warning")
}

function savePendingData() {
  // Save any pending form data or unsaved changes
  if (offlineData.length > 0) {
    localStorage.setItem("offline_data", JSON.stringify(offlineData))
  }
}

// IndexedDB setup for more complex offline storage
let db

function initializeIndexedDB() {
  const request = indexedDB.open("GoatFarmDB", 1)

  request.onerror = (event) => {
    console.error("IndexedDB error:", event.target.error)
  }

  request.onsuccess = (event) => {
    db = event.target.result
    console.log("IndexedDB initialized successfully")
  }

  request.onupgradeneeded = (event) => {
    db = event.target.result

    // Create object stores
    if (!db.objectStoreNames.contains("attendance")) {
      const attendanceStore = db.createObjectStore("attendance", { keyPath: "id", autoIncrement: true })
      attendanceStore.createIndex("goat_id", "goat_id", { unique: false })
      attendanceStore.createIndex("date", "attendance_date", { unique: false })
    }

    if (!db.objectStoreNames.contains("medical")) {
      const medicalStore = db.createObjectStore("medical", { keyPath: "id", autoIncrement: true })
      medicalStore.createIndex("goat_id", "goat_id", { unique: false })
    }

    if (!db.objectStoreNames.contains("goats")) {
      const goatsStore = db.createObjectStore("goats", { keyPath: "id" })
      goatsStore.createIndex("ear_tag", "ear_tag", { unique: true })
      goatsStore.createIndex("barcode", "barcode", { unique: false })
    }
  }
}

// Offline data management functions
function storeOfflineAttendance(attendanceData) {
  if (!navigator.onLine) {
    attendanceData.type = "attendance"
    attendanceData.timestamp = new Date().toISOString()
    attendanceData.sync_status = "pending"

    offlineData.push(attendanceData)
    localStorage.setItem("offline_data", JSON.stringify(offlineData))

    // Also store in IndexedDB if available
    if (db) {
      const transaction = db.transaction(["attendance"], "readwrite")
      const store = transaction.objectStore("attendance")
      store.add(attendanceData)
    }

    return true
  }
  return false
}

function storeOfflineMedical(medicalData) {
  if (!navigator.onLine) {
    medicalData.type = "medical"
    medicalData.timestamp = new Date().toISOString()
    medicalData.sync_status = "pending"

    offlineData.push(medicalData)
    localStorage.setItem("offline_data", JSON.stringify(offlineData))

    if (db) {
      const transaction = db.transaction(["medical"], "readwrite")
      const store = transaction.objectStore("medical")
      store.add(medicalData)
    }

    return true
  }
  return false
}

function getOfflineData(type = null) {
  if (type) {
    return offlineData.filter((item) => item.type === type)
  }
  return offlineData
}

function clearOfflineData() {
  offlineData = []
  localStorage.removeItem("offline_data")

  if (db) {
    const transaction = db.transaction(["attendance", "medical"], "readwrite")
    transaction.objectStore("attendance").clear()
    transaction.objectStore("medical").clear()
  }
}

// Cache management for offline functionality
function cacheGoatsData(goats) {
  if (db) {
    const transaction = db.transaction(["goats"], "readwrite")
    const store = transaction.objectStore("goats")

    goats.forEach((goat) => {
      store.put(goat)
    })
  }

  // Also store in localStorage as fallback
  localStorage.setItem("cached_goats", JSON.stringify(goats))
}

function getCachedGoats() {
  return new Promise((resolve, reject) => {
    if (db) {
      const transaction = db.transaction(["goats"], "readonly")
      const store = transaction.objectStore("goats")
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        // Fallback to localStorage
        const cached = localStorage.getItem("cached_goats")
        resolve(cached ? JSON.parse(cached) : [])
      }
    } else {
      // Fallback to localStorage
      const cached = localStorage.getItem("cached_goats")
      resolve(cached ? JSON.parse(cached) : [])
    }
  })
}

// Offline search functionality
async function searchGoatOffline(barcode) {
  const cachedGoats = await getCachedGoats()
  return cachedGoats.find((goat) => goat.barcode === barcode || goat.ear_tag === barcode)
}

// Background sync when connection is restored
function backgroundSync() {
  if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready
      .then((registration) => registration.sync.register("background-sync"))
      .catch((error) => {
        console.log("Background sync registration failed:", error)
      })
  }
}

// Service worker message handling
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SYNC_COMPLETE") {
      showToast("Background sync completed", "success")
      loadDashboardData()
    }
  })
}

// Offline status indicator management
function updateOfflineIndicator() {
  const indicator = document.getElementById("offline-indicator")
  const pendingCount = offlineData.length

  if (!navigator.onLine) {
    if (pendingCount > 0) {
      indicator.textContent = `📡 Offline Mode - ${pendingCount} records pending sync`
    } else {
      indicator.textContent = "📡 Offline Mode - Data will sync when connection is restored"
    }
    indicator.classList.add("show")
  } else {
    indicator.classList.remove("show")
  }
}

// Export offline data for debugging
function exportOfflineData() {
  const data = {
    offline_data: offlineData,
    cached_goats: localStorage.getItem("cached_goats"),
    timestamp: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `offline_data_${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Periodic sync attempt
setInterval(() => {
  if (navigator.onLine && offlineData.length > 0) {
    console.log("Attempting periodic sync...")
    handleSync()
  }
}, 30000) // Try every 30 seconds

// Update offline indicator when data changes
function updateOfflineDataAndIndicator() {
  localStorage.setItem("offline_data", JSON.stringify(offlineData))
  updateOfflineIndicator()
}

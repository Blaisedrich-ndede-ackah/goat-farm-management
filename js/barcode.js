// Barcode scanning functionality

let barcodeBuffer = ""
let barcodeTimeout
let currentTab = "" // Declare currentTab variable

// Initialize barcode scanning
document.addEventListener("DOMContentLoaded", () => {
  setupBarcodeScanning()
})

function setupBarcodeScanning() {
  // Listen for rapid keystrokes (barcode scanner input)
  document.addEventListener("keypress", handleBarcodeInput)

  // Setup camera-based scanning if supported
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    setupCameraScanning()
  }
}

function handleBarcodeInput(event) {
  // Only process if barcode scanner is active
  if (!document.getElementById("barcode-scanner").classList.contains("active")) {
    return
  }

  // Clear previous timeout
  clearTimeout(barcodeTimeout)

  // Add character to buffer
  if (event.key === "Enter") {
    // Barcode complete
    if (barcodeBuffer.length > 0) {
      document.getElementById("barcode-input").value = barcodeBuffer
      barcodeBuffer = ""
      confirmBarcodeScan()
    }
  } else {
    barcodeBuffer += event.key
  }

  // Set timeout to clear buffer if input stops
  barcodeTimeout = setTimeout(() => {
    barcodeBuffer = ""
  }, 100)
}

function setupCameraScanning() {
  // This would integrate with a camera-based barcode scanning library
  // For now, we'll use manual input as the primary method
  console.log("Camera scanning setup (placeholder for future implementation)")
}

// Enhanced barcode scanning with validation
async function processBarcode(barcode) {
  if (!barcode || barcode.length < 3) {
    showToast("Invalid barcode format", "error")
    return false
  }

  try {
    // First try to find goat online
    if (navigator.onLine) {
      const response = await fetch(`api/goats.php?barcode=${barcode}`)
      const data = await response.json()

      if (data.success) {
        return data.goat
      }
    }

    // Fallback to offline search
    const cachedGoat = await searchGoatOffline(barcode)
    if (cachedGoat) {
      return cachedGoat
    }

    throw new Error("Goat not found")
  } catch (error) {
    console.error("Barcode processing error:", error)
    return null
  }
}

// Barcode format validation
function validateBarcodeFormat(barcode) {
  // Common barcode formats
  const formats = {
    ean13: /^\d{13}$/,
    ean8: /^\d{8}$/,
    code128: /^[\x00-\x7F]+$/,
    code39: /^[A-Z0-9\-.$/+%\s]+$/,
    ear_tag: /^[A-Z]{2}\d{3,6}$/i,
  }

  for (const [format, regex] of Object.entries(formats)) {
    if (regex.test(barcode)) {
      return { valid: true, format: format }
    }
  }

  return { valid: false, format: null }
}

// Enhanced barcode confirmation with validation
async function confirmBarcodeScan() {
  const barcode = document.getElementById("barcode-input").value.trim()

  if (!barcode) {
    showToast("Please enter a barcode or ear tag", "warning")
    return
  }

  // Validate barcode format
  const validation = validateBarcodeFormat(barcode)
  if (!validation.valid) {
    showToast("Invalid barcode format", "warning")
    return
  }

  // Show loading state
  const confirmBtn = document.getElementById("confirm-scan")
  const originalText = confirmBtn.textContent
  confirmBtn.textContent = "Processing..."
  confirmBtn.disabled = true

  try {
    const goat = await processBarcode(barcode)

    if (!goat) {
      showToast("Goat not found. Please check the barcode.", "error")
      return
    }

    // Record attendance
    const attendanceData = {
      goat_id: goat.id,
      notes: "",
      sync_status: navigator.onLine ? "synced" : "pending",
    }

    if (navigator.onLine) {
      const response = await fetch("api/attendance.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attendanceData),
      })

      const result = await response.json()

      if (result.success) {
        showToast(`✅ Attendance recorded for ${goat.ear_tag} - ${goat.name || "Unnamed"}`, "success")
        playSuccessSound()
        provideFeedback("success")
        closeBarcodeScanner()
        loadAttendance()
      } else {
        if (result.error.includes("already recorded")) {
          showToast(`⚠️ ${goat.ear_tag} already marked present today`, "warning")
          provideFeedback("warning")
        } else {
          showToast(result.error, "error")
          provideFeedback("error")
        }
      }
    } else {
      // Store offline
      attendanceData.attendance_date = new Date().toISOString().split("T")[0]
      attendanceData.timestamp = new Date().toISOString()
      attendanceData.type = "attendance"

      if (storeOfflineAttendance(attendanceData)) {
        showToast(`📱 Offline: Attendance queued for ${goat.ear_tag}`, "warning")
        provideFeedback("warning")
        closeBarcodeScanner()
        updateOfflineDataAndIndicator()
      }
    }
  } catch (error) {
    console.error("Barcode scan error:", error)
    showToast("Failed to process barcode", "error")
    provideFeedback("error")
  } finally {
    // Reset button state
    confirmBtn.textContent = originalText
    confirmBtn.disabled = false
  }
}

// Visual and audio feedback for scanning
function provideFeedback(type) {
  const scanner = document.getElementById("barcode-scanner")
  const container = scanner.querySelector(".scanner-container")

  // Visual feedback
  container.classList.add(`feedback-${type}`)
  setTimeout(() => {
    container.classList.remove(`feedback-${type}`)
  }, 1000)

  // Audio feedback
  switch (type) {
    case "success":
      playSuccessSound()
      break
    case "warning":
      playWarningSound()
      break
    case "error":
      playErrorSound()
      break
  }

  // Haptic feedback if supported
  if (navigator.vibrate) {
    switch (type) {
      case "success":
        navigator.vibrate(200)
        break
      case "warning":
        navigator.vibrate([100, 100, 100])
        break
      case "error":
        navigator.vibrate([300, 100, 300])
        break
    }
  }
}

function playWarningSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = 600
  oscillator.type = "square"

  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}

function playErrorSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = 300
  oscillator.type = "sawtooth"

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.8)
}

// Barcode history for quick re-scanning
let barcodeHistory = []

function addToBarcodeHistory(barcode) {
  if (!barcodeHistory.includes(barcode)) {
    barcodeHistory.unshift(barcode)
    if (barcodeHistory.length > 10) {
      barcodeHistory.pop()
    }
    localStorage.setItem("barcode_history", JSON.stringify(barcodeHistory))
  }
}

function loadBarcodeHistory() {
  const saved = localStorage.getItem("barcode_history")
  if (saved) {
    barcodeHistory = JSON.parse(saved)
  }
}

// Enhanced barcode scanner with history
function enhancedBarcodeScanner() {
  loadBarcodeHistory()

  const scanner = document.getElementById("barcode-scanner")
  const input = document.getElementById("barcode-input")

  // Add history dropdown
  if (barcodeHistory.length > 0) {
    const historyContainer = document.createElement("div")
    historyContainer.className = "barcode-history"
    historyContainer.innerHTML = `
            <label>Recent Scans:</label>
            <select id="barcode-history-select">
                <option value="">Select from history</option>
                ${barcodeHistory.map((code) => `<option value="${code}">${code}</option>`).join("")}
            </select>
        `

    scanner
      .querySelector(".scanner-container")
      .insertBefore(historyContainer, scanner.querySelector(".scanner-actions"))

    document.getElementById("barcode-history-select").addEventListener("change", (e) => {
      if (e.target.value) {
        input.value = e.target.value
      }
    })
  }
}

// Initialize enhanced scanner when opening
document.getElementById("scan-barcode-btn").addEventListener("click", () => {
  openBarcodeScanner()
  enhancedBarcodeScanner()
})

// Auto-focus and clear input when scanner opens
function openBarcodeScanner() {
  document.getElementById("barcode-scanner").classList.add("active")
  const input = document.getElementById("barcode-input")
  input.value = ""
  input.focus()

  // Clear any existing history UI
  const existingHistory = document.querySelector(".barcode-history")
  if (existingHistory) {
    existingHistory.remove()
  }
}

// Keyboard shortcuts for barcode scanner
document.addEventListener("keydown", (event) => {
  // Ctrl/Cmd + B to open barcode scanner
  if ((event.ctrlKey || event.metaKey) && event.key === "b") {
    event.preventDefault()
    if (currentTab === "attendance") {
      openBarcodeScanner()
    }
  }

  // Escape to close scanner
  if (event.key === "Escape") {
    if (document.getElementById("barcode-scanner").classList.contains("active")) {
      closeBarcodeScanner()
    }
  }
})

// Declare missing functions
function showToast(message, type) {
  console.log(`Toast: ${message} (${type})`)
}

async function searchGoatOffline(barcode) {
  console.log(`Searching offline for barcode: ${barcode}`)
  return null // Placeholder for offline search logic
}

function playSuccessSound() {
  console.log("Playing success sound")
}

function closeBarcodeScanner() {
  document.getElementById("barcode-scanner").classList.remove("active")
}

function loadAttendance() {
  console.log("Loading attendance")
}

function storeOfflineAttendance(attendanceData) {
  console.log(`Storing offline attendance: ${JSON.stringify(attendanceData)}`)
  return true // Placeholder for offline storage logic
}

function updateOfflineDataAndIndicator() {
  console.log("Updating offline data and indicator")
}

// Function to set current tab
function setCurrentTab(tab) {
  currentTab = tab
}

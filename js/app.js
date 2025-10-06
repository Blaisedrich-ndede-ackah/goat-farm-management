// Global app state
let currentUser = null
let currentTab = "overview"
const offlineData = []

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  checkAuthStatus()
})

function initializeApp() {
  // Register service worker for PWA
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => console.log("SW registered:", registration))
      .catch((error) => console.log("SW registration failed:", error))
  }

  // Check online/offline status
  updateOnlineStatus()
  window.addEventListener("online", updateOnlineStatus)
  window.addEventListener("offline", updateOnlineStatus)
}

function setupEventListeners() {
  // Login form
  document.getElementById("login-form").addEventListener("submit", handleLogin)

  // Logout button
  document.getElementById("logout-btn").addEventListener("click", handleLogout)

  // Navigation tabs
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", (e) => switchTab(e.target.dataset.tab))
  })

  // Sync button
  document.getElementById("sync-btn").addEventListener("click", handleSync)

  // Barcode scanner
  document.getElementById("scan-barcode-btn").addEventListener("click", openBarcodeScanner)
  document.getElementById("confirm-scan").addEventListener("click", confirmBarcodeScan)
  document.getElementById("cancel-scan").addEventListener("click", closeBarcodeScanner)
  document.getElementById("barcode-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") confirmBarcodeScan()
  })

  // Modal close
  document.querySelector(".close").addEventListener("click", closeModal)
  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") closeModal()
  })

  // Add buttons
  document.getElementById("add-medical-btn")?.addEventListener("click", () => openMedicalForm())
  document.getElementById("add-breeding-btn")?.addEventListener("click", () => openBreedingForm())
  document.getElementById("add-goat-btn")?.addEventListener("click", () => openGoatForm())

  // Date input for attendance
  document.getElementById("attendance-date").addEventListener("change", loadAttendance)

  // Set default date to today
  document.getElementById("attendance-date").value = new Date().toISOString().split("T")[0]
}

function checkAuthStatus() {
  const token = localStorage.getItem("auth_token")
  if (token) {
    // Validate token with server
    fetch("api/dashboard.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          currentUser = { role: data.user_role }
          showDashboard()
        } else {
          showLogin()
        }
      })
      .catch(() => showLogin())
  } else {
    showLogin()
  }
}

function showLogin() {
  document.getElementById("login-page").classList.add("active")
  document.getElementById("dashboard-page").classList.remove("active")
  document.body.classList.remove("admin")
}

function showDashboard() {
  document.getElementById("login-page").classList.remove("active")
  document.getElementById("dashboard-page").classList.add("active")

  if (currentUser && currentUser.role === "admin") {
    document.body.classList.add("admin")
  }

  loadDashboardData()
}

async function handleLogin(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const credentials = {
    username: formData.get("username"),
    password: formData.get("password"),
  }

  try {
    const response = await fetch("api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (data.success) {
      currentUser = data.user
      localStorage.setItem("auth_token", "authenticated")
      showToast("Login successful!", "success")
      showDashboard()
    } else {
      showError("login-error", data.error)
    }
  } catch (error) {
    showError("login-error", "Connection error. Please try again.")
  }
}

async function handleLogout() {
  try {
    await fetch("api/logout.php")
    localStorage.removeItem("auth_token")
    currentUser = null
    showLogin()
    showToast("Logged out successfully", "success")
  } catch (error) {
    console.error("Logout error:", error)
  }
}

function switchTab(tabName) {
  // Update active tab
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.remove("active")
  })
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")

  // Update active content
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active")
  })
  document.getElementById(`${tabName}-tab`).classList.add("active")

  currentTab = tabName

  // Load tab-specific data
  switch (tabName) {
    case "overview":
      loadDashboardData()
      break
    case "attendance":
      loadAttendance()
      break
    case "medical":
      loadMedicalRecords()
      break
    case "breeding":
      loadBreedingRecords()
      break
    case "goats":
      loadGoats()
      break
  }
}

async function loadDashboardData() {
  try {
    const response = await fetch("api/dashboard.php")
    const data = await response.json()

    if (data.success) {
      // Update stats
      document.getElementById("total-goats").textContent = data.stats.total_goats
      document.getElementById("todays-attendance").textContent = data.stats.todays_attendance
      document.getElementById("pending-medical").textContent = data.stats.pending_medical
      document.getElementById("upcoming-births").textContent = data.stats.upcoming_births

      // Update notifications
      displayNotifications(data.notifications)

      // Update recent attendance
      displayRecentAttendance(data.recent_attendance)
    }
  } catch (error) {
    console.error("Dashboard load error:", error)
    showToast("Failed to load dashboard data", "error")
  }
}

function displayNotifications(notifications) {
  const container = document.getElementById("notifications-list")

  if (notifications.length === 0) {
    container.innerHTML = '<p class="text-center" style="color: #666; padding: 2rem;">No new notifications</p>'
    return
  }

  container.innerHTML = notifications
    .map(
      (notification) => `
        <div class="notification-item">
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
            </div>
            <div class="notification-time">${formatDateTime(notification.created_at)}</div>
        </div>
    `,
    )
    .join("")
}

function displayRecentAttendance(attendance) {
  const container = document.getElementById("recent-attendance")

  if (attendance.length === 0) {
    container.innerHTML = '<p class="text-center" style="color: #666; padding: 2rem;">No recent attendance</p>'
    return
  }

  container.innerHTML = attendance
    .map(
      (record) => `
        <div class="activity-item">
            <div class="activity-content">
                <h4>${record.ear_tag} - ${record.goat_name}</h4>
                <p>Recorded by ${record.user_name}</p>
            </div>
            <div class="activity-time">${formatDateTime(record.timestamp)}</div>
        </div>
    `,
    )
    .join("")
}

async function loadAttendance() {
  const date = document.getElementById("attendance-date").value

  try {
    const response = await fetch(`api/attendance.php?date=${date}`)
    const data = await response.json()

    if (data.success) {
      displayAttendanceTable(data.attendance)
    }
  } catch (error) {
    console.error("Attendance load error:", error)
    showToast("Failed to load attendance data", "error")
  }
}

function displayAttendanceTable(attendance) {
  const container = document.getElementById("attendance-list")

  if (attendance.length === 0) {
    container.innerHTML =
      '<p class="text-center" style="color: #666; padding: 2rem;">No attendance records for this date</p>'
    return
  }

  container.innerHTML = `
        <div class="table-header">Attendance Records</div>
        ${attendance
          .map(
            (record) => `
            <div class="table-row">
                <div class="table-cell">
                    <div class="table-cell-label">Ear Tag</div>
                    <div class="table-cell-value">${record.ear_tag}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Goat Name</div>
                    <div class="table-cell-value">${record.goat_name || "N/A"}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Recorded By</div>
                    <div class="table-cell-value">${record.user_name}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Time</div>
                    <div class="table-cell-value">${formatTime(record.timestamp)}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Notes</div>
                    <div class="table-cell-value">${record.notes || "None"}</div>
                </div>
            </div>
        `,
          )
          .join("")}
    `
}

function openBarcodeScanner() {
  document.getElementById("barcode-scanner").classList.add("active")
  document.getElementById("barcode-input").focus()
}

function closeBarcodeScanner() {
  document.getElementById("barcode-scanner").classList.remove("active")
  document.getElementById("barcode-input").value = ""
}

async function confirmBarcodeScan() {
  const barcode = document.getElementById("barcode-input").value.trim()

  if (!barcode) {
    showToast("Please enter a barcode or ear tag", "warning")
    return
  }

  try {
    // First, find the goat
    const goatResponse = await fetch(`api/goats.php?barcode=${barcode}`)
    const goatData = await goatResponse.json()

    if (!goatData.success) {
      showToast("Goat not found", "error")
      return
    }

    // Record attendance
    const attendanceData = {
      goat_id: goatData.goat.id,
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
        showToast(`✅ Attendance recorded for ${goatData.goat.ear_tag}`, "success")
        playSuccessSound()
        closeBarcodeScanner()
        loadAttendance()
      } else {
        showToast(result.error, "error")
      }
    } else {
      // Store offline
      attendanceData.goat_id = goatData.goat.id
      attendanceData.attendance_date = new Date().toISOString().split("T")[0]
      attendanceData.timestamp = new Date().toISOString()
      attendanceData.type = "attendance"

      offlineData.push(attendanceData)
      localStorage.setItem("offline_data", JSON.stringify(offlineData))

      showToast(`📱 Offline: Attendance queued for ${goatData.goat.ear_tag}`, "warning")
      closeBarcodeScanner()
    }
  } catch (error) {
    console.error("Barcode scan error:", error)
    showToast("Failed to process barcode", "error")
  }
}

async function loadMedicalRecords() {
  try {
    const response = await fetch("api/medical.php")
    const data = await response.json()

    if (data.success) {
      displayMedicalTable(data.medical_logs)
    }
  } catch (error) {
    console.error("Medical records load error:", error)
    showToast("Failed to load medical records", "error")
  }
}

function displayMedicalTable(records) {
  const container = document.getElementById("medical-list")

  if (records.length === 0) {
    container.innerHTML = '<p class="text-center" style="color: #666; padding: 2rem;">No medical records found</p>'
    return
  }

  container.innerHTML = `
        <div class="table-header">Medical Records</div>
        ${records
          .map(
            (record) => `
            <div class="table-row">
                <div class="table-cell">
                    <div class="table-cell-label">Date</div>
                    <div class="table-cell-value">${formatDate(record.treatment_date)}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Goat</div>
                    <div class="table-cell-value">${record.ear_tag} - ${record.goat_name || "N/A"}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Complaint</div>
                    <div class="table-cell-value">${record.complaint}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Treatment</div>
                    <div class="table-cell-value">${record.treatment || "N/A"}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Status</div>
                    <div class="table-cell-value">
                        <span class="status-badge status-${record.recovery_status}">${record.recovery_status}</span>
                    </div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Actions</div>
                    <div class="table-actions">
                        <button class="btn btn-small btn-secondary" onclick="editMedicalRecord(${record.id})">Edit</button>
                    </div>
                </div>
            </div>
        `,
          )
          .join("")}
    `
}

async function loadBreedingRecords() {
  try {
    const response = await fetch("api/breeding.php")
    const data = await response.json()

    if (data.success) {
      displayBreedingTable(data.breeding_records)
    }
  } catch (error) {
    console.error("Breeding records load error:", error)
    showToast("Failed to load breeding records", "error")
  }
}

function displayBreedingTable(records) {
  const container = document.getElementById("breeding-list")

  if (records.length === 0) {
    container.innerHTML = '<p class="text-center" style="color: #666; padding: 2rem;">No breeding records found</p>'
    return
  }

  container.innerHTML = `
        <div class="table-header">Breeding Records</div>
        ${records
          .map(
            (record) => `
            <div class="table-row">
                <div class="table-cell">
                    <div class="table-cell-label">Breeding Date</div>
                    <div class="table-cell-value">${formatDate(record.breeding_date)}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Buck</div>
                    <div class="table-cell-value">${record.buck_ear_tag} - ${record.buck_name || "N/A"}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Doe</div>
                    <div class="table-cell-value">${record.doe_ear_tag} - ${record.doe_name || "N/A"}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Status</div>
                    <div class="table-cell-value">
                        <span class="status-badge status-${record.pregnancy_status}">${record.pregnancy_status}</span>
                    </div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Due Date</div>
                    <div class="table-cell-value">${record.due_date ? formatDate(record.due_date) : "N/A"}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Kids Born</div>
                    <div class="table-cell-value">${record.kids_born || 0}</div>
                </div>
                ${
                  currentUser && currentUser.role === "admin"
                    ? `
                <div class="table-cell">
                    <div class="table-cell-label">Actions</div>
                    <div class="table-actions">
                        <button class="btn btn-small btn-secondary" onclick="editBreedingRecord(${record.id})">Edit</button>
                    </div>
                </div>
                `
                    : ""
                }
            </div>
        `,
          )
          .join("")}
    `
}

async function loadGoats() {
  if (currentUser.role !== "admin") return

  try {
    const response = await fetch("api/goats.php")
    const data = await response.json()

    if (data.success) {
      displayGoatsTable(data.goats)
    }
  } catch (error) {
    console.error("Goats load error:", error)
    showToast("Failed to load goats", "error")
  }
}

function displayGoatsTable(goats) {
  const container = document.getElementById("goats-list")

  if (goats.length === 0) {
    container.innerHTML = '<p class="text-center" style="color: #666; padding: 2rem;">No goats found</p>'
    return
  }

  container.innerHTML = `
        <div class="table-header">Goat Management</div>
        ${goats
          .map(
            (goat) => `
            <div class="table-row">
                <div class="table-cell">
                    <div class="table-cell-label">Ear Tag</div>
                    <div class="table-cell-value">${goat.ear_tag}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Name</div>
                    <div class="table-cell-value">${goat.name || "N/A"}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Breed</div>
                    <div class="table-cell-value">${goat.breed || "N/A"}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Gender</div>
                    <div class="table-cell-value">${goat.gender}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Weight</div>
                    <div class="table-cell-value">${goat.weight ? goat.weight + " kg" : "N/A"}</div>
                </div>
                <div class="table-cell">
                    <div class="table-cell-label">Actions</div>
                    <div class="table-actions">
                        <button class="btn btn-small btn-secondary" onclick="editGoat(${goat.id})">Edit</button>
                        <button class="btn btn-small" style="background: #dc3545; color: white;" onclick="deleteGoat(${goat.id})">Delete</button>
                    </div>
                </div>
            </div>
        `,
          )
          .join("")}
    `
}

function openMedicalForm(recordId = null) {
  const isEdit = recordId !== null
  const title = isEdit ? "Edit Medical Record" : "Add Medical Record"

  const modalBody = document.getElementById("modal-body")
  modalBody.innerHTML = `
        <h2>${title}</h2>
        <form id="medical-form">
            <div class="form-grid">
                <div class="form-group">
                    <label for="medical-goat-select">Select Goat</label>
                    <select id="medical-goat-select" required>
                        <option value="">Loading goats...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="treatment-date">Treatment Date</label>
                    <input type="date" id="treatment-date" required value="${new Date().toISOString().split("T")[0]}">
                </div>
            </div>
            
            <div class="form-group">
                <label for="complaint">Health Complaint</label>
                <textarea id="complaint" required placeholder="Describe the health issue..."></textarea>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label for="treatment">Treatment Given</label>
                    <input type="text" id="treatment" placeholder="Treatment description">
                </div>
                <div class="form-group">
                    <label for="medication">Medication</label>
                    <input type="text" id="medication" placeholder="Medication name">
                </div>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label for="dosage">Dosage</label>
                    <input type="text" id="dosage" placeholder="e.g., 5ml twice daily">
                </div>
                <div class="form-group">
                    <label for="recovery-status">Recovery Status</label>
                    <select id="recovery-status">
                        <option value="ongoing">Ongoing</option>
                        <option value="recovered">Recovered</option>
                        <option value="chronic">Chronic</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label for="medical-notes">Additional Notes</label>
                <textarea id="medical-notes" placeholder="Any additional observations..."></textarea>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? "Update" : "Save"} Record</button>
            </div>
        </form>
    `

  // Load goats for selection
  loadGoatsForSelect("medical-goat-select")

  // Setup form submission
  document.getElementById("medical-form").addEventListener("submit", (e) => {
    e.preventDefault()
    saveMedicalRecord(recordId)
  })

  openModal()
}

function openBreedingForm(recordId = null) {
  if (currentUser.role !== "admin") return

  const isEdit = recordId !== null
  const title = isEdit ? "Edit Breeding Record" : "Add Breeding Record"

  const modalBody = document.getElementById("modal-body")
  modalBody.innerHTML = `
        <h2>${title}</h2>
        <form id="breeding-form">
            <div class="form-grid">
                <div class="form-group">
                    <label for="buck-select">Select Buck</label>
                    <select id="buck-select" required>
                        <option value="">Loading bucks...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="doe-select">Select Doe</label>
                    <select id="doe-select" required>
                        <option value="">Loading does...</option>
                    </select>
                </div>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label for="breeding-date">Breeding Date</label>
                    <input type="date" id="breeding-date" required value="${new Date().toISOString().split("T")[0]}">
                </div>
                <div class="form-group">
                    <label for="pregnancy-status">Pregnancy Status</label>
                    <select id="pregnancy-status">
                        <option value="suspected">Suspected</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="negative">Negative</option>
                    </select>
                </div>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label for="due-date">Expected Due Date</label>
                    <input type="date" id="due-date">
                </div>
                <div class="form-group">
                    <label for="birth-date">Birth Date (if born)</label>
                    <input type="date" id="birth-date">
                </div>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label for="kids-born">Kids Born</label>
                    <input type="number" id="kids-born" min="0" value="0">
                </div>
                <div class="form-group">
                    <label for="kids-survived">Kids Survived</label>
                    <input type="number" id="kids-survived" min="0" value="0">
                </div>
            </div>
            
            <div class="form-group">
                <label for="breeding-notes">Notes</label>
                <textarea id="breeding-notes" placeholder="Any additional notes..."></textarea>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? "Update" : "Save"} Record</button>
            </div>
        </form>
    `

  // Load goats for selection
  loadGoatsForSelect("buck-select", "male")
  loadGoatsForSelect("doe-select", "female")

  // Setup form submission
  document.getElementById("breeding-form").addEventListener("submit", (e) => {
    e.preventDefault()
    saveBreedingRecord(recordId)
  })

  openModal()
}

function openGoatForm(goatId = null) {
  if (currentUser.role !== "admin") return

  const isEdit = goatId !== null
  const title = isEdit ? "Edit Goat" : "Add New Goat"

  const modalBody = document.getElementById("modal-body")
  modalBody.innerHTML = `
        <h2>${title}</h2>
        <form id="goat-form">
            <div class="form-grid">
                <div class="form-group">
                    <label for="ear-tag">Ear Tag *</label>
                    <input type="text" id="ear-tag" required placeholder="e.g., GT001">
                </div>
                <div class="form-group">
                    <label for="barcode">Barcode</label>
                    <input type="text" id="barcode" placeholder="Barcode number">
                </div>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label for="goat-name">Name</label>
                    <input type="text" id="goat-name" placeholder="Goat name">
                </div>
                <div class="form-group">
                    <label for="breed">Breed</label>
                    <input type="text" id="breed" placeholder="e.g., Boer, Nubian">
                </div>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label for="gender">Gender *</label>
                    <select id="gender" required>
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="birth-date">Birth Date</label>
                    <input type="date" id="birth-date">
                </div>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label for="weight">Weight (kg)</label>
                    <input type="number" id="weight" step="0.1" placeholder="Weight in kg">
                </div>
                <div class="form-group">
                    <label for="color">Color</label>
                    <input type="text" id="color" placeholder="e.g., Brown, White">
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? "Update" : "Add"} Goat</button>
            </div>
        </form>
    `

  // Setup form submission
  document.getElementById("goat-form").addEventListener("submit", (e) => {
    e.preventDefault()
    saveGoat(goatId)
  })

  openModal()
}

async function loadGoatsForSelect(selectId, gender = null) {
  try {
    const response = await fetch("api/goats.php")
    const data = await response.json()

    if (data.success) {
      const select = document.getElementById(selectId)
      const filteredGoats = gender ? data.goats.filter((goat) => goat.gender === gender) : data.goats

      select.innerHTML = `
                <option value="">Select goat</option>
                ${filteredGoats
                  .map((goat) => `<option value="${goat.id}">${goat.ear_tag} - ${goat.name || "Unnamed"}</option>`)
                  .join("")}
            `
    }
  } catch (error) {
    console.error("Error loading goats:", error)
  }
}

async function saveMedicalRecord(recordId = null) {
  const formData = {
    goat_id: document.getElementById("medical-goat-select").value,
    complaint: document.getElementById("complaint").value,
    treatment: document.getElementById("treatment").value,
    medication: document.getElementById("medication").value,
    dosage: document.getElementById("dosage").value,
    treatment_date: document.getElementById("treatment-date").value,
    recovery_status: document.getElementById("recovery-status").value,
    notes: document.getElementById("medical-notes").value,
  }

  if (recordId) {
    formData.id = recordId
  }

  try {
    const method = recordId ? "PUT" : "POST"
    const response = await fetch("api/medical.php", {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    const result = await response.json()

    if (result.success) {
      showToast("Medical record saved successfully", "success")
      closeModal()
      loadMedicalRecords()
    } else {
      showToast(result.error, "error")
    }
  } catch (error) {
    console.error("Save medical record error:", error)
    showToast("Failed to save medical record", "error")
  }
}

async function saveBreedingRecord(recordId = null) {
  const formData = {
    buck_id: document.getElementById("buck-select").value,
    doe_id: document.getElementById("doe-select").value,
    breeding_date: document.getElementById("breeding-date").value,
    pregnancy_status: document.getElementById("pregnancy-status").value,
    due_date: document.getElementById("due-date").value || null,
    birth_date: document.getElementById("birth-date").value || null,
    kids_born: document.getElementById("kids-born").value || 0,
    kids_survived: document.getElementById("kids-survived").value || 0,
    notes: document.getElementById("breeding-notes").value,
  }

  if (recordId) {
    formData.id = recordId
  }

  try {
    const method = recordId ? "PUT" : "POST"
    const response = await fetch("api/breeding.php", {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    const result = await response.json()

    if (result.success) {
      showToast("Breeding record saved successfully", "success")
      closeModal()
      loadBreedingRecords()
    } else {
      showToast(result.error, "error")
    }
  } catch (error) {
    console.error("Save breeding record error:", error)
    showToast("Failed to save breeding record", "error")
  }
}

async function saveGoat(goatId = null) {
  const formData = {
    ear_tag: document.getElementById("ear-tag").value,
    barcode: document.getElementById("barcode").value,
    name: document.getElementById("goat-name").value,
    breed: document.getElementById("breed").value,
    gender: document.getElementById("gender").value,
    birth_date: document.getElementById("birth-date").value || null,
    weight: document.getElementById("weight").value || null,
    color: document.getElementById("color").value,
  }

  if (goatId) {
    formData.id = goatId
  }

  try {
    const method = goatId ? "PUT" : "POST"
    const response = await fetch("api/goats.php", {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    const result = await response.json()

    if (result.success) {
      showToast("Goat saved successfully", "success")
      closeModal()
      loadGoats()
    } else {
      showToast(result.error, "error")
    }
  } catch (error) {
    console.error("Save goat error:", error)
    showToast("Failed to save goat", "error")
  }
}

async function handleSync() {
  if (!navigator.onLine) {
    showToast("No internet connection", "warning")
    return
  }

  const syncBtn = document.getElementById("sync-btn")
  const syncIcon = syncBtn.querySelector(".sync-icon")

  syncBtn.classList.add("loading")
  syncIcon.classList.add("spinning")

  try {
    const offlineDataStr = localStorage.getItem("offline_data")
    if (!offlineDataStr) {
      showToast("No offline data to sync", "success")
      return
    }

    const offlineData = JSON.parse(offlineDataStr)

    const response = await fetch("api/sync.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offline_data: offlineData }),
    })

    const result = await response.json()

    if (result.success) {
      localStorage.removeItem("offline_data")
      offlineData.length = 0
      showToast(result.message, "success")
      loadDashboardData()
      if (currentTab === "attendance") loadAttendance()
    } else {
      showToast(result.error, "error")
    }
  } catch (error) {
    console.error("Sync error:", error)
    showToast("Sync failed", "error")
  } finally {
    syncBtn.classList.remove("loading")
    syncIcon.classList.remove("spinning")
  }
}

function exportData(type) {
  if (currentUser.role !== "admin") return

  const url = `api/export.php?type=${type}`
  const link = document.createElement("a")
  link.href = url
  link.download = `${type}_export_${new Date().toISOString().split("T")[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  showToast(`${type} data exported successfully`, "success")
}

function openModal() {
  document.getElementById("modal").classList.add("active")
}

function closeModal() {
  document.getElementById("modal").classList.remove("active")
}

function updateOnlineStatus() {
  const indicator = document.getElementById("offline-indicator")

  if (navigator.onLine) {
    indicator.classList.remove("show")
    // Auto-sync when coming back online
    const offlineDataStr = localStorage.getItem("offline_data")
    if (offlineDataStr && JSON.parse(offlineDataStr).length > 0) {
      setTimeout(handleSync, 1000)
    }
  } else {
    indicator.classList.add("show")
  }
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container")
  const toast = document.createElement("div")
  toast.className = `toast ${type}`
  toast.textContent = message

  container.appendChild(toast)

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 100)

  // Remove after 4 seconds
  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => container.removeChild(toast), 300)
  }, 4000)
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId)
  errorElement.textContent = message
  errorElement.classList.add("show")

  setTimeout(() => {
    errorElement.classList.remove("show")
  }, 5000)
}

function playSuccessSound() {
  // Create a simple success beep
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = 800
  oscillator.type = "sine"

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.3)
}

// Utility functions
function formatDate(dateString) {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString()
}

function formatTime(dateTimeString) {
  if (!dateTimeString) return "N/A"
  return new Date(dateTimeString).toLocaleTimeString()
}

function formatDateTime(dateTimeString) {
  if (!dateTimeString) return "N/A"
  return new Date(dateTimeString).toLocaleString()
}

// Edit functions (placeholders for future implementation)
function editMedicalRecord(id) {
  openMedicalForm(id)
}

function editBreedingRecord(id) {
  openBreedingForm(id)
}

function editGoat(id) {
  openGoatForm(id)
}

async function deleteGoat(id) {
  if (!confirm("Are you sure you want to delete this goat?")) return

  try {
    const response = await fetch("api/goats.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    })

    const result = await response.json()

    if (result.success) {
      showToast("Goat deleted successfully", "success")
      loadGoats()
    } else {
      showToast(result.error, "error")
    }
  } catch (error) {
    console.error("Delete goat error:", error)
    showToast("Failed to delete goat", "error")
  }
}

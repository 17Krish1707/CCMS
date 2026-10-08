/**
 * ============================================================================
 * Court Case Scheduling and Hearing Management System (CCSMS)
 * Software Engineering Lab - Beginner-Friendly Implementation
 * ============================================================================
 */

// ============================================================================
// 1. UML CLASS DEFINITIONS (Consistent with Class Diagram)
// ============================================================================

/**
 * Class representing a Court Case
 */
class Case {
    constructor(caseId, caseNumber, caseType, filingDate, status, description, assignedJudge) {
        this.caseId = caseId;
        this.caseNumber = caseNumber;
        this.caseType = caseType;
        this.filingDate = filingDate;
        this.status = status;           // 'Open', 'Pending', 'Closed'
        this.description = description;
        this.assignedJudge = assignedJudge;
    }
}

/**
 * Class representing a Court Hearing
 */
class Hearing {
    constructor(hearingId, caseId, hearingDate, startTime, endTime, judge, courtroom, purpose, status) {
        this.hearingId = hearingId;
        this.caseId = caseId;
        this.hearingDate = hearingDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.judge = judge;
        this.courtroom = courtroom;
        this.purpose = purpose;
        this.status = status;           // 'Scheduled'
    }
}

// ============================================================================
// 2. IN-MEMORY DATA STORAGE & SAMPLE DATA
// ============================================================================

// In-memory arrays to store cases and hearings
var casesList = [];
var hearingsList = [];

// Counter for auto-generating unique Hearing IDs (e.g., H101, H102...)
var nextHearingNumber = 102;

// Flag to track whether current hearing input passed availability check
var isAvailabilityVerified = false;

/**
 * Load initial sample data as required by the assignment
 */
function loadInitialSampleData() {
    // Sample Case 1
    var case1 = new Case(
        "C001",
        "CC/2026/001",
        "Civil",
        "2026-09-01",
        "Open",
        "Property boundary dispute between parties",
        "Judge Sharma"
    );

    // Sample Case 2
    var case2 = new Case(
        "C002",
        "CC/2026/002",
        "Criminal",
        "2026-09-10",
        "Pending",
        "Theft investigation under Section 378",
        "Judge Mehta"
    );

    casesList.push(case1);
    casesList.push(case2);

    // Sample Hearing (to demonstrate scheduling conflict detection)
    var hearing1 = new Hearing(
        "H101",
        "C001",
        "2026-10-15",
        "10:00",
        "11:00",
        "Judge Sharma",
        "Courtroom 1",
        "Evidence Presentation",
        "Scheduled"
    );

    hearingsList.push(hearing1);
}

// ============================================================================
// 3. TAB NAVIGATION HELPER
// ============================================================================

function switchTab(tabId) {
    // Hide all tab sections
    var contents = document.getElementsByClassName("tab-content");
    for (var i = 0; i < contents.length; i++) {
        contents[i].classList.remove("active");
    }

    // Deactivate all nav buttons
    var buttons = document.getElementsByClassName("nav-btn");
    for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove("active");
    }

    // Activate the chosen tab and corresponding button
    document.getElementById(tabId).classList.add("active");

    if (tabId === "case-management") {
        document.getElementById("tab-case-btn").classList.add("active");
    } else if (tabId === "hearing-scheduling") {
        document.getElementById("tab-schedule-btn").classList.add("active");
    } else if (tabId === "view-hearings") {
        document.getElementById("tab-hearings-btn").classList.add("active");
    }
}

// ============================================================================
// 4. MODULE 1: CASE MANAGEMENT LOGIC
// ============================================================================

/**
 * Handle Add/Register Case Form Submission
 */
function handleCaseSubmit(event) {
    event.preventDefault();

    // 1. Read input values from form
    var caseId = document.getElementById("caseId").value.trim();
    var caseNumber = document.getElementById("caseNumber").value.trim();
    var caseType = document.getElementById("caseType").value;
    var filingDate = document.getElementById("filingDate").value;
    var caseStatus = document.getElementById("caseStatus").value;
    var assignedJudge = document.getElementById("assignedJudge").value;
    var caseDescription = document.getElementById("caseDescription").value.trim();

    // 2. Validate mandatory fields
    if (!caseId || !caseNumber || !caseType || !filingDate || !caseStatus || !assignedJudge) {
        showCaseAlert("Please fill in all required fields.", "danger");
        return;
    }

    // 3. Validate duplicate Case ID
    for (var i = 0; i < casesList.length; i++) {
        if (casesList[i].caseId.toUpperCase() === caseId.toUpperCase()) {
            showCaseAlert("A case with Case ID '" + caseId + "' already exists. Please use a unique ID.", "danger");
            return;
        }
    }

    // 4. Create new Case object (consistent with Class Diagram)
    var newCase = new Case(caseId, caseNumber, caseType, filingDate, caseStatus, caseDescription, assignedJudge);

    // 5. Add to in-memory array
    casesList.push(newCase);

    // 6. Reset form and show success message
    document.getElementById("case-form").reset();
    showCaseAlert("Case " + caseId + " registered successfully!", "success");

    // 7. Update UI tables and dropdowns
    renderCaseTable(casesList);
    populateCaseDropdown();
}

/**
 * Display alert messages in Case Management
 */
function showCaseAlert(message, type) {
    var alertBox = document.getElementById("case-alert");
    alertBox.textContent = message;
    alertBox.className = "alert-box alert-" + type;
    alertBox.classList.remove("hidden");

    // Auto-hide alert after 4 seconds
    setTimeout(function() {
        alertBox.classList.add("hidden");
    }, 4000);
}

/**
 * Render cases in the Case Table
 */
function renderCaseTable(list) {
    var tbody = document.getElementById("case-table-body");
    tbody.innerHTML = "";

    if (list.length === 0) {
        var emptyRow = document.createElement("tr");
        emptyRow.innerHTML = "<td colspan='7' style='text-align:center; color:#777;'>No cases found.</td>";
        tbody.appendChild(emptyRow);
        return;
    }

    for (var i = 0; i < list.length; i++) {
        var c = list[i];
        var tr = document.createElement("tr");

        var badgeClass = "status-open";
        if (c.status === "Pending") badgeClass = "status-pending";
        if (c.status === "Closed") badgeClass = "status-closed";

        tr.innerHTML = 
            "<td><strong>" + escapeHtml(c.caseId) + "</strong></td>" +
            "<td>" + escapeHtml(c.caseNumber) + "</td>" +
            "<td>" + escapeHtml(c.caseType) + "</td>" +
            "<td>" + escapeHtml(c.filingDate) + "</td>" +
            "<td><span class='status-badge " + badgeClass + "'>" + escapeHtml(c.status) + "</span></td>" +
            "<td>" + escapeHtml(c.assignedJudge) + "</td>" +
            "<td>" +
                "<select id='status-select-" + i + "' class='status-select-inline'>" +
                    "<option value='Open'" + (c.status === 'Open' ? " selected" : "") + ">Open</option>" +
                    "<option value='Pending'" + (c.status === 'Pending' ? " selected" : "") + ">Pending</option>" +
                    "<option value='Closed'" + (c.status === 'Closed' ? " selected" : "") + ">Closed</option>" +
                "</select>" +
                "<button class='btn btn-secondary btn-sm' onclick='updateCaseStatus(\"" + c.caseId + "\", " + i + ")'>Update</button>" +
            "</td>";

        tbody.appendChild(tr);
    }
}

/**
 * Update the Status of a Case
 */
function updateCaseStatus(caseId, selectIndex) {
    var selectElement = document.getElementById("status-select-" + selectIndex);
    var newStatus = selectElement.value;

    for (var i = 0; i < casesList.length; i++) {
        if (casesList[i].caseId === caseId) {
            casesList[i].status = newStatus;
            showCaseAlert("Status for Case " + caseId + " updated to '" + newStatus + "'.", "success");
            break;
        }
    }

    // Refresh views
    filterCases();
}

/**
 * Search/Filter Cases by Case ID or Case Number
 */
function filterCases() {
    var query = document.getElementById("case-search-input").value.trim().toLowerCase();
    if (!query) {
        renderCaseTable(casesList);
        return;
    }

    var filtered = [];
    for (var i = 0; i < casesList.length; i++) {
        var c = casesList[i];
        if (c.caseId.toLowerCase().indexOf(query) !== -1 || c.caseNumber.toLowerCase().indexOf(query) !== -1) {
            filtered.push(c);
        }
    }

    renderCaseTable(filtered);
}

/**
 * Reset Case Search
 */
function resetCaseSearch() {
    document.getElementById("case-search-input").value = "";
    renderCaseTable(casesList);
}

/**
 * Populate the Case selection dropdown in Module 2 (Hearing Scheduling)
 */
function populateCaseDropdown() {
    var select = document.getElementById("hearingCaseSelect");
    select.innerHTML = "<option value=''>-- Choose Registered Case --</option>";

    for (var i = 0; i < casesList.length; i++) {
        var c = casesList[i];
        var opt = document.createElement("option");
        opt.value = c.caseId;
        opt.textContent = c.caseId + " - " + c.caseNumber + " (" + c.caseType + ") - " + c.assignedJudge;
        select.appendChild(opt);
    }
}

/**
 * When a case is selected in the scheduling form, automatically pre-select assigned judge
 */
function onCaseSelected() {
    resetAvailabilityCheck();
    var selectedCaseId = document.getElementById("hearingCaseSelect").value;
    if (!selectedCaseId) return;

    for (var i = 0; i < casesList.length; i++) {
        if (casesList[i].caseId === selectedCaseId) {
            // Auto-select the judge assigned to this case
            document.getElementById("hearingJudge").value = casesList[i].assignedJudge;
            break;
        }
    }
}

// ============================================================================
// 5. MODULE 2: HEARING SCHEDULING LOGIC (Consistent with Sequence Diagram)
// ============================================================================

/**
 * Helper to check if two time ranges [s1, e1] and [s2, e2] overlap
 * Format: "HH:MM" (24-hour format)
 */
function isTimeOverlapping(s1, e1, s2, e2) {
    // Overlap condition: start1 < end2 AND start2 < end1
    return (s1 < e2 && s2 < e1);
}

/**
 * Reset the availability check when user changes date, time, judge, or courtroom
 */
function resetAvailabilityCheck() {
    isAvailabilityVerified = false;
    document.getElementById("confirm-schedule-btn").disabled = true;
    var scheduleAlert = document.getElementById("schedule-alert");
    scheduleAlert.classList.add("hidden");
    var notifBox = document.getElementById("simulated-notification");
    notifBox.classList.add("hidden");
}

/**
 * SEQUENCE DIAGRAM STEP 3 & 4: Check Availability of Judge and Courtroom
 */
function checkHearingAvailability() {
    var caseId = document.getElementById("hearingCaseSelect").value;
    var date = document.getElementById("hearingDate").value;
    var startTime = document.getElementById("startTime").value;
    var endTime = document.getElementById("endTime").value;
    var judge = document.getElementById("hearingJudge").value;
    var courtroom = document.getElementById("hearingCourtroom").value;
    var purpose = document.getElementById("hearingPurpose").value.trim();

    // 1. Basic validation
    if (!caseId || !date || !startTime || !endTime || !judge || !courtroom || !purpose) {
        showScheduleAlert("Please enter all hearing details before checking availability.", "danger");
        return;
    }

    if (startTime >= endTime) {
        showScheduleAlert("Start Time must be earlier than End Time.", "danger");
        return;
    }

    // 2. SEQUENCE DIAGRAM STEP 3: Check Judge Availability
    var judgeConflict = false;
    for (var i = 0; i < hearingsList.length; i++) {
        var h = hearingsList[i];
        if (h.hearingDate === date && h.judge === judge) {
            if (isTimeOverlapping(startTime, endTime, h.startTime, h.endTime)) {
                judgeConflict = true;
                break;
            }
        }
    }

    if (judgeConflict) {
        // SEQUENCE DIAGRAM STEP 5: Conflict Detected
        isAvailabilityVerified = false;
        document.getElementById("confirm-schedule-btn").disabled = true;
        showScheduleAlert("Scheduling conflict detected. Reason: Judge unavailable (" + judge + " already has a hearing on " + date + " during this time).", "danger");
        return;
    }

    // 3. SEQUENCE DIAGRAM STEP 4: Check Courtroom Availability
    var courtroomConflict = false;
    for (var j = 0; j < hearingsList.length; j++) {
        var h2 = hearingsList[j];
        if (h2.hearingDate === date && h2.courtroom === courtroom) {
            if (isTimeOverlapping(startTime, endTime, h2.startTime, h2.endTime)) {
                courtroomConflict = true;
                break;
            }
        }
    }

    if (courtroomConflict) {
        // SEQUENCE DIAGRAM STEP 5: Conflict Detected
        isAvailabilityVerified = false;
        document.getElementById("confirm-schedule-btn").disabled = true;
        showScheduleAlert("Scheduling conflict detected. Reason: Courtroom unavailable (" + courtroom + " is already occupied on " + date + " during this time).", "danger");
        return;
    }

    // 4. SEQUENCE DIAGRAM STEP 6: If both available -> Show confirmation and enable scheduling
    isAvailabilityVerified = true;
    document.getElementById("confirm-schedule-btn").disabled = false;
    showScheduleAlert("Judge and Courtroom are available. You may now click 'Confirm & Schedule Hearing'.", "success");
}

/**
 * SEQUENCE DIAGRAM STEP 7 - 12: Confirm & Schedule Hearing
 */
function confirmAndScheduleHearing() {
    if (!isAvailabilityVerified) {
        showScheduleAlert("Please click 'Check Availability' first before confirming.", "danger");
        return;
    }

    // Read form values
    var caseId = document.getElementById("hearingCaseSelect").value;
    var date = document.getElementById("hearingDate").value;
    var startTime = document.getElementById("startTime").value;
    var endTime = document.getElementById("endTime").value;
    var judge = document.getElementById("hearingJudge").value;
    var courtroom = document.getElementById("hearingCourtroom").value;
    var purpose = document.getElementById("hearingPurpose").value.trim();

    // 8. System generates unique Hearing ID
    var hearingId = "H" + nextHearingNumber;
    nextHearingNumber++;

    // 9. System creates Hearing object & sets status to 'Scheduled' (Class Diagram Consistency)
    var status = "Scheduled";
    var newHearing = new Hearing(hearingId, caseId, date, startTime, endTime, judge, courtroom, purpose, status);

    // 10. Store hearing in in-memory array
    hearingsList.push(newHearing);

    // 11. System displays notification message (Simulated Notification)
    var notifBox = document.getElementById("simulated-notification");
    notifBox.textContent = "[Notification Simulation]: Notification sent to Judge, Lawyer, Defendant and Witnesses.";
    notifBox.classList.remove("hidden");

    // 12. System displays scheduling success message
    showScheduleAlert("Hearing " + hearingId + " successfully scheduled for Case " + caseId + "!", "success");

    // Reset verification flag & disable confirmation button
    isAvailabilityVerified = false;
    document.getElementById("confirm-schedule-btn").disabled = true;

    // Refresh hearings table
    renderHearingTable();

    // Reset hearing form after small delay so user sees confirmed details
    setTimeout(function() {
        resetHearingForm();
    }, 4500);
}

/**
 * Display alert messages in Hearing Scheduling
 */
function showScheduleAlert(message, type) {
    var alertBox = document.getElementById("schedule-alert");
    alertBox.textContent = message;
    alertBox.className = "alert-box alert-" + type;
    alertBox.classList.remove("hidden");
}

/**
 * Reset Hearing Scheduling Form
 */
function resetHearingForm() {
    document.getElementById("hearing-form").reset();
    resetAvailabilityCheck();
}

/**
 * Render all scheduled hearings in View Hearings Table
 */
function renderHearingTable() {
    var tbody = document.getElementById("hearing-table-body");
    tbody.innerHTML = "";

    if (hearingsList.length === 0) {
        var emptyRow = document.createElement("tr");
        emptyRow.innerHTML = "<td colspan='8' style='text-align:center; color:#777;'>No hearings scheduled yet.</td>";
        tbody.appendChild(emptyRow);
        return;
    }

    for (var i = 0; i < hearingsList.length; i++) {
        var h = hearingsList[i];
        var tr = document.createElement("tr");

        tr.innerHTML = 
            "<td><strong>" + escapeHtml(h.hearingId) + "</strong></td>" +
            "<td>" + escapeHtml(h.caseId) + "</td>" +
            "<td>" + escapeHtml(h.hearingDate) + "</td>" +
            "<td>" + escapeHtml(h.startTime) + " - " + escapeHtml(h.endTime) + "</td>" +
            "<td>" + escapeHtml(h.judge) + "</td>" +
            "<td>" + escapeHtml(h.courtroom) + "</td>" +
            "<td>" + escapeHtml(h.purpose) + "</td>" +
            "<td><span class='status-badge status-scheduled'>" + escapeHtml(h.status) + "</span></td>";

        tbody.appendChild(tr);
    }
}

// ============================================================================
// 6. UTILITY FUNCTIONS
// ============================================================================

/**
 * Basic HTML escaping to prevent XSS injection in tables
 */
function escapeHtml(text) {
    if (text === null || text === undefined) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ============================================================================
// 7. INITIALIZATION ON PAGE LOAD
// ============================================================================

window.onload = function() {
    // 1. Load initial sample cases and hearing
    loadInitialSampleData();

    // 2. Render initial tables
    renderCaseTable(casesList);
    renderHearingTable();

    // 3. Populate dropdowns
    populateCaseDropdown();
};

# Court Case Scheduling and Hearing Management System (CCSMS)

A lightweight, beginner-friendly web application developed for the Software Engineering Lab (SE Experiment). It implements two core modules—**Case Management** and **Hearing Scheduling**—with strict consistency to UML Class, Sequence, and Activity diagrams.

---

## 📌 Features

### Module 1: Case Management
- **Register Case**: Input Case ID, Case Number, Type, Filing Date, Status, Assigned Judge, and Description.
- **Validation**: Checks for mandatory fields and ensures unique Case IDs.
- **View Cases**: Table displaying all registered cases with color-coded status badges.
- **Search Cases**: Real-time filtering by Case ID or Case Number.
- **Update Case Status**: Inline status modification (`Open`, `Pending`, `Closed`).

### Module 2: Hearing Scheduling
- **Select Registered Case**: Dropdown automatically lists active cases and links assigned judges.
- **Availability Verification**:
  - Checks if the assigned Judge is free on the chosen date and time window.
  - Checks if the designated Courtroom is unoccupied on the chosen date and time window.
  - Specific conflict alerts prevent double-booking.
- **Hearing Creation**: Auto-generates unique Hearing IDs (`H101`, `H102`, ...) and marks status as `Scheduled`.
- **View Hearings**: Interactive schedule overview table.
- **Simulated Notification**: Broadcasts simulated alerts to Judge, Lawyer, Defendant, and Witnesses.

---

## 🏗️ Architecture & UML Consistency

### Class Diagram Mapping
- `Case`: Encapsulates `caseId`, `caseNumber`, `caseType`, `filingDate`, `status`, `description`, `assignedJudge`.
- `Hearing`: Encapsulates `hearingId`, `caseId`, `hearingDate`, `startTime`, `endTime`, `judge`, `courtroom`, `purpose`, `status`.

### Sequence Diagram Flow
1. Clerk selects case and enters hearing timing.
2. System executes Judge availability check.
3. System executes Courtroom availability check.
4. Conflict handling: If busy, flags conflict reason; if free, unlocks confirmation.
5. Clerk confirms &rarr; System instantiates `Hearing`, assigns ID, sets status to `Scheduled`.
6. System renders simulated notification and updates the records table.

---

## 🚀 How to Run

1. Clone this repository:
   ```bash
   git clone https://github.com/17Krish1707/CCMS.git
   ```
2. Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox).
3. No build tools, Node.js, databases, or web servers required.

---

## 📂 File Structure
```text
├── index.html    # Dashboard UI, forms, tables & navigation tabs
├── style.css     # Clean, responsive styles
├── script.js     # ES6 classes, in-memory arrays & conflict detection logic
└── README.md     # Project documentation
```

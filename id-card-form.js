const cardTypes = [
  {
    id: "school",
    title: "School ID card",
    subtypes: ["Student card", "Staff card"],
    desc: "Student / staff",
    required: ["School name", "Student / staff name", "Class & section", "Roll number", "Blood group", "Date of birth", "Parent's name", "Parent's contact number"],
    optional: ["Home address", "Bus route number", "Academic year"]
  },
  {
    id: "college",
    title: "College ID card",
    subtypes: ["Student card", "Faculty card"],
    desc: "Student / faculty",
    required: ["College name", "Student / faculty name", "Department", "Course & year", "Register / roll number", "Blood group", "Date of birth"],
    optional: ["Email ID", "Phone number", "Academic year", "RFID / barcode number"]
  },
  {
    id: "company",
    title: "Company ID card",
    subtypes: ["Employee card", "Visitor card"],
    desc: "Employee / visitor",
    required: ["Company name", "Employee name", "Designation", "Department", "Employee ID number", "Date of joining"],
    optional: ["Phone / extension", "Email ID", "Blood group", "Office address", "RFID / barcode number"]
  },
  {
    id: "hospital",
    title: "Hospital ID card",
    subtypes: ["Doctor", "Nurse", "Staff", "Patient"],
    desc: "Doctor / nurse / staff / patient",
    required: ["Hospital name", "Staff / patient name", "Role / designation", "Department", "Registration number", "Blood group"],
    optional: ["Phone number", "Emergency contact", "Ward / bed number (patient)", "Validity date"]
  },
  {
    id: "govt",
    title: "Govt / Dept ID card",
    subtypes: ["Officer", "Clerk", "Field staff"],
    desc: "Officer / clerk / field staff",
    required: ["Department / office name", "Officer / staff name", "Designation", "Employee / ID number", "Issue date", "Issuing authority name"],
    optional: ["Blood group", "Phone number", "Office address", "Validity / expiry date"]
  },
  {
    id: "gym",
    title: "Gym / Club membership",
    subtypes: ["Member card"],
    desc: "Member card",
    required: ["Gym / club name", "Member name", "Member ID number", "Membership type", "Valid from date", "Valid till / expiry date"],
    optional: ["Phone number", "Emergency contact", "Blood group", "Trainer name"]
  },
  {
    id: "library",
    title: "Library membership",
    subtypes: ["Member card"],
    desc: "Member card",
    required: ["Library name", "Member name", "Member ID number", "Issue date", "Expiry date"],
    optional: ["Phone number", "Home address", "Maximum books allowed", "Barcode number"]
  },
  {
    id: "security",
    title: "Security guard ID",
    subtypes: ["Guard / patrol staff"],
    desc: "Guard / patrol staff",
    required: ["Company / agency name", "Guard name", "Guard ID number", "Post / location"],
    optional: ["Blood group", "Validity date", "Shift timing", "Emergency contact"]
  },
  {
    id: "event",
    title: "Event pass / Visitor card",
    subtypes: ["Visitor", "Delegate", "Media pass"],
    desc: "Visitor / delegate / media",
    required: ["Event name", "Visitor / delegate name", "Pass type", "Organisation / company", "Event date", "Venue"],
    optional: ["Pass ID / serial number", "Access zones allowed", "Contact number", "QR code link"]
  }
];

let selectedCardType = null;

// Initialize Step 1
function init() {
  const grid = document.getElementById('cardTypeGrid');
  if (!grid) return;
  grid.innerHTML = '';
  cardTypes.forEach(ct => {
    const tile = document.createElement('div');
    tile.className = 'card-type-tile';
    tile.id = `tile-${ct.id}`;
    tile.innerHTML = `<h4>${ct.title}</h4><p>${ct.desc}</p>`;
    tile.onclick = () => selectCardType(ct.id);
    grid.appendChild(tile);
  });
}

function selectCardType(id) {
  document.querySelectorAll('.card-type-tile').forEach(el => el.classList.remove('selected'));
  document.getElementById(`tile-${id}`).classList.add('selected');
  selectedCardType = cardTypes.find(c => c.id === id);
}

function renderDynamicFields() {
  const container = document.getElementById('dynamicFieldsContainer');
  container.innerHTML = '';
  if (!selectedCardType) return;
  
  document.getElementById('selectedCardTypeDisplay').textContent = selectedCardType.title;

  // Subtype
  if (selectedCardType.subtypes && selectedCardType.subtypes.length > 0) {
    let options = selectedCardType.subtypes.map(st => `<option value="${st}">${st}</option>`).join('');
    container.innerHTML += `
      <div class="form-group">
        <label>Sub-type <span style="color:red;">*</span></label>
        <select class="form-control" id="dyn_subtype" required>
          ${options}
        </select>
      </div>
    `;
  }

  container.innerHTML += `<h4 style="margin-top: 20px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Required Fields</h4>`;
  selectedCardType.required.forEach((field, idx) => {
    container.innerHTML += `
      <div class="form-group">
        <label>${field} <span style="color:red;">*</span></label>
        <input type="${field.toLowerCase().includes('date') ? 'date' : 'text'}" class="form-control dyn-req" id="dyn_req_${idx}" data-name="${field}">
      </div>
    `;
  });

  if (selectedCardType.optional && selectedCardType.optional.length > 0) {
    container.innerHTML += `<h4 style="margin-top: 20px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Optional Fields</h4>`;
    selectedCardType.optional.forEach((field, idx) => {
      container.innerHTML += `
        <div class="form-group">
          <label>${field}</label>
          <input type="${field.toLowerCase().includes('date') ? 'date' : 'text'}" class="form-control dyn-opt" id="dyn_opt_${idx}" data-name="${field}">
        </div>
      `;
    });
  }
}

function validateStep(step) {
  if (step === 1) {
    if (!selectedCardType) {
      alert("Please select a card type to continue.");
      return false;
    }
    renderDynamicFields();
    return true;
  }
  if (step === 2) {
    let valid = true;
    document.querySelectorAll('.dyn-req').forEach(input => {
      if (!input.value.trim()) valid = false;
    });
    if (!valid) {
      alert("Please fill all required fields before continuing.");
      return false;
    }
    return true;
  }
  if (step === 5) { // validate step 5 elements before submission
    const num = document.getElementById('cf_contact_number').value.trim();
    if (!num) {
      alert("Please provide your contact number.");
      return false;
    }
    return true;
  }
  return true;
}

function nextStep(toStep) {
  if (!validateStep(toStep - 1)) return;
  
  if (toStep === 5) {
    generateSummary();
  }

  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  document.getElementById(`step-${toStep}`).classList.add('active');
  updateDots(toStep);
}

function prevStep(toStep) {
  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  document.getElementById(`step-${toStep}`).classList.add('active');
  updateDots(toStep);
}

function updateDots(activeStep) {
  document.querySelectorAll('.step-dot').forEach((el, idx) => {
    el.classList.remove('active', 'completed');
    if (idx + 1 < activeStep) el.classList.add('completed');
    else if (idx + 1 === activeStep) el.classList.add('active');
  });
}

function generateSummary() {
  const box = document.getElementById('summaryBox');
  let html = ``;

  const addRow = (label, value) => {
    if(value) {
      html += `<div class="summary-item"><div class="summary-label">${label}</div><div class="summary-value">${value}</div></div>`;
    }
  };

  html += `<h5>1. Card Type</h5>`;
  addRow("Selected Type", selectedCardType.title);
  const subtypeEl = document.getElementById('dyn_subtype');
  if (subtypeEl) addRow("Sub-type", subtypeEl.value);

  html += `<h5 style="margin-top: 15px;">2. Type-specific Fields</h5>`;
  document.querySelectorAll('.dyn-req').forEach(input => addRow(input.getAttribute('data-name'), input.value));
  document.querySelectorAll('.dyn-opt').forEach(input => addRow(input.getAttribute('data-name'), input.value));

  html += `<h5 style="margin-top: 15px;">3. Common Fields</h5>`;
  const photo = document.getElementById('cf_photo').files.length > 0 ? "Uploaded" : "Not uploaded";
  const logo = document.getElementById('cf_logo').files.length > 0 ? "Uploaded" : "Not uploaded";
  addRow("Photo", photo);
  addRow("Organisation Logo", logo);
  addRow("Card Size", document.getElementById('cf_size').value);
  addRow("Lamination", document.getElementById('cf_lamination').value);
  addRow("Lanyard Hole", document.getElementById('cf_lanyard').value);
  addRow("Quantity", document.getElementById('cf_quantity').value);

  html += `<h5 style="margin-top: 15px;">4. Extra Information</h5>`;
  addRow("Additional Notes", document.getElementById('cf_extra').value || "None");

  html += `<h5 style="margin-top: 15px;">5. Order Details</h5>`;
  addRow("Delivery/Pickup", document.getElementById('cf_delivery').value);
  addRow("Urgency", document.getElementById('cf_urgency').value);
  addRow("Contact Number", document.getElementById('cf_contact_number').value);

  box.innerHTML = html;
}

function submitToWhatsApp() {
  if (!validateStep(5)) return;

  let msg = `*New ID Card Order*\n\n`;
  msg += `*Card Type:* ${selectedCardType.title}\n`;
  const subtypeEl = document.getElementById('dyn_subtype');
  if (subtypeEl) msg += `*Sub-type:* ${subtypeEl.value}\n`;
  
  msg += `\n*Details:*\n`;
  document.querySelectorAll('.dyn-req').forEach(input => {
    msg += `- ${input.getAttribute('data-name')}: ${input.value}\n`;
  });
  document.querySelectorAll('.dyn-opt').forEach(input => {
    if(input.value) msg += `- ${input.getAttribute('data-name')}: ${input.value}\n`;
  });

  msg += `\n*Options:*\n`;
  msg += `- Size: ${document.getElementById('cf_size').value}\n`;
  msg += `- Lamination: ${document.getElementById('cf_lamination').value}\n`;
  msg += `- Lanyard Hole: ${document.getElementById('cf_lanyard').value}\n`;
  msg += `- Quantity: ${document.getElementById('cf_quantity').value}\n`;

  const extra = document.getElementById('cf_extra').value;
  if (extra) {
    msg += `\n*Extra Info:*\n${extra}\n`;
  }

  msg += `\n*Order Specs:*\n`;
  msg += `- Delivery: ${document.getElementById('cf_delivery').value}\n`;
  msg += `- Urgency: ${document.getElementById('cf_urgency').value}\n`;
  msg += `- Customer Contact: ${document.getElementById('cf_contact_number').value}\n`;

  const encodedMsg = encodeURIComponent(msg);
  window.open(`https://wa.me/919894133193?text=${encodedMsg}`, '_blank');
}

// Init on load
document.addEventListener('DOMContentLoaded', init);

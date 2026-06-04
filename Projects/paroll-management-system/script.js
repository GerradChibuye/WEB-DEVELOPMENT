// ─── State ───────────────────────────────────────────────────────────────────

let employees = [
  { id:1, fname:'Gerrad',    lname:'Chibuye', dept:'IT',        role:'Senior DevOps Engineer',  salary:22500, bonus:1500, date:'2026-05-01', status:'Active' },
  { id:2, fname:'Choolwe',     lname:'Sichundu',  dept:'IT',             role:'Software Engineer',  salary:19000, bonus:2000, date:'2026-05-01', status:'Active' },
  { id:3, fname:'Chanda', lname:'Malisawa',  dept:'Human Resources',role:'HR Manager',         salary:16000, bonus:1000, date:'2026-05-01', status:'Active' },
  { id:4, fname:'Shawa',    lname:'Getrude',  dept:'Sales',          role:'Sales Executive',    salary:10500, bonus:3000, date:'2026-05-01', status:'Active' },
  { id:5, fname:'Moses',   lname:'Kibela',  dept:'Operations',     role:'Operations Officer', salary:12000, bonus:500,  date:'2026-05-01', status:'Inactive' },
];

let settings = { napsa: 5, nhima: 1, company: 'GTECH-INNOVATIONS' };
let editingId = null;
let nextId = 6;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = n =>
  'ZMW ' + Number(n).toLocaleString('en-ZM', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function calcPAYE(monthly) {
  if (monthly <= 4800) return 0;
  const limits = [4800, 9200, 15200, Infinity];
  const rates  = [0, 0.20, 0.30, 0.375];
  let tax = 0, prev = 4800;
  for (let i = 1; i < limits.length; i++) {
    if (monthly <= prev) break;
    tax += (Math.min(monthly, limits[i]) - prev) * rates[i];
    prev = limits[i];
    if (monthly <= limits[i]) break;
  }
  return tax;
}

function calcDeductions(emp) {
  const gross = emp.salary + emp.bonus;
  const napsa = gross * (settings.napsa / 100);
  const nhima = gross * (settings.nhima / 100);
  const paye  = calcPAYE(gross);
  const net   = gross - napsa - nhima - paye;
  return { gross, napsa, nhima, paye, net };
}

function initials(e) { return e.fname[0] + e.lname[0]; }

// ─── Navigation ──────────────────────────────────────────────────────────────

function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  el.classList.add('active');
  if (id === 'dashboard') renderDashboard();
  if (id === 'employees') renderEmployeeTable();
  if (id === 'payroll')   renderPayrollTable();
  if (id === 'payslips')  renderPayslipSelector();
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function renderDashboard() {
  const active = employees.filter(e => e.status === 'Active');
  const totalGross = active.reduce((s, e) => s + e.salary + e.bonus, 0);
  const totalNet   = active.reduce((s, e) => s + calcDeductions(e).net, 0);
  const avgSalary  = active.length ? totalGross / active.length : 0;

  document.getElementById('dash-metrics').innerHTML = `
    <div class="metric-card">
      <div class="metric-label">Total employees</div>
      <div class="metric-value">${employees.length}</div>
      <div class="metric-sub">${active.length} active</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Monthly payroll</div>
      <div class="metric-value" style="font-size:17px;">${fmt(totalGross)}</div>
      <div class="metric-sub">Gross total</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Net payroll</div>
      <div class="metric-value" style="font-size:17px;">${fmt(totalNet)}</div>
      <div class="metric-sub">After deductions</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Avg. gross salary</div>
      <div class="metric-value" style="font-size:17px;">${fmt(avgSalary)}</div>
      <div class="metric-sub">Active employees</div>
    </div>`;

  // Department breakdown
  const depts = {};
  active.forEach(e => { depts[e.dept] = (depts[e.dept] || 0) + e.salary + e.bonus; });
  document.getElementById('dept-breakdown').innerHTML =
    Object.entries(depts).sort((a, b) => b[1] - a[1]).map(([d, v]) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:0.5px solid rgba(0,0,0,0.1);font-size:13px;">
        <span>${d}</span><span style="font-weight:500;">${fmt(v)}</span>
      </div>`).join('') || '<div class="empty-state">No data</div>';

  // Recent employees
  const recent = [...employees].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  document.getElementById('recent-employees').innerHTML = recent.map(e => `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:0.5px solid rgba(0,0,0,0.1);">
      <div style="width:32px;height:32px;border-radius:50%;background:#e6f1fb;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;color:#185fa5;flex-shrink:0;">${initials(e)}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${e.fname} ${e.lname}</div>
        <div style="font-size:11px;color:#666;">${e.role}</div>
      </div>
      <span class="badge ${e.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${e.status}</span>
    </div>`).join('');
}

// ─── Employees ───────────────────────────────────────────────────────────────

function renderEmployeeTable() {
  const tb = document.getElementById('employee-table');
  if (!employees.length) {
    tb.innerHTML = '<tr><td colspan="6"><div class="empty-state">No employees. Click "+ Add employee" to get started.</div></td></tr>';
    return;
  }
  tb.innerHTML = employees.map(e => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:28px;height:28px;border-radius:50%;background:#e6f1fb;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500;color:#185fa5;flex-shrink:0;">${initials(e)}</div>
          <span style="font-weight:500;">${e.fname} ${e.lname}</span>
        </div>
      </td>
      <td>${e.dept}</td>
      <td>${e.role}</td>
      <td>${fmt(e.salary + e.bonus)}</td>
      <td><span class="badge ${e.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${e.status}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm" onclick="editEmployee(${e.id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${e.id})">Delete</button>
        </div>
      </td>
    </tr>`).join('');
}

// ─── Payroll ─────────────────────────────────────────────────────────────────

function renderPayrollTable() {
  const active = employees.filter(e => e.status === 'Active');
  const tb = document.getElementById('payroll-table');
  if (!active.length) {
    tb.innerHTML = '<tr><td colspan="7"><div class="empty-state">No active employees found.</div></td></tr>';
    document.getElementById('payroll-totals').innerHTML = '';
    return;
  }
  let tGross = 0, tNapsa = 0, tNhima = 0, tPaye = 0, tNet = 0;
  tb.innerHTML = active.map(e => {
    const d = calcDeductions(e);
    tGross += d.gross; tNapsa += d.napsa; tNhima += d.nhima; tPaye += d.paye; tNet += d.net;
    return `<tr>
      <td><span style="font-weight:500;">${e.fname} ${e.lname}</span></td>
      <td>${e.dept}</td>
      <td>${fmt(d.gross)}</td>
      <td style="color:#a32d2d;">${fmt(d.napsa)}</td>
      <td style="color:#a32d2d;">${fmt(d.nhima)}</td>
      <td style="color:#a32d2d;">${fmt(d.paye)}</td>
      <td style="font-weight:500;color:#3b6d11;">${fmt(d.net)}</td>
    </tr>`;
  }).join('');

  document.getElementById('payroll-totals').innerHTML = `
    <div style="display:flex;gap:1rem;flex-wrap:wrap;">
      <div class="metric-card"><div class="metric-label">Total gross</div><div class="metric-value" style="font-size:16px;">${fmt(tGross)}</div></div>
      <div class="metric-card"><div class="metric-label">Total NAPSA</div><div class="metric-value" style="font-size:16px;">${fmt(tNapsa)}</div></div>
      <div class="metric-card"><div class="metric-label">Total NHIMA</div><div class="metric-value" style="font-size:16px;">${fmt(tNhima)}</div></div>
      <div class="metric-card"><div class="metric-label">Total PAYE</div><div class="metric-value" style="font-size:16px;">${fmt(tPaye)}</div></div>
      <div class="metric-card" style="background:#eaf3de;">
        <div class="metric-label" style="color:#3b6d11;">Total net pay</div>
        <div class="metric-value" style="font-size:16px;color:#3b6d11;">${fmt(tNet)}</div>
      </div>
    </div>`;
}

function runPayroll() {
  const month = document.getElementById('payroll-month').value;
  const year  = document.getElementById('payroll-year').value;
  const alert = document.getElementById('payroll-alert');
  const count = employees.filter(e => e.status === 'Active').length;
  alert.innerHTML = `<div class="alert alert-success">Payroll for ${month} ${year} processed successfully. ${count} employees paid.</div>`;
  setTimeout(() => alert.innerHTML = '', 4000);
  renderPayrollTable();
}

// ─── Payslips ────────────────────────────────────────────────────────────────

function renderPayslipSelector() {
  const sel = document.getElementById('slip-employee');
  const cur = sel.value;
  sel.innerHTML = '<option value="">Select employee...</option>' +
    employees.map(e => `<option value="${e.id}">${e.fname} ${e.lname}</option>`).join('');
  if (cur) sel.value = cur;
  document.getElementById('payslip-output').innerHTML = '';
}

function generatePayslip() {
  const eid   = parseInt(document.getElementById('slip-employee').value);
  const month = document.getElementById('slip-month').value;
  const year  = document.getElementById('slip-year').value;
  const out   = document.getElementById('payslip-output');

  if (!eid) { out.innerHTML = '<div class="alert alert-info">Please select an employee.</div>'; return; }

  const e = employees.find(x => x.id === eid);
  const d = calcDeductions(e);

  out.innerHTML = `
    <div class="payslip" id="print-slip">
      <div class="payslip-header">
        <div>
          <div class="payslip-company">${settings.company}</div>
          <div style="font-size:12px;color:#666;margin-top:2px;">Pay period: ${month} ${year}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:500;">${e.fname} ${e.lname}</div>
          <div style="font-size:12px;color:#666;">${e.role} &mdash; ${e.dept}</div>
        </div>
      </div>
      <div class="section-label">Earnings</div>
      <div class="payslip-row"><span>Basic salary</span><span>${fmt(e.salary)}</span></div>
      <div class="payslip-row"><span>Bonus / allowance</span><span>${fmt(e.bonus)}</span></div>
      <div class="payslip-row" style="font-weight:500;border-top:0.5px solid rgba(0,0,0,0.1);padding-top:6px;"><span>Gross pay</span><span>${fmt(d.gross)}</span></div>
      <div class="section-label">Deductions</div>
      <div class="payslip-row"><span>NAPSA (${settings.napsa}%)</span><span style="color:#a32d2d;">&minus; ${fmt(d.napsa)}</span></div>
      <div class="payslip-row"><span>NHIMA (${settings.nhima}%)</span><span style="color:#a32d2d;">&minus; ${fmt(d.nhima)}</span></div>
      <div class="payslip-row"><span>PAYE income tax</span><span style="color:#a32d2d;">&minus; ${fmt(d.paye)}</span></div>
      <div class="payslip-total"><span>Net pay</span><span style="color:#3b6d11;">${fmt(d.net)}</span></div>
      <div style="margin-top:1rem;font-size:11px;color:#666;text-align:center;">This payslip is computer-generated and valid without signature.</div>
    </div>
    <div style="display:flex;gap:8px;margin-top:1rem;">
      <button class="btn" onclick="window.print()">Print payslip</button>
    </div>`;
}

// ─── Settings ────────────────────────────────────────────────────────────────

function saveSettings() {
  settings.napsa   = parseFloat(document.getElementById('set-napsa').value)   || 5;
  settings.nhima   = parseFloat(document.getElementById('set-nhima').value)   || 1;
  settings.company = document.getElementById('set-company').value.trim()      || 'Zambia Corp Ltd';
  const a = document.getElementById('settings-alert');
  a.innerHTML = '<div class="alert alert-success">Settings saved successfully.</div>';
  setTimeout(() => a.innerHTML = '', 3000);
}

// ─── Employee Modal ───────────────────────────────────────────────────────────

function openEmployeeModal(id = null) {
  editingId = id;
  document.getElementById('modal-title').textContent = id ? 'Edit employee' : 'Add employee';
  if (id) {
    const e = employees.find(x => x.id === id);
    document.getElementById('f-fname').value  = e.fname;
    document.getElementById('f-lname').value  = e.lname;
    document.getElementById('f-dept').value   = e.dept;
    document.getElementById('f-role').value   = e.role;
    document.getElementById('f-salary').value = e.salary;
    document.getElementById('f-bonus').value  = e.bonus;
    document.getElementById('f-date').value   = e.date;
    document.getElementById('f-status').value = e.status;
  } else {
    ['f-fname','f-lname','f-role','f-salary'].forEach(f => document.getElementById(f).value = '');
    document.getElementById('f-bonus').value = '0';
    document.getElementById('f-date').value  = new Date().toISOString().split('T')[0];
    document.getElementById('f-status').value = 'Active';
  }
  document.getElementById('emp-modal').classList.add('open');
}

function editEmployee(id) { openEmployeeModal(id); }

function closeModal() {
  document.getElementById('emp-modal').classList.remove('open');
  editingId = null;
}

function saveEmployee() {
  const fname  = document.getElementById('f-fname').value.trim();
  const lname  = document.getElementById('f-lname').value.trim();
  const salary = parseFloat(document.getElementById('f-salary').value) || 0;
  if (!fname || !lname || !salary) { alert('Please fill in name and salary.'); return; }

  const emp = {
    id:     editingId || nextId++,
    fname,  lname,
    dept:   document.getElementById('f-dept').value,
    role:   document.getElementById('f-role').value.trim() || 'Staff',
    salary,
    bonus:  parseFloat(document.getElementById('f-bonus').value) || 0,
    date:   document.getElementById('f-date').value,
    status: document.getElementById('f-status').value,
  };

  if (editingId) {
    employees[employees.findIndex(e => e.id === editingId)] = emp;
  } else {
    employees.push(emp);
  }
  closeModal();
  renderEmployeeTable();
  renderDashboard();
}

function deleteEmployee(id) {
  if (!confirm('Delete this employee?')) return;
  employees = employees.filter(e => e.id !== id);
  renderEmployeeTable();
  renderDashboard();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
renderDashboard();
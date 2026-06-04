# GTECH Payroll Management System

A modern, web-based payroll management system designed for organizations to streamline employee and payroll administration. Built with vanilla HTML, CSS, and JavaScript.

## 📋 Features

### Dashboard
- **At-a-glance metrics**: Total employees, monthly payroll, net payroll, and average gross salary
- **Department breakdown**: View payroll distribution across departments
- **Recent employees**: Track newly added staff members

### Employee Management
- Add, edit, and delete employee records
- Track employee details including:
  - Name and department
  - Job title and gross salary
  - Performance bonus/allowance
  - Employment start date
  - Active/Inactive status

### Payroll Processing
- Run payroll for any month and year
- Automatic deduction calculations including:
  - **NAPSA** (5% by default)
  - **NHIMA** (1% by default)
  - **PAYE** (Progressive income tax based on Zambia 2024 tax bands)
- View payroll summary with total gross, net, and all deductions
- Real-time calculation of tax obligations

### Payslips
- Generate individual payslips for any employee and period
- Professional payslip layout with:
  - Employee and company details
  - Earnings breakdown (salary + bonus)
  - Deductions itemization
  - Net pay calculation
- Print-ready payslip format

### Settings
- Customize NAPSA and NHIMA contribution rates
- Update company name
- View Zambia PAYE tax bands reference (2024)

## 🏗️ Tax Calculation

The system applies **Zambia PAYE tax bands (2024)** automatically:

| Monthly Income (ZMW) | Tax Rate |
|---|---|
| Up to 4,800 | 0% (exempt) |
| 4,801 – 9,200 | 20% |
| 9,201 – 15,200 | 30% |
| Above 15,200 | 37.5% |

## 💾 Technical Details

### File Structure
```
paroll-management-system/
├── index.html          # Main HTML structure
├── style.css           # Styling and layout
├── script.js           # Application logic
└── README.md           # Documentation
```

### Technologies
- **HTML5**: Semantic structure
- **CSS3**: Responsive design with flexbox and grid
- **Vanilla JavaScript**: Client-side state management and calculations

### Data Storage
- Employee and settings data stored in browser memory (localStorage-ready)
- Default sample data included for demonstration

## 🚀 Getting Started

1. **Open the application**: Simply open `index.html` in a modern web browser
2. **View the dashboard**: Get an overview of payroll metrics
3. **Add employees**: Use the "+ Add employee" button in the Employees tab
4. **Run payroll**: Navigate to Payroll tab and select month/year, then click "Run payroll"
5. **Generate payslips**: Select an employee and period to generate a payslip
6. **Customize settings**: Update tax rates and company details in Settings tab

## 👥 Sample Data

The system comes with 5 sample employees:

| Name | Department | Role | Status |
|---|---|---|---|
| Gerrad Chibuye | IT | Senior DevOps Engineer | Active |
| Choolwe Sichundu | IT | Software Engineer | Active |
| Chanda Malisawa | Human Resources | HR Manager | Active |
| Shawa Getrude | Sales | Sales Executive | Active |
| Moses Kibela | Operations | Operations Officer | Inactive |

## 🎨 Design Highlights

- **Clean interface**: Intuitive sidebar navigation
- **Responsive layout**: Flexbox-based grid system
- **Professional styling**: Consistent color scheme and typography
- **Status badges**: Visual indicators for employee status
- **Print-optimized**: Payslips formatted for printing

## 📊 Currency

All monetary values are displayed in **ZMW (Zambian Kwacha)** with proper formatting and two decimal places.

## 🔧 Customization

### Change Default Settings
Edit `script.js` to modify:
- Default NAPSA rate: `settings.napsa = 5`
- Default NHIMA rate: `settings.nhima = 1`
- Company name: `settings.company = 'GTECH-INNOVATIONS'`

### Add Departments
Modify the department dropdown in the employee modal (HTML):
```html
<select id="f-dept">
  <option>Finance</option>
  <option>Human Resources</option>
  <!-- Add more departments here -->
</select>
```

## 📱 Browser Compatibility

Works on all modern browsers supporting:
- ES6 JavaScript
- CSS Grid & Flexbox
- HTML5 LocalStorage (optional for persistence)

## 📝 Future Enhancements

Potential features for future versions:
- Data persistence (localStorage or backend database)
- Employee leave tracking
- Performance reviews integration
- Automated email payslip delivery
- Monthly payroll audit reports
- Multi-currency support
- Role-based access control
- Export to PDF/Excel

## 📄 License

This project is part of the WEB-DEVELOPMENT portfolio.

## 👨‍💼 Developer

Created by **Gerrad Chibuye**

---

**Version**: 1.0  
**Last Updated**: June 2026  
**Status**: Production Ready

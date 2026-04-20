import React from "react";

const COMPANIES = [
  "All", "Google", "Amazon", "Flipkart", "Paytm", "Microsoft", "Netflix", "Adobe", "Apple"
];

function CompanyFilter({ activeCompany, onSelect }) {
  return (
    <div className="company-filter-strip">
      <div className="company-scroll">
        {COMPANIES.map((company) => (
          <button
            key={company}
            className={`company-pill ${activeCompany === company ? "active" : ""}`}
            onClick={() => onSelect(company)}
          >
            {company === "All" ? "🌐 All" : company}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CompanyFilter;

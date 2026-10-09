export interface TaxDeadline {
  id: string;
  jurisdiction: "US" | "IN";
  label: string;
  applicableYear: string;
  dueDate: string; // ISO string format YYYY-MM-DD
  quarter?: string;
  description: string;
  sourceUrl: string;
  lastVerifiedDate: string;
  verificationStatus: "verified" | "needs_verification";
  caveat?: string;
}

export const TAX_DEADLINES: TaxDeadline[] = [
  // United States (IRS Quarterly Estimated Tax Payments)
  {
    id: "us-2025-q1",
    jurisdiction: "US",
    label: "Q1 Estimated Tax Payment (1040-ES)",
    applicableYear: "2025",
    dueDate: "2025-04-15",
    quarter: "Q1",
    description: "Federal estimated income tax payment for income earned Jan 1 – Mar 31.",
    sourceUrl: "https://www.irs.gov/faqs/estimated-tax",
    lastVerifiedDate: "2025-01-10",
    verificationStatus: "verified",
    caveat: "If April 15 falls on a weekend or holiday, deadline moves to next business day.",
  },
  {
    id: "us-2025-q2",
    jurisdiction: "US",
    label: "Q2 Estimated Tax Payment (1040-ES)",
    applicableYear: "2025",
    dueDate: "2025-06-16",
    quarter: "Q2",
    description: "Federal estimated income tax payment for income earned Apr 1 – May 31.",
    sourceUrl: "https://www.irs.gov/faqs/estimated-tax",
    lastVerifiedDate: "2025-01-10",
    verificationStatus: "verified",
    caveat: "June 15 falls on Sunday; moves to Monday June 16.",
  },
  {
    id: "us-2025-q3",
    jurisdiction: "US",
    label: "Q3 Estimated Tax Payment (1040-ES)",
    applicableYear: "2025",
    dueDate: "2025-09-15",
    quarter: "Q3",
    description: "Federal estimated income tax payment for income earned Jun 1 – Aug 31.",
    sourceUrl: "https://www.irs.gov/faqs/estimated-tax",
    lastVerifiedDate: "2025-01-10",
    verificationStatus: "verified",
  },
  {
    id: "us-2025-q4",
    jurisdiction: "US",
    label: "Q4 Estimated Tax Payment (1040-ES)",
    applicableYear: "2025",
    dueDate: "2026-01-15",
    quarter: "Q4",
    description: "Federal estimated income tax payment for income earned Sep 1 – Dec 31.",
    sourceUrl: "https://www.irs.gov/faqs/estimated-tax",
    lastVerifiedDate: "2025-01-10",
    verificationStatus: "verified",
  },
  {
    id: "us-2026-q1",
    jurisdiction: "US",
    label: "Q1 Estimated Tax Payment (1040-ES)",
    applicableYear: "2026",
    dueDate: "2026-04-15",
    quarter: "Q1",
    description: "Federal estimated tax for income earned Jan 1 – Mar 31, 2026.",
    sourceUrl: "https://www.irs.gov/faqs/estimated-tax",
    lastVerifiedDate: "2025-01-10",
    verificationStatus: "verified",
  },

  // India (Income Tax Department - Advance Tax Installments)
  {
    id: "in-2025-q1",
    jurisdiction: "IN",
    label: "1st Advance Tax Installment (15%)",
    applicableYear: "FY 2025-26",
    dueDate: "2025-06-15",
    quarter: "Q1",
    description: "First installment of advance tax: not less than 15% of total tax liability.",
    sourceUrl: "https://incometaxindia.gov.in/Pages/deadline.aspx",
    lastVerifiedDate: "2025-01-10",
    verificationStatus: "verified",
    caveat: "Applies if estimated tax liability exceeds ₹10,000 for the fiscal year.",
  },
  {
    id: "in-2025-q2",
    jurisdiction: "IN",
    label: "2nd Advance Tax Installment (45%)",
    applicableYear: "FY 2025-26",
    dueDate: "2025-09-15",
    quarter: "Q2",
    description: "Second installment of advance tax: cumulative 45% of total tax liability.",
    sourceUrl: "https://incometaxindia.gov.in/Pages/deadline.aspx",
    lastVerifiedDate: "2025-01-10",
    verificationStatus: "verified",
  },
  {
    id: "in-2025-q3",
    jurisdiction: "IN",
    label: "3rd Advance Tax Installment (75%)",
    applicableYear: "FY 2025-26",
    dueDate: "2025-12-15",
    quarter: "Q3",
    description: "Third installment of advance tax: cumulative 75% of total tax liability.",
    sourceUrl: "https://incometaxindia.gov.in/Pages/deadline.aspx",
    lastVerifiedDate: "2025-01-10",
    verificationStatus: "verified",
  },
  {
    id: "in-2025-q4",
    jurisdiction: "IN",
    label: "4th Advance Tax Installment (100%)",
    applicableYear: "FY 2025-26",
    dueDate: "2026-03-15",
    quarter: "Q4",
    description: "Final installment of advance tax: 100% of assessed tax liability.",
    sourceUrl: "https://incometaxindia.gov.in/Pages/deadline.aspx",
    lastVerifiedDate: "2025-01-10",
    verificationStatus: "verified",
  },
  {
    id: "in-2025-itr",
    jurisdiction: "IN",
    label: "Individual ITR Filing Deadline",
    applicableYear: "AY 2025-26",
    dueDate: "2025-07-31",
    description: "Annual Income Tax Return filing deadline for non-audit individual taxpayers.",
    sourceUrl: "https://incometaxindia.gov.in/Pages/deadline.aspx",
    lastVerifiedDate: "2025-01-10",
    verificationStatus: "verified",
  },
];

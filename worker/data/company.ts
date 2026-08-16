export type CompanyRecord = {
  company_code: string;
  company_name_ciphertext: string;
  company_name_iv: string;
  encryption_version: number;
  is_active: 0 | 1;
};

export type Company = {
  companyCode: string;
  companyName: string;
  isActive: boolean;
};

export function toCompany(record: CompanyRecord, companyName: string): Company {
  return {
    companyCode: record.company_code,
    companyName,
    isActive: record.is_active === 1,
  };
}

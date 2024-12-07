export interface CompanyInfo {
  name: string;
  cnpj: string;
  state: string;
  regime: string;
}

export interface TaxQuery {
  product: string;
  operationType: string;
}

export interface TaxInfo {
  pis: string;
  cofins: string;
  icms: string;
  cfop: string;
  cest: string;
  ipi: string;
  ncm: string;
}
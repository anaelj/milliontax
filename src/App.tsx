import React, { useState } from "react";
import { Building2, FileText } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { CompanyForm } from "./components/CompanyForm";
import { TaxQueryForm } from "./components/TaxQueryForm";
import { TaxInfo } from "./components/TaxInfo";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { getTaxInformation } from "./services/openai";
import { useRateLimiter } from "./utils/rateLimiter";
import type { CompanyInfo, TaxInfo as TaxInfoType } from "./types";

// const mock = JSON.parse(
//   `{
//     "PIS": {
//         "aliquota": "0,65%"
//     },
//     "COFINS": {
//         "aliquota": "3,00%"
//     },
//     "ICMS": {
//         "aliquota": "17%"
//     },
//     "CFOP": "5101",
//     "CEST": "17.014.00",
//     "IPI": {
//         "aliquota": "0%"
//     },
//     "NCM": "8525.80.00"
// }`.toLowerCase()
// );

function App() {
  const [companyInfo, setCompanyInfo] = useLocalStorage<CompanyInfo>(
    "companyInfo",
    {
      name: "",
      cnpj: "",
      state: "",
      regime: "",
    }
  );

  const [showCompanyForm, setShowCompanyForm] = useState(!companyInfo.name);
  const [isLoading, setIsLoading] = useState(false);
  const [taxInfo, setTaxInfo] = useState<TaxInfoType | null>();
  const { isWaiting, waitForNextWindow } = useRateLimiter();

  const handleCompanySubmit = (info: CompanyInfo) => {
    setCompanyInfo(info);
    setShowCompanyForm(false);
    toast.success("Informações da empresa salvas com sucesso!");
  };

  const handleTaxQuery = async (query: {
    product: string;
    operationType: string;
  }) => {
    setIsLoading(true);
    try {
      await waitForNextWindow();
      const result = await getTaxInformation(companyInfo, query);
      setTaxInfo(result);
      toast.success("Informações tributárias obtidas com sucesso!");
    } catch (error) {
      if (error instanceof Error && error.message !== "RATE_LIMIT_EXCEEDED") {
        toast.error("Erro ao obter informações tributárias");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Consulta Tributária
          </h1>
          <p className="text-gray-600">
            Sistema de consulta de informações tributárias via ChatGPT
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Informações da Empresa</h2>
            </div>
            {showCompanyForm ? (
              <CompanyForm
                companyInfo={companyInfo}
                onSave={handleCompanySubmit}
              />
            ) : (
              <div className="space-y-2">
                <p>
                  <strong>Nome:</strong> {companyInfo.name}
                </p>
                <p>
                  <strong>CNPJ:</strong> {companyInfo.cnpj}
                </p>
                <p>
                  <strong>Estado:</strong> {companyInfo.state}
                </p>
                <p>
                  <strong>Regime:</strong> {companyInfo.regime}
                </p>
                <button
                  onClick={() => setShowCompanyForm(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Editar informações
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">Consulta de Produto</h2>
            </div>
            <TaxQueryForm
              onSubmit={handleTaxQuery}
              isLoading={isLoading || isWaiting}
            />
          </div>
        </div>

        {taxInfo && (
          <div className="mt-8">
            <TaxInfo taxInfo={taxInfo} />
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;

import React from "react";
import { TaxInfo as TaxInfoType } from "../types";

interface TaxInfoProps {
  taxInfo: TaxInfoType | null;
}

export function TaxInfo({ taxInfo }: TaxInfoProps) {
  if (!taxInfo) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Informações Tributárias</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">PIS</p>
          <p className="text-lg">{taxInfo.pis}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">COFINS</p>
          <p className="text-lg">{taxInfo.cofins}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">ICMS</p>
          <p className="text-lg">{taxInfo.icms}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">CFOP</p>
          <p className="text-lg">{taxInfo.cfop}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">CEST</p>
          <p className="text-lg">{taxInfo.cest}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">IPI</p>
          <p className="text-lg">{taxInfo.ipi}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">NCM</p>
          <p className="text-lg">{taxInfo.ncm}</p>
        </div>
      </div>
    </div>
  );
}

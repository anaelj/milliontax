import React from 'react';
import { CompanyInfo } from '../types';

interface CompanyFormProps {
  companyInfo: CompanyInfo;
  onSave: (info: CompanyInfo) => void;
}

export function CompanyForm({ companyInfo, onSave }: CompanyFormProps) {
  const [formData, setFormData] = React.useState(companyInfo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">CNPJ</label>
        <input
          type="text"
          name="cnpj"
          value={formData.cnpj}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Regime Tributário</label>
        <select
          name="regime"
          value={formData.regime}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Selecione...</option>
          <option value="Simples Nacional">Simples Nacional</option>
          <option value="Lucro Presumido">Lucro Presumido</option>
          <option value="Lucro Real">Lucro Real</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Salvar Informações
      </button>
    </form>
  );
}
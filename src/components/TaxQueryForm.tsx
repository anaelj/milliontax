import React from 'react';
import { TaxQuery } from '../types';

interface TaxQueryFormProps {
  onSubmit: (query: TaxQuery) => void;
  isLoading: boolean;
}

export function TaxQueryForm({ onSubmit, isLoading }: TaxQueryFormProps) {
  const [formData, setFormData] = React.useState<TaxQuery>({
    product: '',
    operationType: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
        <label className="block text-sm font-medium text-gray-700">Produto</label>
        <input
          type="text"
          name="product"
          value={formData.product}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de Operação</label>
        <select
          name="operationType"
          value={formData.operationType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Selecione...</option>
          <option value="Venda">Venda</option>
          <option value="Compra">Compra</option>
          <option value="Transferência">Transferência</option>
          <option value="Devolução">Devolução</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Consultando...' : 'Consultar Informações'}
      </button>
    </form>
  );
}
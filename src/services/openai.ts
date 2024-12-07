import OpenAI from "openai";
import { CompanyInfo, TaxQuery } from "../types";
import { rateLimiter } from "../utils/rateLimiter";
import { retry } from "../utils/retry";
import toast from "react-hot-toast";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getTaxInformation(
  companyInfo: CompanyInfo,
  query: TaxQuery
) {
  if (!rateLimiter.canMakeRequest()) {
    const waitTime = rateLimiter.getTimeUntilNextWindow();
    toast.error(
      `Limite de requisições atingido. Aguarde ${Math.ceil(
        waitTime / 1000
      )} segundos.`
    );
    throw new Error("RATE_LIMIT_EXCEEDED");
  }

  const prompt = `
    Como especialista tributário, forneça informações fiscais para a seguinte situação:
    
    Empresa:
    - Nome: ${companyInfo.name}
    - CNPJ: ${companyInfo.cnpj}
    - Estado: ${companyInfo.state}
    - Regime Tributário: ${companyInfo.regime}
    
    Produto: ${query.product}
    Tipo de Operação: ${query.operationType}
    
    Por favor, forneça as seguintes informações em formato JSON:
    - Alíquotas de PIS e COFINS
    - Alíquota de ICMS
    - CFOP
    - CEST
    - IPI
    - NCM

    Retorne apenas o json, sem comentários, neste formato

    {
      "pis": "x%",
      "cofins": "x%"
      "icms": "x%"
      "cfop": "xxxx",
      "cest": "xx.xxx.xx",
      "ipi": "x%",
      "ncm": "xxxx.xx.xx"
    }
  `;

  try {
    function extractJSON(input: string) {
      const start = input.indexOf("{");
      const end = input.lastIndexOf("}");

      if (start === -1 || end === -1) {
        throw new Error("JSON não encontrado na string.");
      }

      // Extrai o JSON
      const jsonString = input.slice(start, end + 1);

      // Converte para objeto
      try {
        return JSON.parse(jsonString.toLowerCase());
      } catch (error) {
        console.error("Erro ao converter JSON:", error);
        return null;
      }
    }

    const result = await retry(
      async () => {
        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          // model: 'gpt-3.5-turbo',
          model: "gpt-4o-mini",
        });

        rateLimiter.logRequest();
        const response = completion.choices[0].message.content;
        console.log(response);

        const jsonObject = extractJSON(response || "{}");

        console.log(jsonObject);

        return jsonObject;
      },
      {
        retryCount: 1,
        onRetry: (error, attempt) => {
          toast.error(`Tentativa ${attempt}/3 falhou. Tentando novamente...`);
        },
      }
    );

    return result;
  } catch (error) {
    console.error("Error fetching tax information:", error);
    if (error instanceof Error) {
      if (error.message === "RATE_LIMIT_EXCEEDED") {
        throw error;
      }
      toast.error("Erro ao obter informações. Tente novamente mais tarde.");
    }
    throw error;
  }
}

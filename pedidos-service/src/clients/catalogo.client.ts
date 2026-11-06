
import { ReservaEstoque } from "../types";
import { AppError } from "../errors/AppError";

export async function reservarEstoque(
  produtoId: number,
  quantidade: number
): Promise<ReservaEstoque> {

  const CATALOG_URL = process.env.CATALOG_URL;

  if (!CATALOG_URL) {
    throw new AppError(
      "CATALOG_URL não configurada",
      500,
      "CONFIGURACAO_INVALIDA"
    );
  }

  try {
    const resposta = await fetch(
      `${CATALOG_URL}/produtos/${produtoId}/reservas`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ quantidade })
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      if ([400, 404, 409].includes(resposta.status)) {
        throw new AppError(
          dados?.mensagem ?? "Falha ao reservar estoque",
          resposta.status,
          dados?.codigo ?? "ERRO_RESERVA"
        );
      }

      throw new AppError(
        "Catálogo indisponível",
        502,
        "CATALOGO_INDISPONIVEL"
      );
    }

    if (
      dados?.produtoId !== produtoId ||
      dados?.reservado !== quantidade ||
      !Number.isFinite(dados?.precoUnitario) ||
      dados.precoUnitario < 0
    ) {
      throw new AppError(
        "Resposta inválida do Catálogo",
        502,
        "RESPOSTA_INVALIDA"
      );
    }

    return dados as ReservaEstoque;

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Catálogo indisponível",
      502,
      "CATALOGO_INDISPONIVEL"
    );
  }
}

import { efibank } from "./efi-bank";
import { createId } from "@paralleldrive/cuid2";
import { EFI_PIX_CHAVE } from "./env.server";

/**
 * Transfer money to a pix key.
 *
 * @param favorecido - The recipient of the pix payment.
 * @param value - The amount to be paid in Brazilian Real (BRL).
 */
export async function payPix(
  favorecido: {
    chave?: string;
    contaBanco?: {
      nome: string;
      cpf?: string;
      cnpj?: string;
      codigoBanco: string;
      agencia: string;
      conta: string;
      tipoConta: string;
    };
    cpf?: string;
    cnpj?: string;
  },
  value: number
) {
  const result = await efibank.pixSend(
    {
      idEnvio: createId(),
    },
    {
      valor: value.toFixed(2),
      pagador: {
        chave: EFI_PIX_CHAVE,
      },
      favorecido,
    }
  );

  return result;
}

import { http } from "msw";

const BASE_URL = "https://pix.api.efipay.com.br";

export const efiBankHandlers = [
  // authorize request
  http.post(`${BASE_URL}/oauth/token`, () => {
    return Response.json({
      access_token: "mock_access_token",
      token_type: "Bearer",
      expires_in: 3600,
      scope: "pix.write pix.read",
    });
  }),

  // send pix request
  http.put(`${BASE_URL}/v2/gn/pix/:id`, async ({ request }) => {
    const body = (await request.json()) as { valor: string };

    return Response.json({
      idEnvio: crypto.randomUUID().replace(/-/g, ""),
      e2eId: `E${Math.random().toString().slice(2, 12)}${new Date()
        .toISOString()
        .replace(/[-:]/g, "")}API${Math.random().toString().slice(2, 11)}`,
      valor: body.valor,
      horario: { solicitacao: new Date().toISOString() },
      status: "EM_PROCESSAMENTO",
    });
  }),
];

import { createOrder } from "@/lib/api";
import { environment } from "@/lib/config";
import type { OrderRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequest;
    const result = await createOrder(body);

    return new Response(JSON.stringify({ ...result, environment }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

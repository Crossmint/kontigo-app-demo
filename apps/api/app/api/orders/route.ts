import { createOrder, type OrderRequest } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequest;
    const result = await createOrder(body);

    return new Response(JSON.stringify(result), {
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

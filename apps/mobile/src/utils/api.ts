import type { OrderRequest, OrderResponse } from "@/src/types/checkout";
import { apiUrl } from "@/src/utils/config";

export const createOrder = async (
  orderData: OrderRequest
): Promise<OrderResponse> => {
  const response = await fetch(`${apiUrl}orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create order: ${JSON.stringify(errorData)}`);
  }

  return response.json();
};

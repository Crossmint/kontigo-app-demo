import { apiKey, ordersBaseUrl } from "@/lib/config";

export type OrderRequest = {
  recipient: {
    walletAddress: string;
  };
  payment: {
    method: string;
    receiptEmail: string;
  };
  lineItems: {
    tokenLocator: string;
    executionParameters: {
      mode: string;
      amount: string;
      maxSlippageBps: string;
    };
  };
};

export type OrderResponse = {
  clientSecret: string;
  order: {
    orderId: string;
  };
};

export const createOrder = async (
  orderData: OrderRequest
): Promise<OrderResponse> => {
  const response = await fetch(ordersBaseUrl, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
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

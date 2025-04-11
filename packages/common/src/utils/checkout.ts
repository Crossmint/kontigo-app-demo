import type {
  CheckoutOptions,
  OrderRequest,
  OrderResponse,
} from "../types/checkout";
import {
  checkoutProdBaseUrl,
  checkoutStagingBaseUrl,
  sdkMetadata,
} from "./config";

export const defaultCheckoutOptions: CheckoutOptions = {
  locale: "es-ES",
  appearance: {
    variables: {
      colors: {
        accent: "#FA7500",
      },
    },
    rules: {
      PrimaryButton: {
        colors: {
          background: "#FA7500",
        },
        hover: {
          colors: {
            background: "#FA7500",
          },
        },
      },
      ReceiptEmailInput: {
        display: "hidden",
      },
      DestinationInput: {
        display: "hidden",
      },
    },
  },
  recipient: {
    walletAddress: "0x188554D8Db23AB47e07f61c427Acd4FE1dd6dFf7",
  },
  lineItems: {
    tokenLocator:
      "base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    executionParameters: {
      mode: "exact-in",
      amount: "1",
      maxSlippageBps: "500",
    },
  },
  payment: {
    crypto: {
      enabled: false,
    },
    fiat: {
      enabled: true,
      allowedMethods: {
        card: true,
        applePay: false,
        googlePay: false,
      },
    },
    method: "checkoutcom-flow",
    defaultMethod: "fiat",
    receiptEmail: "robin@crossmint.com",
  },
};

// client
export const createOrder = async (
  apiUrl: string,
  orderData: OrderRequest
): Promise<OrderResponse> => {
  const response = await fetch(apiUrl, {
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

export const generateCheckoutUrl = async (
  apiUrl: string,
  options: CheckoutOptions
): Promise<string> => {
  const order = await createOrder(apiUrl, options);

  const baseUrl =
    order.environment === "production"
      ? checkoutProdBaseUrl
      : checkoutStagingBaseUrl;

  const params = new URLSearchParams({
    locale: options.locale,
    orderId: order.order.orderId,
    clientSecret: order.clientSecret,
    recipient: JSON.stringify(options.recipient),
    payment: JSON.stringify(options.payment),
    appearance: JSON.stringify(options.appearance),
    sdkMetadata: JSON.stringify(sdkMetadata),
    lineItems: JSON.stringify(options.lineItems),
  });

  return `${baseUrl}?${params.toString()}`;
};

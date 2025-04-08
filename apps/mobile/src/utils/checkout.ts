import type { CheckoutOptions } from "@/src/types/checkout";
import { createOrder } from "@/src/utils/api";
import {
  checkoutProdBaseUrl,
  checkoutStagingBaseUrl,
  sdkMetadata,
} from "@/src/utils/config";

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
    walletAddress: "EbXL4e6XgbcC7s33cD5EZtyn5nixRDsieBjPQB7zf448",
  },
  lineItems: {
    tokenLocator: "solana:6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
    executionParameters: {
      mode: "exact-in",
      amount: "100",
      maxSlippageBps: "500",
    },
  },
  payment: {
    crypto: {
      enabled: false,
    },
    fiat: {
      enabled: true,
    },
    defaultMethod: "fiat",
    receiptEmail: "robin@crossmint.com",
  },
};

export const generateCheckoutUrl = async (
  options: CheckoutOptions
): Promise<string> => {
  const order = await createOrder({
    recipient: options.recipient,
    lineItems: options.lineItems,
    payment: {
      method: "checkoutcom-flow",
      receiptEmail: options.payment.receiptEmail,
    },
  });

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

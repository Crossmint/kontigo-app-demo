import { checkoutBaseUrl, sdkMetadata } from "@/src/utils/config";

export interface Appearance {
  variables?: Record<string, unknown>;
  rules?: Record<string, unknown>;
}

export interface Recipient {
  walletAddress: string;
}

export interface LineItems {
  tokenLocator: string;
  executionParameters: {
    mode: string;
    amount: string;
    maxSlippageBps: string;
  };
}

export interface Payment {
  crypto: {
    enabled: boolean;
  };
  fiat: {
    enabled: boolean;
  };
  defaultMethod: "fiat" | "crypto";
  receiptEmail: string;
}

export interface CheckoutOptions {
  appearance: Appearance;
  recipient: Recipient;
  lineItems: LineItems;
  payment: Payment;
  locale: string;
}

export const buildCrossmintCheckoutURL = (options: CheckoutOptions): string => {
  const params = new URLSearchParams();

  params.set("locale", options.locale);
  params.set("payment", JSON.stringify(options.payment));
  params.set("lineItems", JSON.stringify(options.lineItems));
  params.set("recipient", JSON.stringify(options.recipient));
  params.set("appearance", JSON.stringify(options.appearance));
  params.set("apiKey", "");
  params.set("sdkMetadata", JSON.stringify(sdkMetadata));

  return `${checkoutBaseUrl}?${params.toString()}`;
};

export type Appearance = {
  variables?: Record<string, unknown>;
  rules?: Record<string, unknown>;
};

export type Recipient = {
  walletAddress: string;
};

export type LineItems = {
  tokenLocator: string;
  executionParameters: {
    mode: string;
    amount: string;
    maxSlippageBps: string;
  };
};

export type Payment = {
  crypto: {
    enabled: boolean;
  };
  fiat: {
    enabled: boolean;
  };
  method: string;
  defaultMethod: "fiat" | "crypto";
  receiptEmail: string;
};

export type CheckoutOptions = {
  appearance: Appearance;
  recipient: Recipient;
  lineItems: LineItems;
  payment: Payment;
  locale: string;
};

export type OrderRequest = {
  locale: string;
  recipient: Recipient;
  lineItems: LineItems;
  payment: {
    method: string;
    receiptEmail: string;
  };
};

export type OrderResponse = {
  clientSecret: string;
  order: {
    orderId: string;
  };
  environment: "production" | "staging";
};

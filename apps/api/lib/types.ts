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
  environment: "production" | "staging";
};

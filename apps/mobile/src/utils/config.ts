export const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "";

if (!apiUrl) {
  throw new Error("EXPO_PUBLIC_API_URL is not set");
}

export const checkoutProdBaseUrl =
  "https://www.crossmint.com/sdk/2024-03-05/embedded-checkout";

export const checkoutStagingBaseUrl =
  "https://staging.crossmint.com/sdk/2024-03-05/embedded-checkout";

export const sdkMetadata = {
  name: "@crossmint/client-sdk-react-ui",
  version: "1.17.0",
};

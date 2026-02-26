// import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { IS_DOMAIN_PRODUCTION } from "src/util/service";
import { defineChain } from "viem";
import { walletConnect } from "wagmi/connectors";

const chain = bsc;
export const BSC_CHAIN_ID = chain.id;

export const network = 56;

export const heweChain = defineChain({
  id: 999999,
  name: "AmChain",
  nativeCurrency: { name: "AMC", symbol: "AMC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://node1.amchain.net"] },
  },
  blockExplorers: {
    default: { name: "AmChain Explorer", url: "https://explorer.amchain.net/" },
  },
});

// export const config = createConfig(
//   getDefaultConfig({
//     chains: [chain, heweChain],
//     transports: {
//       [chain.id]: http(chain.rpcUrls.default.http[0]),
//       [heweChain.id]: http(heweChain.rpcUrls.default.http[0]),
//     },
//     walletConnectProjectId: "9e580cc438a1b04ff55f174f88b7ac51",
//     appName: "HEWE",
//     appDescription: "HEWE",
//     appUrl: "https://hewe.io",
//   })
// );

export const config = createConfig({
  chains: [chain],
  transports: {
    [chain.id]: http(chain.rpcUrls.default.http[0]),
    // [heweChain.id]: http(heweChain.rpcUrls.default.http[0]),
  },
  walletConnectProjectId: "9e580cc438a1b04ff55f174f88b7ac51",
  appName: "HEWE",
  appDescription: "HEWE",
  appUrl: "https://hewe.io",
  connectors: [
    walletConnect({
      projectId: "d83c03ef1ff988a40e2383430776eef6",
      showQrModal: false,
    }),
  ],
});

export const HEWE_CHAIN_ID = heweChain.id;

// export const configHEWE = createConfig(
//   getDefaultConfig({
//     chains: [heweChain],
//     transports: {
//       [heweChain.id]: http(heweChain.rpcUrls.default.http[0]),
//     },
//     walletConnectProjectId: "9e580cc438a1b04ff55f174f88b7ac51",
//     appName: "HEWE",
//     appDescription: "HEWE",
//     appUrl: "https://hewe.io",
//   })
// );

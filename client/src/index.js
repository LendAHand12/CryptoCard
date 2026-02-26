import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/configStore";
import i18n from "./translation/i18n";
import { I18nextProvider } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/scss/style.scss";
import "./assets/theme/antd-customized.css";
import "./index.scss";
import { MainAccountProvider } from "./context/main-account";
import { config } from "./web3/config";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";

const queryClient = new QueryClient();

const projectId = "d83c03ef1ff988a40e2383430776eef6";

createWeb3Modal({
  wagmiConfig: config,
  projectId: projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <I18nextProvider i18n={i18n}>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MainAccountProvider>
            <App />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable={false}
              pauseOnHover
              theme="dark"
            />
          </MainAccountProvider>
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  </I18nextProvider>
);

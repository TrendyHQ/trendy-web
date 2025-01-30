import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "../vite-env.d.ts";
import App from "./App";

const domain: string = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId: string = import.meta.env.VITE_AUTH0_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>
);

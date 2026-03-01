import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/Authcontext";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}
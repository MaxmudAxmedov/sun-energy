import "./App.css";
import { Toaster } from "./components/ui/sonner";
import RootProviders from "./providers/RootProviders";

function App() {
  return (
    <div>
      <RootProviders />
      <Toaster position="top-center" richColors/>
    </div>
  );
}

export default App;

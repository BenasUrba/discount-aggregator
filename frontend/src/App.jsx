import Home from "./pages/Home";
import { SavedProductsProvider } from "./context/SavedProductsContext";

function App() {

  return (
    <SavedProductsProvider>
        <div className="min-h-screen bg-gray-100">
          <Home/>
        </div>
    </SavedProductsProvider>
  )
}

export default App

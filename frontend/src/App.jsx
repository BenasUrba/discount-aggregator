import './index.css';
import Home from "./pages/home";
import Hero from "./components/Hero";
const API_URL = import.meta.env.VITE_API_URL;

const stores = ["All Stores", "Lidl", "IKI", "Maxima", "Rimi"]

function App() {

  const handleSelectStore = async (store) => {
    console.log(`Selected Store: ${store}`);
    const response = await fetch(`${API_URL}/api/products?store=${store}`); 
    
    return response.json()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Hero
        stores={stores}
        onSelectStore={handleSelectStore}
      />
    </div>
  )
}

export default App

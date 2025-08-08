import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Navigation/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Admin from './pages/Admin/Admin';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Quotation from './pages/Quotation/Quotation';
import Login from './pages/Auth/Login';

const AppContent = () => {
  return (
    <Router future={{ v7_startTransition: true }}>
      <div className="min-h-screen flex flex-col bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Catalog />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/cotizacion" element={<Quotation />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
};

export default App;

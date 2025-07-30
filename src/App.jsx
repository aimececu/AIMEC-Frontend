import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Navigation/Footer';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Admin from './pages/Admin/Admin';
import ProductDetail from './pages/ProductDetail/ProductDetail';

const AppContent = () => {
  return (
    <Router future={{ v7_startTransition: true }}>
      <div className="min-h-screen flex flex-col bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
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
      <AppContent />
    </CustomThemeProvider>
  );
};

export default App;

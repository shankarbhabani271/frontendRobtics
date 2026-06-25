import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import HomePage from "./pages/Home/HomePage";
import ShopByCategory from "./components/ShopByCategory";
import FeaturedProducts from "./components/FeaturedProducts/FeaturedProducts";
import LatestNewsEvents from "./components/LatestNewsEvents/LatestNewsEvents";
import RoboticsInstructors from "./components/RoboticsInstructors/RoboticsInstructors";
import Testimonials from "./components/Testimonials/Testimonials";
import RoboticsVideosSection from "./components/RoboticsVideos/RoboticsVideosSection";
import TrustedOrganizations from "./components/TrustedOrganizations/TrustedOrganizations";
import VisitOurOffice from "./components/VisitOurOffice/VisitOurOffice";
import Footer from './components/common/Footer';
import CookieConsent from "./pages/CookieConsent/CookieConsent";
import ProductDetailsPage from "./pages/ProductDetails";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import CategoriesPage from "./pages/Categories";
import CategoryProductsPage from "./pages/CategoryProducts";
import ProductsPage from "./pages/Products";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import GalleryPage from "./pages/Gallery/GalleryPage";
import RoboticsVideosPage from "./pages/RoboticsVideos/RoboticsVideosPage";

import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

import SuperAdminDashboard from "./pages/Dashboard/SuperAdminDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import UserDashboard from "./pages/Dashboard/UserDashboard";

const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="flex flex-col min-h-screen bg-gray-50 text-slate-800 overflow-x-hidden">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <HomePage />
                  <ShopByCategory />
                  <FeaturedProducts />
                  <RoboticsInstructors />
                  <LatestNewsEvents />
                  <Testimonials />
                  <RoboticsVideosSection />
                  <TrustedOrganizations />
                  <VisitOurOffice />
                </>
              } />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/robotics-videos" element={<RoboticsVideosPage />} />

              {/* Protected Role-Based Routes */}
              <Route 
                path="/superadmin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={["superadmin"]}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <CookieConsent />
        </div>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;

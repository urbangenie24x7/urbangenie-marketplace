import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/modules/cart/context/CartContext";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import Index from "./pages/Index";
import Services from "./modules/services/pages/Services";
import ServiceDetail from "./modules/services/pages/ServiceDetail";
import Cart from "./modules/cart/pages/Cart";
import Checkout from "./modules/cart/pages/Checkout";
import Payment from "./modules/payments/pages/Payment";
import OrderConfirmation from "./modules/orders/pages/OrderConfirmation";
import CustomerProfile from "./modules/user/pages/CustomerProfile";
import Login from "./modules/auth/pages/Login";
import AuthDemo from "./modules/auth/pages/AuthDemo";
import WriteReview from "./modules/reviews/pages/WriteReview";
import ServiceReviews from "./modules/reviews/pages/ServiceReviews";
import AdminLayout from "./modules/admin/pages/AdminLayout";
import AdminDashboard from "./modules/admin/pages/AdminDashboard";
import AdminOrders from "./modules/admin/pages/AdminOrders";
import AdminVendors from "./modules/admin/pages/AdminVendors";
import AdminServices from "./modules/admin/pages/AdminServices";
import AdminUsers from "./modules/admin/pages/AdminUsers";
import AdminRoles from "./modules/admin/pages/AdminRoles";
import AdminMasterData from "./modules/admin/pages/AdminMasterData";
import AuthSetup from "./modules/admin/pages/AuthSetup";
import IntegrationTesting from "./modules/admin/pages/IntegrationTesting";
import FirebaseTest from "./modules/admin/pages/FirebaseTest";
import VendorOnboarding from "./modules/vendor/pages/VendorOnboarding";
import VendorLogin from "./modules/vendor/pages/VendorLogin";
import VendorDashboard from "./modules/vendor/pages/VendorDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth-demo" element={<AuthDemo />} />
          <Route path="/write-review" element={<WriteReview />} />
          <Route path="/service/:serviceId/reviews" element={<ServiceReviews />} />
          <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="vendors" element={<AdminVendors />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="master-data" element={<AdminMasterData />} />
            <Route path="auth-setup" element={<AuthSetup />} />
            <Route path="integrations" element={<IntegrationTesting />} />
            <Route path="firebase" element={<FirebaseTest />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import EventsList from "./pages/EventsList";
import EventDetails from "./pages/EventDetails";
import TicketSelection from "./pages/TicketSelection";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SellerLogin from "./pages/auth/SellerLogin";
import AdminLogin from "./pages/auth/AdminLogin";

import RoleProtectedRoute from "./components/RoleProtectedRoute";

import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerAddTicket from "./pages/seller/SellerAddTicket";
import SellerMyTickets from "./pages/seller/SellerMyTickets";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminOrders from "./pages/admin/AdminOrders";
import Profile from "./pages/Profile";
import CardPayment from "./pages/payments/CryptoPayment";
import GiftCardPayment from "./pages/payments/GiftCardPayment";
import CryptoPayment from "./pages/payments/CryptoPayment";
import Contact from "./pages/Contact";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/event/:id/tickets" element={<TicketSelection />} />
          <Route path="/checkout" element={<Checkout />} />
          {/*  */}
          <Route path="/payment/gift-card" element={<GiftCardPayment />} />
          <Route path="/payment/crypto" element={<CryptoPayment />} />
          <Route path="/payment/card" element={<CardPayment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order/success" element={<OrderSuccess />} />

          {/* Auth */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />

          {/* // Seller login */}
          <Route path="/seller/login" element={<SellerLogin />} />

          {/* // Admin login */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/orders" element={<AdminOrders />} />

          {/* Seller routes */}
          <Route
            path="/seller"
            element={
              <RoleProtectedRoute roles={["seller", "admin"]}>
                <SellerDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/seller/add-ticket"
            element={
              <RoleProtectedRoute roles={["seller", "admin"]}>
                <SellerAddTicket />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/seller/my-tickets"
            element={
              <RoleProtectedRoute roles={["seller", "admin"]}>
                <SellerMyTickets />
              </RoleProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <RoleProtectedRoute roles={["admin"]}>
                <AdminEvents />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/tickets"
            element={
              <RoleProtectedRoute roles={["admin"]}>
                <AdminTickets />
              </RoleProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

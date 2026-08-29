/** Bata Botswana route map with host-aware storefront/admin entry points. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollRestoration from "./components/ScrollRestoration";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";

const Admin = lazy(() => import("./pages/Admin"));
const Catalog = lazy(() => import("./pages/Catalog"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Home = lazy(() => import("./pages/Home"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const StoreFinder = lazy(() => import("./pages/StoreFinder"));
const CollectionLanding = lazy(() => import("./pages/CollectionLanding"));

function isAdminHost() {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname.toLowerCase();
  return hostname === "admin.dev" || hostname === "admin.localhost" || hostname.startsWith("admin.");
}

function Router() {
  if (isAdminHost()) {
    return (
      <Switch>
        <Route path="/" component={Admin} />
        <Route path="/products" component={Admin} />
        <Route path="/content" component={Admin} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/products" component={Admin} />
        <Route path="/admin/content" component={Admin} />
        <Route component={Admin} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/collections/:slug" component={CollectionLanding} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/stores" component={StoreFinder} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/products" component={Admin} />
      <Route path="/admin/content" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function RouteFallback() {
  return <div className="route-loading" role="status" aria-live="polite"><span className="loader" /> Loading Bata Botswana</div>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <ScrollRestoration />
            <Suspense fallback={<RouteFallback />}><Router /></Suspense>
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Sales from "@/pages/sales";
import Purchase from "@/pages/purchase";
import Expenses from "@/pages/expenses";
import LooseStock from "@/pages/loose-stock";
import CertifiedStock from "@/pages/certified-stock";
import JewelleryStock from "@/pages/jewellery-stock";
import MemoGive from "@/pages/memo-give";
import MemoTake from "@/pages/memo-take";
import IgiIssue from "@/pages/igi-issue";
import IgiReceive from "@/pages/igi-receive";
import JewelleryManagement from "@/pages/jewellery-management";
import InventoryManagement from "@/pages/inventory-management";
import Reports from "@/pages/reports";
import RoleLogin from "@/pages/role-login";

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ component: Component, ...rest }: { component: React.ComponentType<any>, path?: string }) => {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/role-login');
    }
  }, [setLocation]);
  
  return isAuthenticated() ? <Component {...rest} /> : null;
};

function Router() {
  return (
    <Switch>
      <Route path="/role-login" component={RoleLogin} />
      
      {/* Protected routes */}
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/sales">
        {() => <ProtectedRoute component={Sales} />}
      </Route>
      <Route path="/purchase">
        {() => <ProtectedRoute component={Purchase} />}
      </Route>
      <Route path="/expenses">
        {() => <ProtectedRoute component={Expenses} />}
      </Route>
      <Route path="/loose-stock">
        {() => <ProtectedRoute component={LooseStock} />}
      </Route>
      <Route path="/certified-stock">
        {() => <ProtectedRoute component={CertifiedStock} />}
      </Route>
      <Route path="/jewellery-stock">
        {() => <ProtectedRoute component={JewelleryStock} />}
      </Route>
      <Route path="/memo-give">
        {() => <ProtectedRoute component={MemoGive} />}
      </Route>
      <Route path="/memo-take">
        {() => <ProtectedRoute component={MemoTake} />}
      </Route>
      <Route path="/igi-issue">
        {() => <ProtectedRoute component={IgiIssue} />}
      </Route>
      <Route path="/igi-receive">
        {() => <ProtectedRoute component={IgiReceive} />}
      </Route>
      <Route path="/jewellery-management">
        {() => <ProtectedRoute component={JewelleryManagement} />}
      </Route>
      <Route path="/inventory-management">
        {() => <ProtectedRoute component={InventoryManagement} />}
      </Route>
      <Route path="/reports">
        {() => <ProtectedRoute component={Reports} />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;

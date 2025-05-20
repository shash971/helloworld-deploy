import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/sales" component={Sales} />
      <Route path="/purchase" component={Purchase} />
      <Route path="/expenses" component={Expenses} />
      <Route path="/loose-stock" component={LooseStock} />
      <Route path="/certified-stock" component={CertifiedStock} />
      <Route path="/jewellery-stock" component={JewelleryStock} />
      <Route path="/memo-give" component={MemoGive} />
      <Route path="/memo-take" component={MemoTake} />
      <Route path="/igi-issue" component={IgiIssue} />
      <Route path="/igi-receive" component={IgiReceive} />
      <Route path="/jewellery-management" component={JewelleryManagement} />
      <Route path="/inventory-management" component={InventoryManagement} />
      <Route path="/reports" component={Reports} />
      <Route path="/role-login" component={RoleLogin} />
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

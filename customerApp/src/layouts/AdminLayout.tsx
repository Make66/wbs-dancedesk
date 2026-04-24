import { useState } from "react";
import { Outlet } from "react-router";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminPanel from "../components/admin/AdminPanel";

export type AdminPanelContext = {
  tenantId?: string;
  customerId?: string;
};

export type AdminPanelState = {
  mode: "customer" | "location" | "user";
  id: string | null;
  ctx?: AdminPanelContext;
};

export type AdminPanelControls = {
  panelState: AdminPanelState | null;
  openPanel: (mode: AdminPanelState["mode"], id?: string | null, ctx?: AdminPanelContext) => void;
  closePanel: () => void;
  refreshKey: number;
  triggerRefresh: () => void;
};

const AdminLayout = () => {
  const [panelState, setPanelState] = useState<AdminPanelState | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const openPanel = (mode: AdminPanelState["mode"], id: string | null = null, ctx?: AdminPanelContext) => {
    setPanelState({ mode, id, ctx });
  };

  const closePanel = () => setPanelState(null);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  const controls: AdminPanelControls = { panelState, openPanel, closePanel, refreshKey, triggerRefresh };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <AdminSidebar controls={controls} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <AdminPanel controls={controls} />
    </div>
  );
};

export default AdminLayout;

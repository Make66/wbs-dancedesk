import { X } from "lucide-react";
import CustomerForm from "./CustomerForm";
import LocationForm from "./LocationForm";
import UserForm from "./UserForm";
import type { AdminPanelControls } from "../../layouts/AdminLayout";

type Props = { controls: AdminPanelControls };

const TITLES: Record<string, string> = {
  customer: "Kunde",
  location: "Standort",
  user: "Benutzer",
};

const AdminPanel = ({ controls }: Props) => {
  const { panelState, closePanel } = controls;
  const isOpen = panelState !== null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30"
          onClick={closePanel}
        />
      )}
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-[420px] flex flex-col bg-background border-l border-muted-foreground shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {isOpen && panelState && (
          <>
            <div className="flex items-center justify-between px-4 py-3 border-b border-muted-foreground shrink-0">
              <h2 className="font-semibold text-lg">
                {panelState.id ? `${TITLES[panelState.mode]} bearbeiten` : `${TITLES[panelState.mode]} erstellen`}
              </h2>
              <button
                type="button"
                onClick={closePanel}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-muted-foreground bg-background/40 hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {panelState.mode === "customer" && (
              <CustomerForm id={panelState.id} controls={controls} />
            )}
            {panelState.mode === "location" && (
              <LocationForm id={panelState.id} ctx={panelState.ctx} controls={controls} />
            )}
            {panelState.mode === "user" && (
              <UserForm id={panelState.id} ctx={panelState.ctx} controls={controls} />
            )}
          </>
        )}
      </aside>
    </>
  );
};

export default AdminPanel;

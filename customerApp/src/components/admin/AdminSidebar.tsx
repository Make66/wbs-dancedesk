import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronRight, Users, MapPin, Building2, ArrowLeft, Pencil } from "lucide-react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import AddButton from "../ui/AddButton";
import { getCustomers } from "../../data/customer";
import { getLocations } from "../../data/location";
import { getUsers } from "../../data/user";
import type { CustomerItem } from "../../types/customer-types";
import type { LocationItem } from "../../types/location-types";
import type { UserItem } from "../../types/user-types";
import type { AdminPanelControls } from "../../layouts/AdminLayout";

type Props = { controls: AdminPanelControls };

const AdminSidebar = ({ controls }: Props) => {
  const { openPanel, panelState, refreshKey } = controls;

  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);

  const [openCustomers, setOpenCustomers] = useState(true);
  // per-customer expanded sections
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [openLocSections, setOpenLocSections] = useState<Set<string>>(new Set());
  const [openUserSections, setOpenUserSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    getCustomers().then(setCustomers).catch(console.error);
    getLocations().then(setLocations).catch(console.error);
    getUsers().then(setUsers).catch(console.error);
  }, [refreshKey]);

  const toggle = (set: Set<string>, id: string): Set<string> => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  };

  const isSelected = (mode: "customer" | "location" | "user", id: string) =>
    panelState?.mode === mode && panelState?.id === id;

  return (
    <aside className="w-72 shrink-0 h-screen flex flex-col border-r border-muted-foreground overflow-y-auto bg-background">
      <div className="px-4 pt-5 pb-3 border-b border-muted-foreground">
        <p className="text-xl font-bold tracking-tight">DanceDesk Admin</p>
        <Link to="/" className="flex items-center gap-1 text-xs text-muted-foreground mt-1 hover:text-foreground transition-colors">
          <ArrowLeft className="w-3 h-3" /> Zurück zur App
        </Link>
      </div>

      <div className="flex flex-col gap-2 p-3 flex-1">
        <div className="rounded-2xl bg-sky-400/60 p-3">

          {/* Section header */}
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setOpenCustomers((o) => !o)}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="font-semibold text-sm">Kunden</span>
              <span className="text-xs text-muted-foreground">({customers.length})</span>
            </div>
            <div className="flex items-center gap-2">
              {openCustomers && (
                <div onClick={(e) => e.stopPropagation()}>
                  <AddButton tooltipContent="Kunde hinzufügen" size="small" onClick={() => openPanel("customer")} />
                </div>
              )}
              {openCustomers ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
            </div>
          </div>

          {/* Customer list */}
          {openCustomers && (
            <div className="mt-2 flex flex-col gap-1">
              {customers.length === 0 ? (
                <p className="text-xs text-muted-foreground pl-1">Keine Kunden vorhanden.</p>
              ) : (
                customers.map((c) => {
                  const isExpanded = expandedIds.has(c.id);
                  const locOpen = openLocSections.has(c.id);
                  const userOpen = openUserSections.has(c.id);
                  const cLocations = locations.filter((l) => l.tenantId === c.tenantId);
                  const cUsers = users.filter((u) => u.tenantId === c.tenantId);

                  return (
                    <div key={c.id} className="flex flex-col gap-1">
                      {/* Customer row */}
                      <div
                        className={`rounded-2xl border border-muted-foreground bg-background/40 flex items-center px-3 py-2.5 gap-2 transition-colors cursor-pointer ${isSelected("customer", c.id) ? "bg-sky-500 text-white border-sky-500" : "hover:bg-sky-400/40"}`}
                        onClick={() => setExpandedIds(toggle(expandedIds, c.id))}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{c.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); openPanel("customer", c.id); }}
                          className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-sky-500 hover:text-white transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        {isExpanded ? <RiArrowUpSLine className="shrink-0 text-sm" /> : <RiArrowDownSLine className="shrink-0 text-sm" />}
                      </div>

                      {/* Sub-sections */}
                      {isExpanded && (
                        <div className="ml-3 flex flex-col gap-1">

                          {/* Locations sub-section */}
                          <div className="rounded-xl bg-violet-400/40 p-2">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => setOpenLocSections(toggle(openLocSections, c.id))}
                            >
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3" />
                                <span className="text-xs font-semibold">Standorte</span>
                                <span className="text-xs text-muted-foreground">({cLocations.length})</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {locOpen && (
                                  <div onClick={(e) => e.stopPropagation()}>
                                    <AddButton tooltipContent="Standort hinzufügen" size="small" onClick={() => openPanel("location", null, { tenantId: c.tenantId, customerId: c.id })} />
                                  </div>
                                )}
                                {locOpen ? <RiArrowUpSLine className="text-xs" /> : <RiArrowDownSLine className="text-xs" />}
                              </div>
                            </div>
                            {locOpen && (
                              <div className="mt-1.5 flex flex-col gap-1">
                                {cLocations.length === 0 ? (
                                  <p className="text-xs text-muted-foreground pl-1">Keine Standorte.</p>
                                ) : (
                                  cLocations.map((l) => (
                                    <div
                                      key={l.id}
                                      className={`rounded-xl border border-muted-foreground bg-background/40 flex items-center px-3 py-2 gap-2 transition-colors cursor-pointer ${isSelected("location", l.id) ? "bg-violet-500 text-white border-violet-500" : "hover:bg-violet-400/40"}`}
                                      onClick={() => openPanel("location", l.id, { tenantId: c.tenantId, customerId: c.id })}
                                    >
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">{l.name}</p>
                                        {l.city && <p className="text-xs text-muted-foreground truncate">{l.city}</p>}
                                      </div>
                                      <ChevronRight className="w-3 h-3 shrink-0 text-muted-foreground" />
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>

                          {/* Users sub-section */}
                          <div className="rounded-xl bg-rose-400/40 p-2">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => setOpenUserSections(toggle(openUserSections, c.id))}
                            >
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3 h-3" />
                                <span className="text-xs font-semibold">Benutzer</span>
                                <span className="text-xs text-muted-foreground">({cUsers.length})</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {userOpen && (
                                  <div onClick={(e) => e.stopPropagation()}>
                                    <AddButton tooltipContent="Benutzer hinzufügen" size="small" onClick={() => openPanel("user", null, { tenantId: c.tenantId })} />
                                  </div>
                                )}
                                {userOpen ? <RiArrowUpSLine className="text-xs" /> : <RiArrowDownSLine className="text-xs" />}
                              </div>
                            </div>
                            {userOpen && (
                              <div className="mt-1.5 flex flex-col gap-1">
                                {cUsers.length === 0 ? (
                                  <p className="text-xs text-muted-foreground pl-1">Keine Benutzer.</p>
                                ) : (
                                  cUsers.map((u) => (
                                    <div
                                      key={u.id}
                                      className={`rounded-xl border border-muted-foreground bg-background/40 flex items-center px-3 py-2 gap-2 transition-colors cursor-pointer ${isSelected("user", u.id) ? "bg-rose-500 text-white border-rose-500" : "hover:bg-rose-400/40"}`}
                                      onClick={() => openPanel("user", u.id, { tenantId: c.tenantId })}
                                    >
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">{u.firstName} {u.lastName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                                      </div>
                                      <span className={`text-xs px-1 py-0.5 rounded shrink-0 ${u.role === "admin" ? "bg-rose-500 text-white" : "border border-muted-foreground"}`}>
                                        {u.role}
                                      </span>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

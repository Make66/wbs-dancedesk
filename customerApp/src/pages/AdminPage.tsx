import { useEffect, useState } from "react";
import { Building2, MapPin, Users } from "lucide-react";
import { getCustomers } from "../data/customer";
import { getLocations } from "../data/location";
import { getUsers } from "../data/user";

const AdminPage = () => {
  const [counts, setCounts] = useState({ customers: 0, locations: 0, users: 0 });

  useEffect(() => {
    Promise.all([getCustomers(), getLocations(), getUsers()])
      .then(([customers, locations, users]) =>
        setCounts({ customers: customers.length, locations: locations.length, users: users.length })
      )
      .catch(console.error);
  }, []);

  const cards = [
    { label: "Kunden", value: counts.customers, icon: Building2, color: "bg-sky-400/60" },
    { label: "Standorte", value: counts.locations, icon: MapPin, color: "bg-violet-400/60" },
    { label: "Benutzer", value: counts.users, icon: Users, color: "bg-rose-400/60" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">DanceDesk Admin</h1>
      <p className="text-muted-foreground mb-8 text-sm">Plattformübersicht aller Mandanten</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`${color} rounded-2xl p-6 flex flex-col gap-2`}>
            <Icon className="w-6 h-6" />
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm font-medium">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;

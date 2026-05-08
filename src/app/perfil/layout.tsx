import type { ReactNode } from "react";

import { PerfilBottomNav } from "@/components/perfil/perfil-bottom-nav";
import { PerfilSessionProvider } from "@/components/perfil/perfil-session-provider";

export default function PerfilLayout({ children }: { children: ReactNode }) {
  return (
    <PerfilSessionProvider>
      <div className="min-h-screen bg-[var(--background)] text-white">
        {children}
        <PerfilBottomNav />
      </div>
    </PerfilSessionProvider>
  );
}

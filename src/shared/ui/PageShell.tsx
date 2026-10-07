import type { ReactNode } from "react";
import { AppShell } from "@mantine/core";
import { usePageThemeClass } from "@/hooks/usePageThemeClass";
import { APP_HEADER_HEIGHT } from "@/shared/ui/AppHeader";
import { Footer } from "@/shared/ui/Footer";
import { SiteHeader } from "@/shared/ui/SiteHeader";

const FOOTER_HEIGHT = 56;

type Props = {
  footer?: boolean;
  mainClassName?: string;
  children: ReactNode;
};

/** Themed site chrome (header, optional footer) shared by the non-game pages. */
export function PageShell({ footer = false, mainClassName, children }: Props) {
  const themeClassName = usePageThemeClass();

  return (
    <div className={themeClassName}>
      <AppShell
        header={{ height: APP_HEADER_HEIGHT }}
        footer={footer ? { height: FOOTER_HEIGHT } : undefined}
      >
        <SiteHeader />
        <AppShell.Main className={mainClassName}>{children}</AppShell.Main>
        {footer && <Footer />}
      </AppShell>
    </div>
  );
}

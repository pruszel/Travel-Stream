// frontend/src/components/ContentWrapper.tsx

import * as React from "react";

interface ContentWrapperProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function ContentWrapper({ children, fullWidth }: ContentWrapperProps) {
  return (
    <div className={`${fullWidth ? "max-w-full" : "max-w-4xl"} px-6`}>
      {children}
    </div>
  );
}

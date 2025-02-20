import React from "react";
import { BaseLinkButton } from "./BaseLinkButton";

type OutlineButtonWithLinkProps = Omit<
  React.ComponentProps<typeof BaseLinkButton>,
  "className"
>;

export function OutlineButtonWithLink({
  children,
  ...props
}: OutlineButtonWithLinkProps) {
  return (
    <BaseLinkButton
      {...props}
      className="rounded-md px-4 py-2 text-gray-800 ring-1 ring-blue-700 hover:bg-blue-100 hover:ring-2"
    >
      {children}
    </BaseLinkButton>
  );
}

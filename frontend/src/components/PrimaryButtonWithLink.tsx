import React from "react";
import { BaseLinkButton } from "./BaseLinkButton";

type PrimaryButtonWithLinkProps = Omit<
  React.ComponentProps<typeof BaseLinkButton>,
  "className"
>;

export function PrimaryButtonWithLink({
  children,
  ...props
}: PrimaryButtonWithLinkProps) {
  return (
    <BaseLinkButton
      {...props}
      className="inline-block rounded-md bg-blue-500 px-5 py-2 text-gray-800 text-white hover:bg-blue-400"
    >
      {children}
    </BaseLinkButton>
  );
}

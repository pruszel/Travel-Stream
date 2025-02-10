import React from "react";
import { BaseLinkButton } from "./BaseLinkButton";

type TextButtonWithLinkProps = Omit<
  React.ComponentProps<typeof BaseLinkButton>,
  "className"
>;

export function TextButtonWithLink({
  children,
  ...props
}: TextButtonWithLinkProps) {
  return (
    <BaseLinkButton {...props} className="px-2 py-2 hover:underline">
      {children}
    </BaseLinkButton>
  );
}

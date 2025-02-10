import React from "react";
import { Link, LinkProps } from "react-router";

type LinkButtonProps = LinkProps & {
  children: React.ReactNode;
};

export function BaseLinkButton({
  children,
  className = "",
  ...rest
}: LinkButtonProps) {
  return (
    <Link className={className} {...rest}>
      {children}
    </Link>
  );
}

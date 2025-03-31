// UserGreeting.tsx

import { User } from "firebase/auth";

export function UserGreeting({ user }: { user: User }) {
  return <p>Hello, {user.displayName}</p>;
}

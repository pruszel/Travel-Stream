import { OutlineButtonWithLink } from "../components/OutlineButtonWithLink";
import { TextButtonWithLink } from "../components/TextButtonWithLink";

export default function Header() {
  return (
    <>
      <header className="z-10 px-8 py-4 shadow-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <a href="/">Travel Stream</a>
          <div className="flex gap-4">
            <TextButtonWithLink to="/login">Login</TextButtonWithLink>
            <OutlineButtonWithLink to="/register">
              Register
            </OutlineButtonWithLink>
          </div>
        </div>
      </header>
    </>
  );
}

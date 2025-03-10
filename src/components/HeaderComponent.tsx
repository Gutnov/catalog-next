import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@heroui/navbar";
import Link from "next/link";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function Header() {
  return (<>
        <div className='-mx-6 mb-10'>
            <Navbar maxWidth='full'>
            <NavbarBrand>
                <AcmeLogo />
                <p className="font-bold text-inherit">ACME</p>
            </NavbarBrand>
            <NavbarContent className="sm:flex gap-4 px-0" justify="center">
                <NavbarItem>
                <Link className='mr-4' color="foreground" href="/catalog">
                    Каталог
                </Link>
                <Link color="foreground" href="/">
                    Главная
                </Link>
                </NavbarItem>
            </NavbarContent>
            </Navbar>
        </div>
    </>
  );
}

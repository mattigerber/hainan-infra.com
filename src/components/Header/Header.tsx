import Logo from "./Logo";
import RegisterProjectButton from "./RegisterProjectButton";
import LanguageSwitcher from "./LanguageSwitcher";
import HeaderMobileMenu from "@/components/Header/HeaderMobileMenu";

const Header = () => {
  return (
    <header className="bg-black py-5 sm:py-5 md:py-6" role="banner">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-8 pt-8 sm:flex-wrap sm:px-6 sm:pt-2 md:pt-8 md:px-10 2xl:max-w-[90rem]">
        <Logo />

        <HeaderMobileMenu />

        <nav aria-label="Primary navigation" className="hidden w-full flex-wrap justify-end gap-2 sm:flex sm:w-auto sm:gap-3 md:gap-4">
          <div className="inline-flex border border-white">
            <LanguageSwitcher />
          </div>
          <RegisterProjectButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;

import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import LogoLight from "@/assets/Logo.png";
import LogoDark from "@/assets/LogoDark.png";
import useMediaQuery from "@/hooks/useMediaQuery";
import PrimaryButton from "@/components/PrimaryButton";
import { useDispatch } from "react-redux";
import { setIsDarkMode } from "@/state";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useAppSelector } from "@/app/redux";
import { useUserLogoutMutation } from "@/state/api";
import { logOut } from "@/state/authSlice";

const Navbar = ({ isNavbarTop }: { isNavbarTop: boolean }) => {
  const dispatch = useDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const [logout] = useUserLogoutMutation();
  const handleLogout = async () => {
    await logout().unwrap();
    dispatch(logOut());
  };

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const flexBetween = "flex items-center justify-between";
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleToggle = () => setIsDropdownOpen((prev) => !prev);

  // FUNCTIONALITY TO TOGGLE THE DROPDOWN MENU WHEN CLICKED OUTSIDE OF THAT CONTAINER
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navbarBackground = isNavbarTop
    ? ""
    : "bg-background-color-light dark:bg-background-color drop-shadow";

  const navLinks = [
    {
      text: "Home",
      path: "/#home",
      isDropDownMenu: true,
      subLinks: [
        { text: "Benefícios", path: "/#beneficios" },
        { text: "Modalidades", path: "/#modalities" },
        ...(!user ? [{ text: "Planos de Treino", path: "/#gymPlans" }] : []),
        { text: "Contacta-nos", path: "/#contact" },
      ],
    },

    {
      text: "Mapa de Aulas",
      path: "/mapaAulas",
      isDropDownMenu: false,
    },
    {
      text: "Origem",
      path: "/origem/#origem",
      isDropDownMenu: true,
      subLinks: [
        { text: "Máquinas", path: "/origem/#maquinas" },
        { text: "Família", path: "/origem/#familia" },
        { text: "Profissionais", path: "/origem/#profissionais" },
      ],
    },
    {
      text: "Equipamentos",
      path: "",
      isDropDownMenu: true,
      subLinks: [
        { text: "Cardio", path: "/equipamentos/cardio" },
        { text: "Musculação", path: "/equipamentos/musculacao" },
        { text: "Funcional", path: "/equipamentos/funcional" },
      ],
      showSubLinksOnMobile: true,
    },
    {
      text: "Blog",
      path: "/blog",
      isDropDownMenu: false,
      showSubLinksOnMobile: false,
    },
  ];

  const isActiveLink = (path: string) => {
    // Handle dynamic blog links (e.g., /blog or /blog/:id)
    if (path === "/blog") {
      return location.pathname.startsWith("/blog");
    }

    // Default comparison for other links
    return location.pathname + location.hash === path;
  };
  const handleLinkClick = (path: string) => {
    if (path.includes("#")) {
      setTimeout(() => {
        const targetElement = document.getElementById(path.split("#")[1]);
        if (targetElement) {
          const navbarHeight = 60;
          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.scrollY -
            navbarHeight;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
      }, 100);
    } else {
      setTimeout(() => {
        window.scrollTo(0, 0);
      });
    }
  };

  const renderNavLinks = (isMobile: boolean = false) =>
    navLinks.map(
      ({ text, path, isDropDownMenu, subLinks, showSubLinksOnMobile }) => (
        <div key={text} className="relative group">
          <Link
            to={path === "/home" ? "/" : path}
            onClick={() => handleLinkClick(path)}
            className={`flex items-center gap-2 ${isActiveLink(path) ? " text-black dark:text-secondary-200 font-bold" : ""}`}
          >
            <span>{text}</span>
            {isDropDownMenu && !isMobile && (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </Link>

          {isDropDownMenu && subLinks && !isMobile && (
            <ul
              className={` absolute hidden group-hover:block bg-white divide-y rounded-lg shadow w-40`}
            >
              {subLinks.map(({ text, path }) => (
                <li key={text}>
                  <Link
                    to={path}
                    onClick={() => handleLinkClick(path)}
                    className={`block px-3 py-2 text-black hover:bg-slate-200 rounded-md  
            ${isActiveLink(path) ? " text-black font-bold" : ""}`}
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {isDropDownMenu && subLinks && showSubLinksOnMobile && isMobile && (
            <ul className="shadow-lg rounded-md mt-2">
              {subLinks.map(({ text, path }) => (
                <li key={text}>
                  <Link
                    to={path}
                    onClick={() => handleLinkClick(path)}
                    className={`block px-4 py-1 text-black dark:text-white hover:bg-slate-200 rounded-md transition duration-200 ease-in-out
  ${isActiveLink(path) ? "text-secondary-200 font-bold" : ""} text-base`}
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    );
  return (
    <nav
      aria-label="primary menu"
      className={"text-black dark:text-white fixed z-50"}
    >
      <div className={`${navbarBackground} fixed w-full py-6`}>
        <div className={`mx-auto w-11/12`}>
          <div className={`${flexBetween} w-full gap-8`}>
            <Link to={"/"}>
              <img
                alt="logo"
                src={isDarkMode ? LogoLight : LogoDark}
                className="h-8"
              />
            </Link>

            {isAboveMediumScreens ? (
              <div className={`${flexBetween} w-full`}>
                <div className={`${flexBetween} gap-5`}>{renderNavLinks()}</div>

                <div className={`${flexBetween} gap-3 `}>
                  {user ? (
                    <div
                      className="relative flex items-center gap-3"
                      ref={containerRef}
                    >
                      <img
                        id="avatarButton"
                        onClick={handleToggle}
                        className="w-11 h-11 rounded-full cursor-pointer"
                        src={`${user.profilePictureUrl}`}
                        alt="User dropdown"
                      />
                      <div
                        id="userDropdown"
                        ref={dropdownRef}
                        className={`absolute top-full left-0 mt-2 z-10 ${isDropdownOpen ? "block" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow w-44`}
                      >
                        <div className="px-4 py-3 text-sm text-gray-900 ">
                          <div>{`${user.firstName} ${user.lastName}`}</div>

                          <div className="font-medium truncate">
                            {`${user.membershipNumber} `}
                          </div>
                        </div>
                        <ul
                          className="py-2 text-sm text-gray-700 "
                          aria-labelledby="avatarButton"
                        >
                          <li>
                            <Link
                              to="/perfil"
                              className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-secondary-200"
                            >
                              Perfil
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/perfil/assinatura"
                              className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-secondary-200"
                            >
                              Gerir Assinatura
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/perfil/pagamentos"
                              className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-secondary-200"
                            >
                              Pagamentos
                            </Link>
                          </li>

                          <li>
                            <Link
                              to="/perfil/treino"
                              className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-secondary-200"
                            >
                              Planos de Treino
                            </Link>
                          </li>
                        </ul>
                        <div className="py-1">
                          <Link
                            to="/"
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-200"
                            onClick={() => {
                              handleLogout();
                            }}
                          >
                            Sair
                          </Link>
                        </div>
                      </div>
                      <div className="font-medium ">
                        <div>{`${user.firstName} ${user.lastName}`}</div>
                        <div className="text-sm text-secondary-700 dark:text-secondary-400 ">
                          Membro desde {user.memberSince}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <PrimaryButton
                        label="Inscreve-te"
                        navigateTo="inscricao"
                      />
                      <button className="ml-3 text-lg font-semibold text-black hover:text-yellow-400 dark:text-white dark:hover:text-yellow-300 transition-colors duration-200 ">
                        <Link to="/login"> Área de Cliente </Link>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
                    aria-label="Toggle Dark Mode"
                  >
                    {isDarkMode ? (
                      <SunIcon className="ml-2 h-6 w-6 text-secondary-400" />
                    ) : (
                      <MoonIcon className="ml-2 h-6 w-6 text-partial-black" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="rounded-full bg-selected-background p-2"
                onClick={() => setIsMenuToggled(!isMenuToggled)}
              >
                <Bars3Icon className="h-6 w-6 text-background-alt" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU MODAL */}
      {!isAboveMediumScreens && isMenuToggled && (
        <div className="fixed right-0 z-50 h-full w-[300px] max-h-screen overflow-y-auto bg-background-color-light dark:bg-background-color drop-shadow-xl">
          {/* CLOSE ICON */}
          <div className="flex justify-end p-6">
            <button onClick={() => setIsMenuToggled(false)}>
              <XMarkIcon className="h-6 w-6 text-full-white" />
            </button>
          </div>

          {/* MOBILE NAV LINKS */}
          <div className="flex flex-col mx-16 gap-5 text-xl">
            {renderNavLinks(true)}
            {/* Dark Mode Toggle Button in Mobile Menu */}
            <button
              onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
              aria-label="Toggle Dark Mode"
              className="flex items-center gap-2"
            >
              {isDarkMode ? (
                <SunIcon className="h-6 w-6 text-secondary-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-background-alt" />
              )}
              <span>{isDarkMode ? "Modo Claro" : "Modo Escuro"}</span>
            </button>
          </div>

          <div>
            {/* Client Area and Sign Up */}
            <div className="flex flex-col mx-10 mt-8 gap-4">
              {user ? (
                <div
                  className="relative flex items-center gap-4"
                  ref={containerRef}
                >
                  <img
                    id="avatarButton"
                    onClick={handleToggle}
                    className="w-11 h-11 rounded-full cursor-pointer"
                    src={`${user.profilePictureUrl} `}
                    alt="User dropdown"
                  />
                  <div
                    id="userDropdown"
                    ref={dropdownRef}
                    className={`absolute top-full left-0 mt-2 z-10 ${isDropdownOpen ? "block" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 `}
                  >
                    <div className="px-4 py-3 text-sm text-gray-900 ">
                      <div>
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="font-medium truncate">
                        {user.membershipNumber}
                      </div>
                    </div>
                    <ul
                      className="py-2 text-sm text-gray-700 "
                      aria-labelledby="avatarButton"
                    >
                      <li>
                        <Link
                          to="/perfil"
                          className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-secondary-200"
                        >
                          Perfil
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/perfil/assinatura"
                          className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-secondary-200"
                        >
                          Gerir Assinatura
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/perfil/pagamentos"
                          className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-secondary-200"
                        >
                          Pagamentos
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/perfil/treino"
                          className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-secondary-200"
                        >
                          Planos de Treino
                        </Link>
                      </li>
                    </ul>
                    <div className="py-1">
                      <Link
                        to="/"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-200 rounded-md"
                        onClick={() => {
                          handleLogout();
                        }}
                      >
                        Sair
                      </Link>
                    </div>
                  </div>
                  <div className="font-medium ">
                    <div>
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-secondary-400 ">
                      Membro desde {user.memberSince}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <PrimaryButton label="Inscreve-te" navigateTo="inscricao" />
                  <button className="text-lg font-semibold text-partial-black dark:text-full-white hover:text-yellow-300 transition-colors duration-200">
                    <Link to="/login">Área de Cliente</Link>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

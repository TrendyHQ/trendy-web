import "../css/Header.css";
import { Link, useLocation } from "react-router-dom";
import { useRef, useState, useEffect, RefObject } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DropDown from "./DropDown";
import axios from "axios";
import FeedbackWindow from "./FeedbackWindow";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import SignInButton from "./ui/signInButton";

export default function Header({
  hasSetUpAccount,
  headerIsLoading,
}: {
  hasSetUpAccount?: boolean | null;
  headerIsLoading?: boolean;
}) {
  const location = useLocation();
  const { isAuthenticated, logout, user, isLoading } = useAuth0();
  const isDarkTheme: boolean = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const dropDownRef = useRef<HTMLDivElement>(null);
  const profileImgRef = useRef<HTMLImageElement>(null);
  const collapsedRef = useRef<HTMLDivElement>(null);

  const [profileDown, setProfileDown] = useState<boolean>(false);
  const [userNickname, setUserNickname] = useState<string>(
    user?.nickname || ""
  );
  const [feedbackWindowOpen, setFeedbackWindowOpen] = useState<boolean>(false);
  const [currentFeedbackContent, setCurrentFeedbackContent] =
    useState<string>("default");
  const [isFading, setIsFading] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setScrollPosition] = useState<number>(0);
  const [isHeaderSticky, setIsHeaderSticky] = useState<boolean>(false);
  const scrollThreshold = 100;

  const morePaths: string[] = ["/ask-ai"];
  const iconSize: number = 26;

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);

      if (position > scrollThreshold && !isHeaderSticky) {
        setIsHeaderSticky(true);
      } else if (position == 0 && isHeaderSticky) {
        setIsHeaderSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHeaderSticky, scrollThreshold]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        event.target instanceof Element &&
        event.target.closest(".feedbackWindow")
      ) {
        return;
      }
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node) &&
        profileImgRef.current &&
        !profileImgRef.current.contains(event.target as Node)
      ) {
        setProfileDown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    setUserNickname(user?.nickname || "");

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFeedback = () => {
    setFeedbackWindowOpen(true);
  };

  function handleFade(content: string) {
    setIsFading(true);
    setTimeout(() => {
      setCurrentFeedbackContent(content);
      setIsFading(false);
    }, 100);
  }

  const handleSubmitFeedback = async (isReport: boolean) => {
    const feedbackTextarea = document.querySelector(
      ".feedback-textarea.active"
    ) as HTMLTextAreaElement;
    const feedback = feedbackTextarea?.value;

    if (!feedback || feedback.trim() === "" || !user) {
      alert("Feedback cannot be empty");
      return;
    }

    try {
      await axios.put("http://localhost:8080/api/data/addFeedbackToDatabase", {
        userId: user.sub,
        feedback: feedback,
        isReport: isReport,
      });
      alert("Feedback submitted successfully");
    } finally {
      setFeedbackWindowOpen(false);
    }
  };

  useEffect(() => {
    if (hasSetUpAccount && isAuthenticated) {
      setUserNickname(user?.nickname || "");
    }
  }, [hasSetUpAccount, isAuthenticated]);

  if (headerIsLoading) {
    return (
      <header
        className="loading"
        style={{
          background: "#424242",
          animation: "loading 1.5s ease-in infinite",
          minHeight: "76px",
        }}
      ></header>
    );
  }

  return (
    <>
      {isHeaderSticky && <div className="sticky-header-placeholder"></div>}
      <FeedbackWindow
        functions={{ handleFade, setFeedbackWindowOpen, handleSubmitFeedback }}
        values={[feedbackWindowOpen, currentFeedbackContent, isFading]}
      />
      {isAuthenticated && (
        <Navbar
          collapseOnSelect
          expand="md"
          className={`bg-[#ff5733] !z-[500] p-0 !h-[76px] shadow-md ${
            isHeaderSticky ? "sticky-header" : ""
          }`}
          variant={isDarkTheme ? "dark" : "light"}
          style={{
            position: isHeaderSticky ? "fixed" : "relative",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            animation: isHeaderSticky ? "dropDown 0.3s ease-in-out" : "none",
          }}
        >
          <Container fluid className="!h-[100%]">
            <Navbar.Brand
              as={Link}
              to="/"
              onClick={function () {
                if (location.pathname === "/") {
                  window.location.reload();
                }
              }}
              className="font-jockey !text-[2.5rem] text-white m-0 p-0"
              style={{ fontFamily: "'Jockey One', sans-serif" }}
            >
              TRENDY
            </Navbar.Brand>
            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              onClick={() => {
                if (isCollapsed) {
                  setIsCollapsed(false);
                } else {
                  setTimeout(() => {
                    if (!collapsedRef.current?.classList.contains("show")) {
                      setIsCollapsed(true);
                    }
                  }, 1000);
                }
              }}
            />
            <Navbar.Collapse
              id="responsive-navbar-nav"
              className="justify-content-center !h-[100%]"
              style={{ visibility: "inherit" }}
              ref={collapsedRef}
            >
              <Nav
                className="!gap-[6px] !h-[100%]"
                variant={isCollapsed ? "underline" : "default"}
                navbarScroll
                style={{ maxHeight: "200px" }}
              >
                <NavLink href="/" isCollapsed={isCollapsed}>
                  Home
                </NavLink>
                <NavLink href="/favorites" isCollapsed={isCollapsed}>
                  Favorites
                </NavLink>
                <NavLink href="/hottrends" isCollapsed={isCollapsed}>
                  Hot
                </NavLink>
                <NavLink href="/categories" isCollapsed={isCollapsed}>
                  Categories
                </NavLink>
                <NavDropdown
                  title="More"
                  id="collapsible-nav-dropdown"
                  className={`text-white headerLink !border-0 dropDownClass flex align-items-center ${
                    isCollapsed ? "paddedLink" : ""
                  } before:absolute before:bottom-0 before:left-0 before:h-[3px] before:w-full before:origin-left before:scale-x-0 before:bg-white before:transition-transform hover:bg-white/10 hover:before:scale-x-100                    ${
                    morePaths.includes(location.pathname)
                      ? "!font-[600] !text-[1.2rem] before:scale-x-100"
                      : "hover:!text-[1.15rem]"
                  }`}
                  style={{
                    transition: "all 0.15s ease-in-out",
                  }}
                  active={morePaths.includes(location.pathname)}
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/ask-ai"
                    className="text-white !bg-[#f63a2b]"
                  >
                    Ask AI
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
            {isAuthenticated && windowWidth >= 768 && (
              <img
                ref={profileImgRef}
                src={user?.picture}
                className="userImg ml-[20px]"
                onClick={() => setProfileDown((prev) => !prev)}
                alt="User profile"
              />
            )}
          </Container>
        </Navbar>
      )}
      {!isAuthenticated && !isLoading && (
        <Navbar
          collapseOnSelect
          expand="md"
          className={`bg-[#ff5733] !z-[500] p-0 !h-[76px] shadow-md ${
            isHeaderSticky ? "sticky-header" : ""
          }`}
          variant={isDarkTheme ? "dark" : "light"}
          style={{
            position: isHeaderSticky ? "fixed" : "relative",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            animation: isHeaderSticky ? "dropDown 0.3s ease-in-out" : "none",
          }}
        >
          <Container fluid className="!h-[100%]">
            <Navbar.Brand
              as={Link}
              to="/"
              className="font-jockey !text-[2.5rem] text-white m-0 p-0"
              style={{ fontFamily: "'Jockey One', sans-serif" }}
            >
              TRENDY
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse
              id="responsive-navbar-nav"
              className="justify-content-center !h-[100%]"
              style={{ visibility: "inherit" }}
            >
              <Nav
                className="!gap-[6px] !h-[100%]"
                variant={windowWidth >= 768 ? "underline" : "default"}
                navbarScroll
                style={{ maxHeight: "200px" }}
              >
                <NavLink href="/about" isCollapsed={windowWidth >= 768}>
                  About
                </NavLink>
                <NavLink href="/how-it-works" isCollapsed={windowWidth >= 768}>
                  How It Works
                </NavLink>
                <NavLink href="/features" isCollapsed={windowWidth >= 768}>
                  Features
                </NavLink>
              </Nav>
            </Navbar.Collapse>
            <SignInButton />
          </Container>
        </Navbar>
      )}
      {isAuthenticated && !isLoading && (
        <DropDown
          functions={{ handleFeedback, logout }}
          values={[iconSize, isDarkTheme, profileDown, userNickname]}
          dropDownRef={dropDownRef as RefObject<HTMLDivElement>}
        />
      )}
    </>
  );
}

function NavLink({
  href,
  isCollapsed,
  children,
}: {
  href: string;
  isCollapsed: boolean;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const active = location.pathname === href;

  return (
    <Nav.Link
      as={Link}
      to={href}
      className={`text-white headerLink relative !border-0 
        ${isCollapsed ? "paddedHeaderLink" : "hoverBackground"}
        before:absolute before:bottom-0 before:left-0 before:h-[3px] before:w-full 
        before:origin-left before:scale-x-0 before:bg-white 
        before:transition-transform hover:bg-white/10 hover:before:scale-x-100
        ${
          active
            ? "before:scale-x-100 !font-[600] !text-[1.2rem]"
            : "hover:!text-[1.15rem]"
        }`}
      active={active}
      style={{
        transition: "all 0.15s ease-in-out",
      }}
    >
      {children}
    </Nav.Link>
  );
}

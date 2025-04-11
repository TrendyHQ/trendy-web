import "../css/Header.css";
import { Link, useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DropDown from "./DropDown";
import axios from "axios";
import FeedbackWindow from "./FeedbackWindow";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";

export default function Header({
  hasSetUpAccount,
}: {
  hasSetUpAccount?: boolean;
}) {
  const location = useLocation();
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } =
    useAuth0();
  const isDarkTheme: boolean = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const dropDownRef = useRef<HTMLDivElement>(null);
  const profileImgRef = useRef<HTMLImageElement>(null);

  const [profileDown, setProfileDown] = useState<boolean>(false);
  const [userNickname, setUserNickname] = useState<string>(
    user?.nickname || ""
  );
  const [feedbackWindowOpen, setFeedbackWindowOpen] = useState<boolean>(false);
  const [currentFeedbackContent, setCurrentFeedbackContent] =
    useState<string>("default");
  const [isFading, setIsFading] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const iconSize: number = 26;

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Don't close if the feedback window was clicked
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
    }, 100); // length of the fade animation in ms
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
    } catch (error) {
      console.error(error);
    } finally {
      setFeedbackWindowOpen(false);
    }
  };

  useEffect(() => {
    if (hasSetUpAccount && isAuthenticated) {
      setUserNickname(user?.nickname || "");
    }
  }, [hasSetUpAccount, isAuthenticated]);

  if (isLoading) {
    return (
      <header>
        <h1 className="logo">TRENDY</h1>
        <div className="loadingPfp loading"></div>
      </header>
    );
  }

  return (
    <>
      <FeedbackWindow
        functions={{ handleFade, setFeedbackWindowOpen, handleSubmitFeedback }}
        values={[feedbackWindowOpen, currentFeedbackContent, isFading]}
      />
      <header className={!isAuthenticated ? "transparent" : ""}>
        <Link
          to="/"
          className={isAuthenticated ? "logo" : "logo big"}
          onClick={function () {
            if (location.pathname === "/") {
              window.location.reload();
            }
          }}
        >
          <h1 className="text-3xl">TRENDY</h1>
        </Link>
        {isAuthenticated && (
          <Navbar
            collapseOnSelect
            expand="md"
            className="w-[80%] bg-transparent"
            variant={isDarkTheme ? "dark" : "light"}
          >
            <Container>
              <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                onClick={handleShow}
                className="d-md-none ms-auto"
              />
              {windowWidth < 768 && (
                <Offcanvas
                  show={show}
                  onHide={handleClose}
                  placement="end"
                  responsive="md"
                  data-bs-theme={isDarkTheme ? "dark" : "light"}
                >
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <Nav className="flex-column">
                      <Nav.Link
                        as={Link}
                        to="/"
                        className="offcanvas-link"
                        active={location.pathname === "/"}
                        onClick={handleClose}
                      >
                        Home
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/favorites"
                        className="offcanvas-link"
                        active={location.pathname === "/favorites"}
                        onClick={handleClose}
                      >
                        Favorites
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/hottrends"
                        className="offcanvas-link"
                        active={location.pathname === "/hottrends"}
                        onClick={handleClose}
                      >
                        Hot
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/categories"
                        className="offcanvas-link"
                        active={location.pathname === "/categories"}
                        onClick={handleClose}
                      >
                        Categories
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/ask-ai"
                        className="offcanvas-link"
                        active={location.pathname === "/ask-ai"}
                        onClick={handleClose}
                      >
                        Ask AI
                      </Nav.Link>
                    </Nav>
                  </Offcanvas.Body>
                </Offcanvas>
              )}
              <Navbar.Collapse
                id="responsive-navbar-nav"
                className="d-none d-md-block"
              >
                <Nav className="ms-auto" variant="underline">
                  <Nav.Link
                    as={Link}
                    to="/"
                    className="text-white"
                    active={location.pathname === "/"}
                  >
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/favorites"
                    className="text-white"
                    active={location.pathname === "/favorites"}
                  >
                    Favorites
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/hottrends"
                    className="text-white"
                    active={location.pathname === "/hottrends"}
                  >
                    Hot
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/categories"
                    className="text-white"
                    active={location.pathname === "/categories"}
                  >
                    Categories
                  </Nav.Link>
                  <NavDropdown
                    title="More"
                    id="collapsible-nav-dropdown"
                    menuVariant="dark"
                    active={location.pathname === "/ask-ai"}
                  >
                    <NavDropdown.Item as={Link} to="/ask-ai">
                      Ask AI
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        )}
        {isAuthenticated && windowWidth > 768 && (
          <img
            ref={profileImgRef}
            src={user?.picture}
            className="userImg"
            onClick={() => setProfileDown((prev) => !prev)}
            alt="User profile"
          />
        )}
        {!isAuthenticated && location.pathname !== "/signUp" && (
          <button onClick={() => loginWithRedirect()}>Sign Up</button>
        )}
      </header>
      {isAuthenticated && (
        <DropDown
          functions={{ handleFeedback, logout }}
          values={[iconSize, isDarkTheme, profileDown, userNickname]}
          dropDownRef={dropDownRef}
        />
      )}
    </>
  );
}

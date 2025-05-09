import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Footer from "../Footer";
import {
  ArrowRight,
  BarChart3,
  Globe,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import screenshot from "../../assets/trendyHome.png";
import trendImg from "../../assets/trend.png";

const LandingContent: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="!flex !min-h-screen !flex-col !bg-[#242424] !text-white">
      {/* Hero Section */}
      <section className="!relative !overflow-hidden !py-20 md:!py-32">
        {/* Animated background elements */}
        <div className="!absolute !inset-0 !overflow-hidden">
          <div className="!absolute -!left-10 !top-20 !h-72 !w-72 !rounded-full !bg-[#ff5733]/20 !blur-[100px]"></div>
          <div className="!absolute -!right-10 !bottom-20 !h-72 !w-72 !rounded-full !bg-purple-500/20 !blur-[100px]"></div>
          <div className="!absolute !left-1/2 !top-1/2 !h-96 !w-96 -!translate-x-1/2 -!translate-y-1/2 !rounded-full !bg-blue-500/10 !blur-[120px]"></div>
        </div>

        <div className="!container !relative !mx-auto !px-4 md:!px-6">
          <div className="!grid !gap-12 lg:!grid-cols-2 lg:!gap-16">
            <div className="!flex !flex-col !justify-center !space-y-8">
              <div className="!space-y-4">
                <div className="!inline-flex !items-center !rounded-full !border !border-[#ff5733]/30 !bg-[#ff5733]/10 !px-4 !py-1 !text-sm !text-[#ff5733]">
                  <span className="!mr-2 !h-2 !w-2 !animate-pulse !rounded-full !bg-[#ff5733]"></span>
                  Discover what&apos;s trending now
                </div>
                <h1 className="!text-4xl !font-bold !tracking-tighter sm:!text-5xl md:!text-6xl">
                  Stay Ahead With{" "}
                  <span className="!bg-gradient-to-r !from-[#ff5733] !to-[#ff9f33] !bg-clip-text !text-transparent">
                    Trendy
                  </span>
                </h1>
                <p className="!max-w-[600px] !text-gray-300 md:!text-xl">
                  Get personalized trend insights based on your location,
                  curated from multiple services in real-time.
                </p>
              </div>
              <div className="!flex !flex-col !gap-3 min-[400px]:!flex-row">
                <Button
                  className="!relative !overflow-hidden !bg-gradient-to-r !from-[#ff5733] !to-[#ff9f33] !text-white !transition-all hover:!shadow-[0_0_20px_rgba(255,87,51,0.5)]"
                  onClick={() => loginWithRedirect()}
                >
                  <span className="!relative !z-10">Get Started</span>
                  <ArrowRight className="!relative !z-10 !ml-2 !h-4 !w-4" />
                  <span className="!absolute !inset-0 !bg-white !opacity-0 !transition-opacity hover:!opacity-20"></span>
                </Button>
                <Button
                  variant="outline"
                  className="!border-gray-600 !text-gray-200 !transition-all hover:!border-[#ff5733] hover:!text-[#ff5733]"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="!flex !items-center !justify-center">
              <div className="!relative !h-[400px] !w-full !max-w-[500px] !overflow-hidden !rounded-2xl !bg-gradient-to-br !from-[#333333] !to-[#1a1a1a] !shadow-[0_0_50px_rgba(255,87,51,0.3)]">
                <div className="!absolute !inset-0.5 !rounded-2xl !bg-gradient-to-br !from-[#ff5733] !via-purple-500 !to-blue-500 !opacity-30 !overflow-hidden"></div>
                <img
                  src={trendImg}
                  alt="Trendy App Dashboard"
                  className="object-cover p-1 relative z-10 object-contain w-full h-full !rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="!relative !py-20">
        <div className="!absolute !inset-0 !bg-[#2a2a2a]"></div>
        <div className="!container !relative !mx-auto !px-4 md:!px-6">
          <div className="!mb-12 !text-center">
            <div className="!mx-auto !mb-4 !flex !h-12 !w-12 !items-center !justify-center !rounded-full !bg-gradient-to-r !from-[#ff5733] !to-[#ff9f33]">
              <TrendingUp className="!h-6 !w-6 !text-white" />
            </div>
            <h2 className="!text-3xl !font-bold !tracking-tight sm:!text-4xl md:!text-5xl">
              Why Choose{" "}
              <span className="!bg-gradient-to-r !from-[#ff5733] !to-[#ff9f33] !bg-clip-text !text-transparent">
                Trendy
              </span>
            </h2>
            <p className="!mx-auto !mt-4 !max-w-[700px] !text-gray-300">
              Trendy pulls information from multiple services to give you the
              most relevant trend data based on your location.
            </p>
          </div>
          <div className="!grid !gap-8 sm:!grid-cols-2 lg:!grid-cols-3">
            <div className="!group !rounded-xl !bg-gradient-to-br !from-[#333333] !to-[#2a2a2a] !p-1 !shadow-xl !transition-all hover:!shadow-[0_0_30px_rgba(255,87,51,0.2)]">
              <div className="!h-full !rounded-lg !bg-[#2e2e2e] !p-8 !transition-transform !duration-300 group-hover:!-translate-y-1">
                <div className="!mb-4 !inline-flex !h-12 !w-12 !items-center !justify-center !rounded-full !bg-gradient-to-r !from-[#ff5733] !to-[#ff9f33] !text-white">
                  <TrendingUp className="!h-6 !w-6" />
                </div>
                <h3 className="!mb-3 !text-xl !font-bold">Real-time Trends</h3>
                <p className="!text-gray-300">
                  Get up-to-the-minute information on what&apos;s trending in
                  your area and beyond.
                </p>
              </div>
            </div>
            <div className="!group !rounded-xl !bg-gradient-to-br !from-[#333333] !to-[#2a2a2a] !p-1 !shadow-xl !transition-all hover:!shadow-[0_0_30px_rgba(147,51,255,0.2)]">
              <div className="!h-full !rounded-lg !bg-[#2e2e2e] !p-8 !transition-transform !duration-300 group-hover:!-translate-y-1">
                <div className="!mb-4 !inline-flex !h-12 !w-12 !items-center !justify-center !rounded-full !bg-gradient-to-r !from-purple-500 !to-violet-500 !text-white">
                  <MapPin className="!h-6 !w-6" />
                </div>
                <h3 className="!mb-3 !text-xl !font-bold">Location-Based</h3>
                <p className="!text-gray-300">
                  Customized trend information based on your current location
                  for maximum relevance.
                </p>
              </div>
            </div>
            <div className="!group !rounded-xl !bg-gradient-to-br !from-[#333333] !to-[#2a2a2a] !p-1 !shadow-xl !transition-all hover:!shadow-[0_0_30px_rgba(51,147,255,0.2)]">
              <div className="!h-full !rounded-lg !bg-[#2e2e2e] !p-8 !transition-transform !duration-300 group-hover:!-translate-y-1">
                <div className="!mb-4 !inline-flex !h-12 !w-12 !items-center !justify-center !rounded-full !bg-gradient-to-r !from-blue-500 !to-cyan-400 !text-white">
                  <Globe className="!h-6 !w-6" />
                </div>
                <h3 className="!mb-3 !text-xl !font-bold">Multiple Sources</h3>
                <p className="!text-gray-300">
                  Data aggregated from various services to provide comprehensive
                  trend insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Showcase Section */}
      <section className="!py-20">
        <div className="!container !mx-auto !px-4 md:!px-6">
          <div className="!mb-12 !text-center">
            <h2 className="!text-3xl !font-bold !tracking-tight sm:!text-4xl md:!text-5xl">
              See{" "}
              <span className="!bg-gradient-to-r !from-[#ff5733] !to-[#ff9f33] !bg-clip-text !text-transparent">
                Trendy
              </span>{" "}
              in Action
            </h2>
            <p className="!mx-auto !mt-4 !max-w-[700px] !text-gray-300">
              Discover how Trendy can help you stay informed about what&apos;s
              happening around you.
            </p>
          </div>
          <div className="!grid !gap-8 md:!grid-cols-2">
            <div className="!relative !h-[300px] !overflow-hidden !rounded-xl !bg-gradient-to-br !from-[#333333] !to-[#2a2a2a] !p-1 !shadow-xl sm:!h-[400px]">
              <div className="!absolute !inset-0 !rounded-xl !bg-gradient-to-br !from-[#ff5733] !via-purple-500 !to-blue-500 !opacity-20"></div>
              <img
                src={screenshot}
                alt="Trendy App Screenshot"
                className="!rounded-lg p-0.5 relative z-10 !object-contain"
                style={{ height: "100%", width: "100%" }}
              />
            </div>
            <div className="!flex !flex-col !justify-center !space-y-6">
              <div className="!inline-flex !items-center !rounded-full !border !border-[#ff5733]/30 !bg-[#ff5733]/10 !px-4 !py-1 !text-sm !text-[#ff5733]">
                <span className="!mr-2 !h-2 !w-2 !animate-pulse !rounded-full !bg-[#ff5733]"></span>
                Personalized Experience
              </div>
              <h3 className="!text-2xl !font-bold">Your Custom Dashboard</h3>
              <p className="!text-gray-300">
                Your personalized dashboard shows trends that matter to you,
                filtered by your interests and location.
              </p>
              <ul className="!space-y-3">
                <li className="!flex !items-center">
                  <div className="!mr-3 !rounded-full !bg-gradient-to-r !from-[#ff5733] !to-[#ff9f33] !p-1 !text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="!text-gray-200">
                    Customizable trend categories
                  </span>
                </li>
                <li className="!flex !items-center">
                  <div className="!mr-3 !rounded-full !bg-gradient-to-r !from-purple-500 !to-violet-500 !p-1 !text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="!text-gray-200">
                    Interactive trend visualizations
                  </span>
                </li>
                <li className="!flex !items-center">
                  <div className="!mr-3 !rounded-full !bg-gradient-to-r !from-blue-500 !to-cyan-400 !p-1 !text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="!text-gray-200">
                    Real-time notifications
                  </span>
                </li>
              </ul>
              <Button
                className="!w-fit !bg-gradient-to-r !from-[#ff5733] !to-[#ff9f33] !text-white !transition-all hover:!shadow-[0_0_20px_rgba(255,87,51,0.5)]"
                onClick={() => loginWithRedirect()}
              >
                Explore Features
                <ArrowRight className="!ml-2 !h-4 !w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="!relative !py-20">
        <div className="!absolute !inset-0 !bg-[#2a2a2a]"></div>
        <div className="!container !relative !mx-auto !px-4 md:!px-6">
          <div className="!mb-12 !text-center">
            <h2 className="!text-3xl !font-bold !tracking-tight sm:!text-4xl md:!text-5xl">
              How{" "}
              <span className="!bg-gradient-to-r !from-[#ff5733] !to-[#ff9f33] !bg-clip-text !text-transparent">
                Trendy
              </span>{" "}
              Works
            </h2>
            <p className="!mx-auto !mt-4 !max-w-[700px] !text-gray-300">
              Our simple process helps you stay informed about trends that
              matter to you.
            </p>
          </div>
          <div className="!grid !gap-8 md:!grid-cols-3">
            <div className="!relative !rounded-xl !bg-gradient-to-br !from-[#333333] !to-[#2a2a2a] !p-1 !text-center !shadow-xl">
              <div className="absolute -top-4 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-[#ff5733] to-[#ff9f33] text-white shadow-[0_0_15px_rgba(255,87,51,0.5)]">
                1
              </div>
              <div className="!h-full !rounded-lg !bg-[#2e2e2e] !p-8">
                <div className="!mb-4 !mt-4 !inline-flex !h-16 !w-16 !items-center !justify-center !rounded-full !bg-[#ff5733]/10 !text-[#ff5733]">
                  <Users className="!h-8 !w-8" />
                </div>
                <h3 className="!mb-3 !text-xl !font-bold">Create an Account</h3>
                <p className="!text-gray-300">
                  Sign up and tell us about your interests to personalize your
                  experience.
                </p>
              </div>
            </div>
            <div className="!relative !rounded-xl !bg-gradient-to-br !from-[#333333] !to-[#2a2a2a] !p-1 !text-center !shadow-xl">
              <div className="absolute -top-4 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-[0_0_15px_rgba(147,51,255,0.5)]">
                2
              </div>
              <div className="!h-full !rounded-lg !bg-[#2e2e2e] !p-8">
                <div className="!mb-4 !mt-4 !inline-flex !h-16 !w-16 !items-center !justify-center !rounded-full !bg-purple-500/10 !text-purple-400">
                  <MapPin className="!h-8 !w-8" />
                </div>
                <h3 className="!mb-3 !text-xl !font-bold">Enable Location</h3>
                <p className="!text-gray-300">
                  Allow location access to get trend information relevant to
                  your area.
                </p>
              </div>
            </div>
            <div className="!relative !rounded-xl !bg-gradient-to-br !from-[#333333] !to-[#2a2a2a] !p-1 !text-center !shadow-xl">
              <div className="absolute -top-4 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-[0_0_15px_rgba(51,147,255,0.5)]">
                3
              </div>
              <div className="!h-full !rounded-lg !bg-[#2e2e2e] !p-8">
                <div className="!mb-4 !mt-4 !inline-flex !h-16 !w-16 !items-center !justify-center !rounded-full !bg-blue-500/10 !text-blue-400">
                  <BarChart3 className="!h-8 !w-8" />
                </div>
                <h3 className="!mb-3 !text-xl !font-bold">Discover Trends</h3>
                <p className="!text-gray-300">
                  Explore trending topics, events, and activities in your area
                  and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="!relative !py-16">
        <div className="!absolute !inset-0 !overflow-hidden">
          <div className="!absolute !inset-0 !bg-gradient-to-r !from-[#ff5733] !to-[#ff9f33] !opacity-90"></div>
          <div className="!absolute !inset-0 !bg-[url('/placeholder.svg?height=200&width=200')] !bg-center !opacity-10"></div>
        </div>
        <div className="!container !relative !mx-auto !px-4 md:!px-6">
          <div className="!flex !flex-col !items-center !justify-between !gap-8 md:!flex-row">
            <div className="!max-w-[600px] !text-center md:!text-left">
              <h2 className="!text-3xl !font-bold !tracking-tight sm:!text-4xl">
                Ready to Stay Ahead of Trends?
              </h2>
              <p className="!mt-4 !text-white/90">
                Join thousands of users who are already discovering what&apos;s
                trending around them.
              </p>
            </div>
            <Button
              className="!relative !overflow-hidden !bg-white !text-[#ff5733] !transition-all hover:!bg-white/90 hover:!shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              onClick={() => loginWithRedirect()}
            >
              <span className="!relative !z-10">Sign Up Now</span>
              <ArrowRight className="!relative !z-10 !ml-2 !h-4 !w-4" />
              <span className="!absolute !inset-0 !bg-[#ff5733] !opacity-0 !transition-opacity hover:!opacity-10"></span>
            </Button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingContent;

import { Github, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#1a1918] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg text-white mb-4">Trendy</h3>
            <p className="!text-zinc-400 text-sm">
              Discover the latest trends and stay ahead of the curve with our
              curated content.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Navigation</h4>
            <ul className="space-y-2" style={{ paddingLeft: 0 }}>
              <li>
                <Link
                  to="/"
                  className="!text-zinc-400 hover:!text-[#ff5733] transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/trends"
                  className="!text-zinc-400 hover:!text-[#ff5733] transition-colors text-sm"
                >
                  Explore Trends
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="!text-zinc-400 hover:!text-[#ff5733] transition-colors text-sm"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/saved"
                  className="!text-zinc-400 hover:!text-[#ff5733] transition-colors text-sm"
                >
                  Saved Trends
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2" style={{ paddingLeft: 0 }}>
              <li>
                <Link
                  to="/privacy"
                  className="!text-zinc-400 hover:!text-[#ff5733] transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="!text-zinc-400 hover:!text-[#ff5733] transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="!text-zinc-400 hover:!text-[#ff5733] transition-colors text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Connect</h4>
            <div className="flex space-x-4">
              <Link
                to="https://github.com"
                className="!text-zinc-400 hover:!text-[#ff5733] transition-colors"
              >
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                to="https://twitter.com"
                className="!text-zinc-400 hover:!text-[#ff5733] transition-colors"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                to="https://instagram.com"
                className="!text-zinc-400 hover:!text-[#ff5733] transition-colors"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
            <p className="text-zinc-500 text-xs mt-4">
              © {new Date().getFullYear()} Trendy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

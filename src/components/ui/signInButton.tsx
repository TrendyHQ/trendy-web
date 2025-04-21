import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

interface SignUpButtonProps {
  className?: string;
}

export default function SignUpButton({ className = "" }: SignUpButtonProps) {
  const [isHovering, setIsHovering] = useState(false);
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      onClick={() => loginWithRedirect()}
      className={`relative group ml-auto mr-2 !rounded-md font-bold bg-white text-[#ff5733] hover:bg-gray-100 
        hover:scale-105 transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <PlusCircle
        className={`mr-2 h-4 w-4 transition-all duration-300 ${
          isHovering ? "rotate-90" : ""
        }`}
      />
      <span className="relative">
        Sign Up
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#ff5733] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      </span>
      <span className="absolute -z-10 top-0 left-0 w-full h-full bg-white !rounded-md blur-sm opacity-0 group-hover:opacity-70 transition-opacity"></span>
    </Button>
  );
}

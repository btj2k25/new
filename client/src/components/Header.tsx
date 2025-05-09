import React from "react";
import { MaterialIcon } from "@/lib/icons";

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-primary/90 to-primary border-b shadow-sm">
      <div className="absolute top-6 left-10 text-3xl font-bold"></div>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3">
            <MaterialIcon name="auto_awesome" className="w-8 h-8 text-white" />
            <span className="text-xl font-semibold text-white">Jiffy Prototypes</span>
          </a>
        </div>
        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="text-white/90 hover:text-white transition-colors"
          >
            Documentation
          </a>
          <a
            href="#"
            className="text-white/90 hover:text-white transition-colors"
          >
            Examples
          </a>
          <a
            href="#"
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-colors"
          >
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;

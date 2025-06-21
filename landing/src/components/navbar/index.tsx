import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

const Navbar = () => {
    return (
        <div className="relative w-full h-full">
            {/* Background blur effect */}
            <div className="z-[99] fixed pointer-events-none inset-x-0 h-[88px] bg-[rgba(2,6,23,0.8)] backdrop-blur-sm [mask:linear-gradient(to_bottom,#000_20%,transparent_calc(100%-20%))]"></div>

            <header className="fixed top-4 inset-x-0 mx-auto max-w-6xl px-4 md:px-12 z-[100]">
                <nav className="backdrop-blur-lg rounded-xl lg:rounded-2xl border border-[rgba(124,124,124,0.2)] px-4 md:px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Left side - Logo */}
                        <div className="flex items-center gap-2">
                            <Image 
                                src="/icons/bloom-logo.svg" 
                                alt="Bloom Logo" 
                                width={32} 
                                height={32}
                                className="w-8 h-8"
                            />
                            <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-clash-grotesk)' }}>Bloom</span>
                        </div>

                        {/* Center - Navigation items */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link 
                                href="#features" 
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                Features
                            </Link>
                            <Link 
                                href="#demo" 
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                Demo
                            </Link>
                        </div>

                        {/* Right side - CTA Button */}
                        <div>
                            <Link 
                                href="https://bloom-ai-dashboard.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                            >
                                Get started
                                <IconArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Navbar;
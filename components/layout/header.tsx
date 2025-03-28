import { Check, Dot, Twitter, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header = ({ isSidebarOpen, toggleSidebar }: HeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full h-12 bg-[#0284DA] grid grid-cols-3 sm:grid sm:grid-cols-3 gap-4 p-auto">
      <div className="flex items-center sm:items-left text-2xl font-bold sm:text-3xl sm:place-items-center ps-2 sm:ps-4">
        <div className="flex items-center">
          <h1 className="text-[#f2d898]">&lt;Be&gt;</h1>
          <h1 className="text-[#7ad1f4]">Copy</h1>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-4">
        <p className="text-[#ffd633] flex items-center sm:text-[12px] md:text-[12px] lg:text-lg">
          <Dot className="w-8 sm:h-8" />100% Free
        </p>
        <p className="text-[#00ff55] hidden sm:flex items-center justify-end sm:justify-center text-lg">
          <Check className="w-6 h-6 pe-2" />100+ Codes
        </p>
        <p className="text-[#ffd633] hidden sm:flex justify-end sm:items-center text-lg">
          <Dot className="w-8 h-8" />350 Live
        </p>
      </div>
      <div className="flex items-center justify-end text-white">
        <Twitter className="hidden sm:block w-10 h-10 pe-4" />
        <Button
          size="icon"
          className="xl:hidden text-white ml-2 outline-hidden bg-transparent hover:bg-transparent hover:text-white items-center"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

export default Header;
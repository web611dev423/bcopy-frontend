import { Check, Dot, Twitter, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header = ({ isSidebarOpen, toggleSidebar }: HeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full h-12 bg-[#0284DA] grid grid-cols-12">
      <div className="flex items-center sm:items-left text-2xl font-bold sm:text-3xl justify-start ps-2 sm:ps-4 col-span-4 sm:col-span-4">
        <div className="flex items-center ">
          <h1 className="text-[#f2d898]">&lt;Be&gt;</h1>
          <h1 className="text-[#7ad1f4]">Copy</h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center space-x-2 col-span-6 sm:col-span-4">
        <p className="text-[#ffd633] flex items-center text-[8px] lg:text-lg">
          <Dot className="w-3 sm:w-8 h-3 sm:h-8" />
          100% Free
        </p>
        <p className="text-[#00ff55] flex items-center text-[8px] lg:text-lg">
          <Check className="w-3 sm:w-6 h-3 sm:h-6 pe-0 sm:pe-2" />
          100+ Codes
        </p>
        <p className="text-[#ffd633]  flex items-center text-[8px] lg:text-lg">
          <Dot className="w-3 sm:w-8 w-3 sm:h-8" />
          350 Live
        </p>
      </div>
      <div className="flex items-center justify-end text-white col-span-2 sm:col-span-4">
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
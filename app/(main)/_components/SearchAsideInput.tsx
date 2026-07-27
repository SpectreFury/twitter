import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchAsideInput = () => {
  return (
    <div className="flex items-center px-4 border rounded-full text-gray-500">
      <Search className="h-4! w-4!" />
      <Input
        type="text"
        placeholder="Search"
        className="border-none outline-none focus-visible:ring-0 shadow-none text-black"
      />
    </div>
  );
};

export default SearchAsideInput;

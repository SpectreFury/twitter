import { Search } from "lucide-react";
import SearchAsideInput from "./SearchAsideInput";
import SubscribeBox from "./SubscribeBox";
import {Input} from '@/components/ui/input'

const SearchAside = () => {
  return (
    <aside className="mt-4 flex flex-col gap-4 max-w-sm">
      <div className="w-full flex items-center px-4 border rounded-full text-gray-500">
        <Search className="h-4! w-4!" />
        <Input
          type="text"
          placeholder="Search"
          className="border-none outline-none focus-visible:ring-0 shadow-none text-black"
        />
      </div>

      <SubscribeBox />
    </aside>
  );
};

export default SearchAside;

import SearchAsideInput from "./SearchAsideInput";
import SubscribeBox from "./SubscribeBox";

const SearchAside = () => {
  return (
    <aside className="mt-4 flex flex-col gap-4 max-w-sm">
      <SearchAsideInput />
      <SubscribeBox />
    </aside>
  );
};

export default SearchAside;

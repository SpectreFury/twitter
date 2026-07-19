import NavigationAside from "./_components/NavigationAside";
import SearchAside from "./_components/SearchAside";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex justify-between container mx-auto">
      <NavigationAside />

      <div>{children}</div>

      <SearchAside />
    </div>
  );
};

export default MainLayout;

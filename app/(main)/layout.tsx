import AuthProvider from "@/components/providers/AuthProviders";
import NavigationAside from "./_components/NavigationAside";
import SearchAside from "./_components/SearchAside";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <AuthProvider>
      <div className="flex justify-between container mx-auto">
        <NavigationAside />

        <div>{children}</div>

        <SearchAside />
      </div>
    </AuthProvider>
  );
};

export default MainLayout;

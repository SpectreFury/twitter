import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

const TopBar = () => {
  return (
    <div className="flex items-center justify-between w-2xl gap-6 border-x">
      <Button variant="ghost" className="rounded-full">
        <ArrowLeft />
      </Button>

      <div className="flex-1">
        <div className="text-xl font-semibold">Ayush Soni</div>
        <div className="text-sm text-muted-foreground">230 posts</div>
      </div>

      <Button variant="ghost" className="rounded-full">
        <Search />
      </Button>
    </div>
  );
};

export default TopBar;

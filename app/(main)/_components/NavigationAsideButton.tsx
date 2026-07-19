import Link from "next/link";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { usePathname } from "next/navigation";

type NavigationAsideButtonProps = {
  href: string;
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

const NavigationAsideButton = ({
  href,
  icon: Icon,
  title,
}: NavigationAsideButtonProps) => {
  const pathname = usePathname();
  const isActiveStyles = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`w-fit flex items-center gap-4 px-4 py-2.5 rounded-full hover:bg-slate-200 ${isActiveStyles ? "font-bold" : ""}`}
      >
        <Icon size={30}/>
        <div className="text-lg">{title}</div>
      </Link>
    </li>
  );
};

export default NavigationAsideButton;

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import Link from 'next/link'

type User = {
  createdAt: string;
  email: string;
  first_name: string;
  handle: string;
  id: number;
  image_url: string;
  last_name: string;
  sub: string;
  updatedAt: string;
};

type SearchAsideInputProps = {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  users: User[];
  loading: boolean;
  error: boolean;
};

const SearchAsideInput = ({
  value,
  onChange,
  users,
}: SearchAsideInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full flex items-center px-4 border rounded-full text-gray-500">
        <Search className="h-4! w-4!" />
        <Input
          value={value}
          type="text"
          placeholder="Search"
          className="border-none outline-none focus-visible:ring-0 shadow-none text-black"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <div>
        {users && users.length ? (
          <Card>
            <CardContent>
              {users.map((user) => (
                <Link href={`/${user.handle}`} className="flex gap-2">
                  <Image
                    src={user.image_url}
                    alt="User image"
                    width={40}
                    height={40}
                    className="rounded-sm"
                  />
                  <div>
                    <div className="font-semibold">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-muted-foreground">@{user.handle}</div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default SearchAsideInput;

"use client";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/actions/auth";
import { CircleUser, UserIcon } from "lucide-react";
import Link from "next/link";
import { User } from "lucia";

export function AvatarMenu(user: User) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-6 w-6" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <p className="font-medium">Hi, {user.username}</p>
        </DropdownMenuLabel>
        {user.role === "admin" ? (
          <>
            <DropdownMenuSeparator />
            <Link href="/users">
              <DropdownMenuItem className="flex gap-2  items-center">
                <UserIcon size={16} />
                Manage user
              </DropdownMenuItem>
            </Link>
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={logoutAction}>
            <Button size="lg">Sign out</Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

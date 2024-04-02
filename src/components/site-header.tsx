'use client'
import Link from "next/link";
import Image from "next/image";
import { validateRequest } from "@/lib/auth";
import { ModeToggle } from "@/components/mode-toggle";
import { AvatarMenu } from "./avatar-menu";
import { BackBtn } from "./back-btn";
import { User } from "lucia";
import { useAuth } from "@/context/AuthContext";


export function SiteHeader() {
  const { user } = useAuth();
  if (!user) return null
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="px-4 container grid grid-cols-[auto_1fr] h-16 max-w-screen-2xl items-center ">
        <div className="flex justify-end items-center center gap-3">
          <BackBtn />
          
            <Link href="/">
            <Image
              className="h-10 w-auto dark:hidden"
              src="/logo.png"
              alt="karmaholic media logo"
              height={250}
              width={1000}
              style={{ objectFit: "cover" }}
            />
          </Link>
          <Link href="/">
            <Image
              className="h-10 w-auto hidden dark:block"
              src="/logo-light.png"
              alt="karmaholic media logo"
              height={250}
              width={1000}
              style={{ objectFit: "cover" }}
            />
          </Link>
        </div>
        <div className="flex justify-end gap-3">
          <ModeToggle></ModeToggle>
           {user && <AvatarMenu {...user}/>}
        </div>
      </div>
    </header>
  );
}

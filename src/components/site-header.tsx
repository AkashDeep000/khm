'use client'
import Link from "next/link";
import Image from "next/image";
import { validateRequest } from "@/lib/auth";
import { ModeToggle } from "@/components/mode-toggle";
import { AvatarMenu } from "./avatar-menu";
import { BackBtn } from "./back-btn";
import { User } from "lucia";
import { useAuth } from "@/context/AuthContext";


export async function SiteHeader() {
  const { user } = useAuth();
  if (!user) return null
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="px-4 container grid grid-cols-[auto_1fr] h-16 max-w-screen-2xl items-center ">
        <div className="flex justify-end items-center center gap-3">
          <BackBtn />
          <Link href="/" className="text-xl font-bold">
            {/* <Image
              className="h-10 w-auto"
              src="/logo.png"
              alt="NeetPrep Logo"
              height={192}
              width={52}
              style={{ objectFit: "cover" }}
            /> */}
            KHM {user.role === "admin" && "| Admin"}
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

'use client';

import { useEffect, useState } from "react";
import { auth } from "../_firebase/Config"; // 確保這個路徑是正確的
import { signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from "@/components/ui/button";
import router from "next/router";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const provider = new GoogleAuthProvider();

export default function HeaderSticker() {
  const [user, setUser] = useState<User | null>(null);

    // 確保只在 client side 執行
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        return setUser(currentUser);
      });

      return () => unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          console.log("登入成功！", user.displayName, user.email);
          // 可跳轉頁面或儲存 user.uid 當 chatId
        } catch (error) {
          console.error("Google 登入失敗：", error);
        }
      };

  return (
<div>
    {user ? (
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <img
            className="inline-block size-10 rounded-full ring-2 ring-white cursor-pointer hover:brightness-110 transition"
            src={
              user?.photoURL ??
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?..."
            }
            alt={user?.displayName ?? "User"}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="center" className="w-40">
        <DropdownMenuLabel>{user?.displayName ?? "使用者"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
                      if (confirm("確定要登出嗎？")) {
                        signOut(auth)
                    .then(() => {
                      console.log("Logout successful!");
                      alert("登出成功！");
                      router.push("/"); // 登出後導向首頁
                    })
                    .catch((error) => {
                      console.error("Logout fail：", error);
                    });
                      }
                    }}
        >
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    ) : (
      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 button"
      >
        使用 Google 登入
    </button>
      
    )}
</div>  
  );
}

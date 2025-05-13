"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useRef } from 'react';

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { pages } from "next/dist/build/templates/app-page"

export function ModeToggle() {
  const { setTheme } = useTheme()

  const toggleFilter = (mode: string) => {
    const body = document.body
    if (mode === "light") {
      body.style.filter = "invert(0)"
    } else if (mode === "dark") {
      body.style.filter = "invert(1)"
    } else {
      body.style.filter = ""  // 預設情況下根據系統設置來決定
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800">
        <DropdownMenuItem onClick={() => { toggleFilter("light"); setTheme("light") }}>
          淺色模式
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { toggleFilter("dark"); setTheme("dark") }}>
          深色模式
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


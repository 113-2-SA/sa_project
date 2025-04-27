// export default function Navbar() {
//     return (
//     <div>
//       <button>nav</button>
//     </div>
//     )
//   }

'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import { useRouter } from "next/navigation";
import Login from '@/app/login/page'
import HeaderSticker from '@/components/profile';
import { ModeToggle } from './ui/modetoggle'

const products = [
  { name: 'Groq ', description: 'Get a better understanding of your traffic', href: '/', icon: ChartPieIcon },
  { name: 'Deepseek', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Claude', description: 'Your customers data will be safe and secure', href: '#', icon: FingerPrintIcon },
]
const callsToAction = [
  { name: '前往系網', href: 'https://www.im.fju.edu.tw/', icon: PlayCircleIcon },
  {
    name: '聯絡系上',
    onClick: () => alert(`大學部秘書TEL：+886-2-2905-2666
                          碩士班秘書TEL：+886-2-2905-2940
                          碩職班秘書TEL：+886-2-2905-2626
                          FAX：+886-2-2905-2182`),
    icon: PhoneIcon
  },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();//指定變數router為useRouter()

  useEffect(() => {
    setIsClient(true); // 當組件已經載入到客戶端後，設置為 true
  }, []);

  const ClickTest = () => {
    console.log("Button clicked");
    router.push("/test");//觸發handleClick時，導向/test
  }

  const ClickProfile = () => {
    console.log("Button clicked");
    router.push("/profile");//觸發handleClick時，導向/profile
  }


  if (!isClient) {
    return null; // 當未載入至客戶端時不渲染內容
  }



  return (
    <header className="bg-white sticky top-0 left-0 w-full z-50 shadow-lg shadow-sky-200/30" style={{ marginBottom: 0 }}>
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5 flex items-center">
            <span className="sr-only">SA Project</span>
            <img
              alt=""
              src="https://cdn-icons-png.freepik.com/512/452/452538.png"
              className="h-8 w-auto"
            />
            <span className="ml-2 text-gray-900 font-semibold text-[20px]">SA Project</span>
          </a>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            {/* <span className="sr-only">Open</span> */}
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative shape-ex1">
            <PopoverButton className="flex items-center text-sm font-semibold text-gray-900 shape-ex1">
              模型
              <ChevronDownIcon aria-hidden="true" className="ml-1 h-5 w-5 text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white ring-1 shadow-lg ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="p-4">
                {products.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex flex-col rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-x-4">
                      <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                      </div>
                      <a href={item.href} className="block font-semibold text-gray-900">
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                    </div>
                    <p className="mt-2 text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {callsToAction.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                  >
                    <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <button className="text-sm/6 font-semibold text-gray-900 shape-ex1" onClick={ClickTest}>系上提問社群</button>

          <button className="text-sm/6 font-semibold text-gray-900 shape-ex1" onClick={ClickProfile}>課表</button>

          <button className="text-sm/6 font-semibold text-gray-900 shape-ex1" onClick={ClickProfile}>我的貼文</button>

          <ModeToggle />

        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <HeaderSticker />
        </div>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                    <span>BOT models</span>
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>

                <button className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50" onClick={ClickTest}>系上提問社群</button>

                <button className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50" onClick={ClickProfile}>課表</button>

                <button className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50" onClick={ClickProfile}>我的貼文</button>

              </div>
              <div className="py-6">

                <HeaderSticker />
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

    </header>
  )
}

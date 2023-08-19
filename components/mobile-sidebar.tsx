"use client"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";

interface MobileSidebarProps {
    apiLimitCount: number;
    isPro: boolean
}
const MobileSidebar = ({apiLimitCount = 0,isPro = false}:MobileSidebarProps) => {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true)
      }, []);

    if(!isMounted){
        return null
    }

    // const [active , setActive ] = useState(false)
    return (
        <Sheet>
            <SheetTrigger >
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            {
            (<SheetContent side="left" className={` p-0 text-white`} >
                <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
            </SheetContent>)  
            }
            

        </Sheet>
    );
}

export default MobileSidebar;
import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "@/components/mobile-sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subsciption";

const Navbar = async() => {
    const isPro = await checkSubscription();
    const apiLimitCount = await getApiLimitCount();
    return (
        <div className="flex items-center p-4">
            <MobileSidebar isPro={isPro} apiLimitCount = {apiLimitCount}/>
            <div className="flex w-full justify-end">
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    )
}
export default Navbar;
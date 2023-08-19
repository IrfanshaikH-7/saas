"use Client"

import { useEffect } from "react"
import { Crisp } from "crisp-sdk-web"

export const CrispChat = () => {
    useEffect(()=> {
        Crisp.configure("63ae3d1c-19b6-4739-b3f2-3d2b679302e2");
 
    },[])

    return null;
}
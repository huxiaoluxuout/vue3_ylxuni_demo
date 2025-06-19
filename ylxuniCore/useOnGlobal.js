import {ylxEventBus} from "@/ylxuniCore/useylxuni";

export function useOnGlobal(callbackData) {
    ylxEventBus.onGlobal(({args,source})=>{
        console.log('ylxEventBus',args[0], source)
        args[0].thenCallback(callbackData)
    })
}

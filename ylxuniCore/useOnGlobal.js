import {ylxEventBus} from "@/ylxuniCore/useylxuni";

export function useOnGlobal(callbackData) {
    ylxEventBus.onGlobal(({args,source})=>{
        console.log('ylxEventBus',args[0])
        console.log('ylxEventBus.source',source)
        args[0].thenCallback(callbackData)
    })
}

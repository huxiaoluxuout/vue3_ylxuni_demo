import {useInterceptorProxy} from "@/.yalc/ylxuni/src/utils/useInterceptorProxy";


export default function ({onSuccess, onError, isNext}) {
    console.log(isNext);
    const Object = (typeof isNext !== 'object' || isNext === null) ? {isPassed: isNext} : isNext

    const {createInterceptor: interceptor, proxyObject} = useInterceptorProxy(Object)
    console.log('proxyObject', proxyObject)
    return interceptor({onSuccess, onError})
}


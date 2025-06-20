import {reactive} from 'vue'
import ylxuni from "/.yalc/ylxuni/dist/ylxuni.esm.js"
// import ylxuni from "@/ylxuniCore/ylxuni.esm.js"
const ylxInstance = ylxuni(uni, reactive)
export const {ylxEventBus, ylxMustLogIn, ylxNextPage} = ylxInstance





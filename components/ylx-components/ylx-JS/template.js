import {convertStyleObjectToString} from "@/utils/tools.js";

 const localStringStyle = (style) => {
    if (typeof style === 'string') {
        return style;
    } else {
        return convertStyleObjectToString({
            ...style
        })
    }
};

 const componentsMixin = {
    options: {
        virtualHost: true
    },
    props: {
        customStyle: {
            type: [Object, String],
            default: () => ({})
        },
        customClass: {
            type: String,
            default: ''
        },

    },
     computed: {
         customStringStyle() {
             return localStringStyle(this.customStyle)
         },
     }
};
export {
    localStringStyle,
    componentsMixin
}

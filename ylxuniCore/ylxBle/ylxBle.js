import {BleManager} from "@/ylxuniCore/ylxBle/BleManager";


export const serviceId = '646687FB-033F-9393-6CA2-0E9401ADEB32'
export const BleName = 'LT5009NEW'
export const Service = '646687F0-033F-9393-6CA2-0E9401ADEB32'

export const ylxBle = new BleManager({
    advertisServiceUUIDs: ['32EBAD01-940E-A26C-9393-3F03FB876664'],
    serviceId: serviceId,
    name: BleName
})
export const CHARACTERISTICSLIST = [
    {
        "uuid": "64668732-033F-9393-6CA2-0E9401ADEB32",
        "properties": {
            "read": false,
            "write": true,
            "notify": true,
            "indicate": false
        }
    },
    {
        "uuid": "64668736-033F-9393-6CA2-0E9401ADEB32",
        "properties": {
            "read": false,
            "write": false,
            "notify": true,
            "indicate": false
        }
    },
    {
        "uuid": "64668730-033F-9393-6CA2-0E9401ADEB32",
        "properties": {
            "read": false,
            "write": false,
            "notify": true,
            "indicate": false
        }
    },
]


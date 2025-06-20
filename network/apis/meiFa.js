import {request} from '@/network/request'

// 获取版本
export const updateVersion = (data) => request({url: '/update.json?temp='+Date.now(), method: 'get', data});
export const updateVersion2 = (data) => request({url: '/update2.json?temp='+Date.now(), method: 'get', data});
export const updateVersion3 = (data) => request({url: '/update3.json?temp='+Date.now(), method: 'get', data});


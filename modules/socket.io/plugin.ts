import {defineNuxtPlugin} from "nuxt/app";
import type {Socket} from "socket.io-client";
import {io} from "socket.io-client";

let socket: Socket;

// 用于存储用户注册的 message 回调
const messageHandlers: ((data: any) => void)[] = [];

export default defineNuxtPlugin({
    name: 'websocket-client',
    enforce: 'pre',
    async setup() {
        const socketInfo = ref({
            status: false,
            // 提供一个方法，让用户可以注册 message 回调
            message: (handler: (data: any) => void) => {
                if (typeof handler === 'function') {
                    messageHandlers.push(handler);
                }
            }
        });

        const connectSocketServer = async () => {
            const metadata = await fetch('/api/metadata.json').then(r => r.json())
            console.log(metadata)


            // 创建 socket.io 客户端实例
            const url = `${location.protocol.replace('http', 'ws')}//${location.hostname}:${metadata.websocket}`
            socket = io(url, {
                transports: ['websocket'],
            });

            // 监听连接成功
            socket.on('connect', () => {
                console.log('WebSocket 连接成功:', socket?.id);
                socketInfo.value.status = true
            });

            // 监听断开
            socket.on('disconnect', (reason) => {
                console.log('WebSocket 已断开:', reason);
                socketInfo.value.status = false
            });

            socket.on('message', (message) => {
                console.log('WebSocket 收到消息:', message);
                messageHandlers.forEach(handler => handler(message));
            });
        }

        const sendMessage = (content: string) => socket?.send(content)

        return {
            provide: {
                socketInfo,
                connectSocketServer,
                sendMessage
            }
        }
    },
})
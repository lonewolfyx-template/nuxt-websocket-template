import { ref, watch } from 'vue';
import { useNuxtApp } from '#app';
import type { UseWebSocketReturn } from '@vueuse/core';

// 定义请求和响应的通用接口
interface SocketRequest {
    id: string;
    type: string;
    payload?: any;
}

interface SocketResponse {
    id: string;
    success: boolean;
    data?: any;
    error?: string;
}

// 定义请求-响应 API 的类型
interface SocketApi {
    getUserList: () => Promise<any[]>;
    getUser: (id: number) => Promise<any>;
    // 在这里添加你所有的 API 方法，保持和后端的 type 名称一致
    // 例如：
    // postMessage: (message: { text: string }) => Promise<void>;
}

// 存储等待响应的 Promise 的 Map
const pendingRequests = new Map<string, (response: SocketResponse) => void>();

export const useSocket = () => {
    const { $websocket } = useNuxtApp() as { $websocket: UseWebSocketReturn<any> };

    if (!$websocket || !$websocket.send) {
        throw new Error('WebSocket instance not found. Make sure the plugin is correctly configured and working.');
    }

    // 使用 watch 监听 `data` 属性的变化
    watch($websocket.data, (newMessage) => {
        if (newMessage) {
            try {
                const response: SocketResponse = JSON.parse(newMessage);
                const resolve = pendingRequests.get(response.id);

                if (resolve) {
                    resolve(response);
                    pendingRequests.delete(response.id);
                }
            } catch (e) {
                console.error('Failed to parse WebSocket message:', e);
            }
        }
    });

    /**
     * 核心请求函数，处理 Promise 和消息发送
     */
    const _request = <T>(type: string, payload?: any): Promise<T> => {
        return new Promise((resolve, reject) => {
            const requestId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

            pendingRequests.set(requestId, (response: SocketResponse) => {
                if (response.success) {
                    resolve(response.data as T);
                } else {
                    // 抛出服务端返回的错误，以确保前端能捕获到
                    reject(new Error(response.error || 'Unknown server error'));
                }
            });

            const requestMessage: SocketRequest = {
                id: requestId,
                type,
                payload,
            };

            $websocket.send(JSON.stringify(requestMessage));
        });
    };

    /**
     * 创建一个 Proxy 对象，用于动态地处理函数调用
     */
    const request = ref(new Proxy({}, {
        get: (target, prop: string) => {
            // 返回一个函数，这个函数能够接受参数并传递给 _request
            return (...args: any[]) => {
                // 将所有参数打包成一个对象作为 payload
                const payload = args.length > 0 ? args[0] : undefined;
                return _request(prop, payload);
            };
        }
    }) as SocketApi);

    return {
        request,
        status: $websocket.status,
        close: $websocket.close,
        open: $websocket.open,
        send: $websocket.send,
    };
};
import {defineWebSocketHandler} from 'h3';
import type {Peer} from "crossws";

// 假设这是你的请求和响应类型
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

export default defineWebSocketHandler({
    open(peer: Peer) {
        console.log('New client connected.');
        // 可以在这里发送欢迎消息
    },
    async message(peer, message) {
        try {
            const request: SocketRequest = JSON.parse(message.toString());
            console.log('Received request:', request);

            const response: SocketResponse = {
                id: request.id,
                success: false
            };

            // 根据请求类型进行处理
            switch (request.type) {
                case 'getUser':
                case 'getUserList':
                    // 模拟从数据库获取数据
                    response.success = true;
                    response.data = {
                        id: 1,
                        name: 'John Doe',
                        email: 'john.doe@example.com'
                    };
                    break;
                // 添加其他请求类型
                default:
                    response.success = false;
                    response.error = 'Unknown request type';
            }

            // 发送响应
            peer.send(JSON.stringify(response));
        } catch (e) {
            console.error('Failed to parse or handle WebSocket message:', e);
            peer.send(JSON.stringify({
                id: '', // 可以是空，或者一个特定的错误ID
                success: false,
                error: 'Invalid message format'
            }));
        }
    },
    close(peer) {
        console.log('Client disconnected.');
    },
    error(peer, error) {
        console.log("[ws] error", peer, error);
    },
});
// https://nuxt.com/docs/4.x/api/utils/define-nuxt-plugin

export default defineNuxtPlugin({
    name: 'socket-client',
    enforce: 'pre',
    setup() {

        const socket = useWebSocket('/ws/visitors', {
            autoReconnect: true
        })

        if (import.meta.hot) {
            console.log('当前处于 HMR 热更新环境');
            // 监听模块热更新事件
            import.meta.hot.accept(() => {
                console.log('模块已热更新');
            });
        }

        const {status, close, open, send} = socket

        return {
            provide: {
                websocket: socket,
                socket: {
                    status: status,
                    close,
                    open,
                    send
                }
            }
        }
    }
})
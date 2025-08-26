import {addPlugin, addServerHandler, createResolver, defineNuxtModule} from 'nuxt/kit'

export default defineNuxtModule({
    meta: {
        name: 'socket',
        configKey: 'socket'
    },
    setup(options, nuxt) {
        const {resolve} = createResolver(import.meta.url)

        // 1. 注册后端 socket 路由
        // addServerHandler({
        //     route: '/ws/visitors',
        //     handler: resolve('./nitro/server/routes/socket.ts')
        // })
        //
        // addPlugin({
        //     src: resolve('./nitro/plugins/plugin.ts'),
        //     mode: 'client'
        // })
        //
        // nuxt.hook('imports:dirs', (dirs) => {
        //     dirs.push(resolve('./nitro/composables'))
        // })

        addServerHandler({
            route: '/api/metadata.json',
            method: 'get',
            handler: resolve('./socket.io/server/metadata.ts'),
            env: 'dev',
        })

        addPlugin({
            src: resolve('./socket.io/plugin.ts'),
            mode: 'client'
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve('./socket.io/composables'))
        })
    }
})
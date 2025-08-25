import {addPlugin, addServerHandler, createResolver, defineNuxtModule} from 'nuxt/kit'

export default defineNuxtModule({
    meta: {
        name: 'socket',
        configKey: 'socket'
    },
    setup(options, nuxt) {
        const {resolve} = createResolver(import.meta.url)

        // 1. 注册后端 socket 路由
        addServerHandler({
            route: '/ws/visitors',
            handler: resolve('./runtime/server/routes/socket.ts')
        })

        addPlugin({
            src: resolve('./runtime/plugins/plugin.ts'),
            mode: 'client'
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve('./runtime/composables'))
        })

    }
})
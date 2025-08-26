import {defineEventHandler} from 'h3'
import {getPort} from "get-port-please";
import {createServer} from "http";
import {Server} from "socket.io";

export default defineEventHandler(async () => {
    // 这里面定义好 websocket 曝光的 socket 配置端口
    const port = await getPort({port: 7812, random: true})

    const httpServer = createServer();
    const io = new Server(httpServer, {
        // options
    });

    io.on("connection", (socket) => {

        console.log('websocket is connection')

        socket.on('message', (message) => {
            console.log('websocket is message', message.toString())
            socket.emit('message', 'hello world')
        })

        socket.on('error', () => {
            console.log('websocket is error')
        })
        socket.on('disconnect', () => {
            console.log('websocket is disconnect')
        })
    });

    httpServer.listen(port, () => {
        console.log(`Socket.io server listening on port ${port}`);
    });

    return {
        websocket: port
    }
})
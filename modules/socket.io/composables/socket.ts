export const useWebSocket = () => {
    const {$sendMessage} = useNuxtApp()
    return $sendMessage
}

export const useSocketInfo = () => {
    const {$socketInfo} = useNuxtApp()
    return $socketInfo
}
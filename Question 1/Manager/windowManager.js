let window = []
const WINDOW_SIZE = 10

export const updateWindow = (newNumbers) => {
    for(const num of newNumbers) {
        if(!window.includes(num)) {
            if(window.length >= WINDOW_SIZE){
                window.shift()
            }
            window.push(num)
        }
    }
}

export const getWindowState = () => {
    return [...window]
}

export const getAverage = () => {
    if(window.length === 0) return 0.0
    const sum = window.reduce((a,b) => a + b , 0)
    return parseFloat((sum / window.length).toFixed(2))
}
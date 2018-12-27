const key = "wecahtPanel"



export const getLocalData = () => {
    const panelData = JSON.parse(localStorage.getItem(key) || '[]')
    return panelData
}



export const addLocalData = (panelData) => {
    localStorage.setItem(key,JSON.stringify(panelData))
}
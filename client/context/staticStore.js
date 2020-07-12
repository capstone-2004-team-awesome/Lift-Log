const staticStore = {}

const URL = 'https://teachablemachine.withgoogle.com/models/ByPivKL7e/'
// const modelURL = URL + 'model.json'
// const metadataURL = URL + 'metadata.json'

// staticStore.model = {
// 	checkPoint: 'https://storage.googleapis.com/tm-pro-a6966.appspot.com/vince-arrows/model.json'
// }
staticStore.model = {
  modelURL: `${URL}model.json`,
  metadataURL: `${URL}metadata.json`
}

export default staticStore

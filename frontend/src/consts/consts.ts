export const SERVER_URI = window.location.href.includes("localhost") ? "http://localhost:5000/" : "/"

export const MODEL_DATA = [
  {
    name: 'Transfomer',
    author: 'Vaswani et al. 2017',
    components: {
      "cpu": {
        "Intel i7 2600K": 1
      },
      "gpu": {
        "geforce-gtx-1080-ti": 4
      }
    },
    serverData: {
      "cpu": { 
        "epoch" : [.05, .05, .05, .05, .05, .05]
      },
      "gpu": {
        "epoch": [.05, .05, .05, .05, .05, .05]
      } 
    },
    location: "Georgia",
    PUE: 1.59
  },
  {
    name: 'BERT',
    author: 'Devlin et al. 2018',
    components: {
      "cpu": {
        "Intel i7 2600K": 2
      },
      "gpu": {
        "geforce-rtx-2080-ti": 8
      }
    },
    serverData: {
      "cpu": { 
        "epoch" : [.1, .1, .1, .1, .1, .1]
      },
      "gpu": {
        "epoch": [.1, .1, .1, .1, .1, .1]
      } 
    },
    location: "Wyoming",
    PUE: 1.59
  }
]

import { observable, action, makeObservable, runInAction } from 'mobx';
import { SERVER_URI, MODEL_DATA } from '../consts/consts'

const copyObject = (object) => {
  return JSON.parse(JSON.stringify(object));
}

export class TrackerStore {
  @observable counterfactualMode = false;
  @observable counterfactualAlert = false;
  @observable initialComponents = {
    "gpu" : {},
    "cpu" : {}
  };
  @observable initialState = "Georgia"
  @observable initialPUE = 1.58
  @observable hoveredState = null;
  // @observable clickedState = "Georgia"
  @observable modelIdx = 0;
  @observable alternativeModelIdx = null;

  startComponents = {
    "gpu" : {},
    "cpu" : {}
  };

  startState = "Georgia";
  startPUE = 1.58;

  constructor() {
    makeObservable(this);
    this.getInitialState();
  }

  async getInitialState () {
    // this.resetTracker();
    this.setModelSource(0)
    // fetch(SERVER_URI + "initial-setup").then((response) => response.json())
    //   .then((data) => {
    //     // bit hacky, find a better way to deepclone so the states aren't the same...
    //     runInAction(() => {
    //       this.startComponents = copyObject(data["component_names"])
    //       this.initialComponents = copyObject(data["component_names"])
  
    //       this.startState = copyObject(data["state"])
    //       this.initialState = copyObject(data["state"])
          
    //       this.counterfactualMode = copyObject(data["paused"])
    //     })
    // })    
  }

  @action resetTracker () {
    this.initialComponents = copyObject(this.startComponents);
    this.initialState = this.startState;
    this.initialPUE = this.startPUE
    this.counterfactualMode = false;
    this.counterfactualAlert = false;
    this.alternativeModelIdx = null
    this.hoveredState = null
    this.modelIdx = null;
  }

  // data source actions
  @action setModelSource (newIdx) {

    if (newIdx == null) {
      this.resetTracker();
      return
    }

    this.modelIdx = newIdx
    this.initialComponents = Number.isFinite(this.modelIdx) ? MODEL_DATA[this.modelIdx]["components"] : copyObject(this.startComponents)
    this.alternativeModelIdx = null
    this.hoveredState = null
    if (Number.isFinite(this.modelIdx)) this.initialState = MODEL_DATA[newIdx].location
  }

  @action setAlternativeModel (newIdx) {

    // can't set the selected model as the alternative
    // can't set an alternative when nothing is selected
    if (this.modelIdx == newIdx || !Number.isFinite(this.modelIdx)) return;

    if (this.alternativeModelIdx == newIdx) {
      this.resetTracker();
      return
    } 
    
    this.alternativeModelIdx = newIdx
    this.hoveredState = MODEL_DATA[newIdx].location

  } 

  // alternative mode actions

  @action promptAlternativeMode () {
    this.counterfactualAlert = true;
  }

  @action enterAlternativeMode () {
    this.counterfactualAlert = false;
    this.counterfactualMode = true;
  }

  // map actions

  @action setHoveredState (newState) {
    this.hoveredState = newState
    if (newState == null && this.alternativeModelIdx) {
      this.hoveredState = MODEL_DATA[this.alternativeModelIdx].location
    }
  }

  // hardware actions

  @action setPUE (newPUE) {
    this.initialPUE = newPUE
  }

  @action updateHardware () {

  }

}

export default new TrackerStore();

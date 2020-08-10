import * as Redux from "redux";

import { ActionType } from "../../../shared/enums";

interface LoadingStatus {
  loadingData: boolean
  dataLoaded: boolean
  loadingTier: boolean
  tierLoaded: boolean
}

import { initialLoadingStatus } from "./initial-state";

export const loadingStatusReducer: Redux.Reducer<LoadingStatus> = (loadingStatus = initialLoadingStatus, action): LoadingStatus => {

  switch(action.type) {

    case ActionType.LoadingData:
      return Object.assign({}, loadingStatus, {loadingData: true});
    case ActionType.DataLoaded:
      return Object.assign({}, loadingStatus, {loadingData: false, dataLoaded: true});
    case ActionType.LoadingTier:
      return Object.assign({}, loadingStatus, {loadingTier: true, tierLoaded: false});
    case ActionType.TierLoaded:
      return Object.assign({}, loadingStatus, {loadingTier: false, tierLoaded: true});

    default:
      return loadingStatus;
  }

};

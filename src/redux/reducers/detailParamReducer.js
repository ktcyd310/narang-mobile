import { SET_DETAIL_PARAM_SUCCESS } from "../actions/detailParamActions";

const initState = {};

const detailParamReducer = (state = initState, action) => {

    if (action.type === SET_DETAIL_PARAM_SUCCESS) {
        return {
            ...state,
            detailParam: action.payload
        };
    }

    return state;
};

export default detailParamReducer;

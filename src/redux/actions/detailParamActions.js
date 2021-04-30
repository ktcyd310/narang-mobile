export const SET_DETAIL_PARAM_SUCCESS = "SET_DETAIL_PARAM_SUCCESS";

const setDetailParamSuccess = (param) => ({
    type: SET_DETAIL_PARAM_SUCCESS,
    payload: param
});

// fetch products
export const fetchDetailParam= (carrierOmdCode, subscriptionId) => {
    return dispatch => {

        let param = {
            carrierOmdCode : carrierOmdCode,
            subscriptionId : subscriptionId
        }

        dispatch(setDetailParamSuccess(param));
    };
};

export const setDetailParam= (param) => {
    return dispatch => {
        dispatch(setDetailParamSuccess(param));
    };
};
import { FETCH_FILTER_SUCCESS, FETCH_FILTER_CHANGE } from "../actions/filterActions";
import { Map, update } from "immutable"

const initState = {};

const filterReducer = (state = initState, action) => {
    if (action.type === FETCH_FILTER_SUCCESS) {
        return {
            ...state,
            filter: action.payload
        };
    }

    // Immutable 해야하므로, 값을 직접 지정하면 안되고, 변경해줘야함
    if (action.type === FETCH_FILTER_CHANGE ) {

        let filterType = action.payload.filterType
        let data = action.payload.data
        let temp = ''


        if(filterType == 'sorting'){

            // state 값을 업데이트임
            // immutable.js 에서 인자 값을 받아서 update를 시켜주는 방식
            temp = update(state.filter, 'sorting_field', value => data.sorting_field)
            temp = update(temp, 'sorting_way', value => data.sorting_way)

        }else if (filterType == 'subscription_group_id'){
            temp = update(state.filter, 'subscription_group_id', value => data)
        }
        else{
            temp = update(state.filter, filterType, value => data)
        }

        return {
            ...state,
            filter: temp
        };
    }


    return state;
};

export default filterReducer;

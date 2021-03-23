export const getsortingLists = (sortingList, type) => {

    //eventCategory = 'event01_list'

    if(type === 'SUPPORT'){
        return sortingList.support_sorting_dropdown_list
    }else{
        return sortingList.contract_sorting_dropdown_list
    }

    return sortingList;
};
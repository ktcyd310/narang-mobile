export const getEventLists = (eventList, limit, eventCategory) => {

    //eventCategory = 'event01_list'

    if(eventCategory === 'event01_list'){
        return eventList[0].event01_list.slice(0, limit ? limit : eventList[0].event01_list.length)
    }else if(eventCategory === 'event02_list'){
        return eventList[0].event02_list.slice(0, limit ? limit : eventList[0].event02_list.length)
    }

};
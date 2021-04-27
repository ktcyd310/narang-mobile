import React, { Component, Fragment } from "react";
import axios from "axios";
import Popup from 'reactjs-popup';

class SubscriptionPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        this.getPopupData();
    }

    getPopupData() {
        axios
            .get(process.env.REACT_APP_API_URL + "/product/subscription/list", {params: this.props.param})

            .then(response =>
                this.setState({ data: response.data, isLoading: false })
            )
            .catch(error =>
                this.setState({ errorMessage: error.message, isLoading: false })
            );
    }

    render() {
        const { heroSliderData, isLoading, errorMessage } = this.state;

        let subscriptionList =''
        if(this.state.data){
            subscriptionList = this.state.data.subscription_list
        }else{
            return (
                <div>
                    Not Found
                </div>
            )
        }

        return (
            <div className="model-body">
                <div className="content">
                    <ul className="list-group">
                        {subscriptionList.map(single => {
                            return (
                                <li className="list-group-item">{single.SUBSCRIPTION_NAME}
                                </li>
                            )
                        })}

                    </ul>
                </div>
            </div>
        )
    }
}

export default SubscriptionPopup;

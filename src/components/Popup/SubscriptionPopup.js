import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {setDetailParam} from "../../redux/actions/detailParamActions";
import {connect} from "react-redux";
import {Preloader} from "../index";
import commaNumber from "../../utils/commaNumber";

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


        let param = {
            ...this.props.param,
            product_group_id : this.props.detailParam.product_group_id
        }

        console.log(param)

        axios
            .get(process.env.REACT_APP_API_DEV_URL + "/product/subscription/list", {params: param})

            .then(response =>
                this.setState({ data: response.data, isLoading: false })
            )
            .catch(error =>
                this.setState({ errorMessage: error.message, isLoading: false })
            );
    }

    subscriptionParamChange(carrierOmdCode, subscriptionId) {

        let subscriptionList = this.props.detailParam.subscription_ids.split(',')

        switch(carrierOmdCode){
            case 'SKT':
                subscriptionList[0] = subscriptionId
                break;
            case 'KT':
                subscriptionList[1] = subscriptionId
                break;
            case 'LGU':
                subscriptionList[2] = subscriptionId
                break;
            default :
                break;
        }

        let subscription_ids = subscriptionList.join()

        let param = {
            ...this.props.detailParam,
            subscription_ids : subscription_ids
        }

        this.props.setDetailParam(param)
    }

    render() {

        let subscriptionList =''
        if(this.state.data){
            subscriptionList = this.state.data.subscription_list
        }else{
            return (
                <div>
                    <Preloader />;

                </div>
            )
        }

        return (

                <div className="model-body" style={{height:"50vh"}}>
                    <div className="content">
                        <ul className="list-group">
                            {subscriptionList.map(single => {
                                return (
                                    <button type="button" className="list-group-item list-group-item-action" onClick={() => {
                                        this.subscriptionParamChange(this.props.param.carrier_omd_code, single.SUBSCRIPTION_ID)
                                    }}>
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                {single.SUBSCRIPTION_NAME}
                                                <br></br>
                                                <span style={{color:"#0F4C81"}}>월 데이터 {single.DATA_AMOUNT}</span>
                                            </div>
                                            <div style={{display:"flex", alignItems:"center"}}>
                                                <span>{commaNumber(single.SUBSCRIPTION_MONTHLY_FEE)}원</span>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })
                            }

                        </ul>
                    </div>
                </div>
        )
    }
}

SubscriptionPopup.propTypes = {
    subscriptionList: PropTypes.array,
};


const mapStateToProps = (state, ownProps) => {
    return {
        subscriptionList: state.detailParamData.subscriptionList,
        detailParam: state.detailParamData.detailParam
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setDetailParam: (param) => {
            dispatch(setDetailParam(param))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionPopup);

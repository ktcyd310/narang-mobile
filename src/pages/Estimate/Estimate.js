import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import Swiper from "react-id-swiper";
import { ReactSVG } from "react-svg";
import { Rating } from "../../components";
import { Link, useHistory, withRouter } from "react-router-dom";
import {
    getDiscountPrice,
    getProductCartQuantity, productFilterButton, planTypeButton
} from "../../helpers/product";
import { addToCartDispatch } from "../../redux/actions/cartActions";
import { addToWishlistDispatch } from "../../redux/actions/wishlistActions";
import {Chip} from "@material-ui/core";
import {Dropdown, DropdownButton} from "react-bootstrap";
import PropTypes from "prop-types";
import axios from "axios";
import ReactLoading from 'react-loading'
import SubscriptionPopup from "../../components/Popup/SubscriptionPopup";
import Popup from 'reactjs-popup';
import {setDetailParam} from "../../redux/actions/detailParamActions";
import commaNumber from "../../utils/commaNumber";


class Estimate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            childProductList : '',
            param: props.location.param,
            isLoading: true,
            popupOn: false,
            popupTarget: '',
            addSupportFee: '',
            shopSupportFee: ''
        };

        this.recalculate = this.recalculate.bind(this);
    }

    componentDidMount() {
        this.getEstimateData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.checkData()
        if(prevProps.detailParam != this.props.detailParam){
            this.setState({popupOn:false})
            this.getChildProductData();

        }
    }

    //await axios.get( process.env.REACT_APP_API_URL + "/product/list", {params: parameter} )

    checkData() {
        if(!this.state.data){
            this.props.history.goBack();
        }
    }

    getEstimateData() {
        axios
            .get(process.env.REACT_APP_API_URL + "/customer/estimate", {params : {child_product_id: this.props.match.params.id}})

            .then(response =>
                this.setState({
                    data: response.data,
                    isLoading: false,
                    deviceMonthlyFee: response.data.estimate_info.DEVICE_MONTHLY_FEE,
                    monthlyFee: response.data.estimate_info.MONTHLY_FEE
                })
            )
            .catch(error =>
                this.setState({ errorMessage: error.message, isLoading: false })
            );
    }

    toggleSubscriptionPopup (carrierOmdCode) {
        this.setState({
            popupTarget:carrierOmdCode,
            popupOn:true
        })
    }

    checkPopup (single) {
        if(this.state.popupOn){
            if(single.CARRIER_OMD_CODE == this.state.popupTarget){
                return true;
            }
        }
        return false;
    }

    recalculate(event, installmentTerm, place){

        if(place == 'ADD'){
            this.setState({
                addSupportFee:event.target.value,
            })
        }else{
            this.setState({
                shopSupportFee:event.target.value,
            })
        }

        this.setState({
            deviceMonthlyFee: this.state.data.estimate_info.DEVICE_MONTHLY_FEE
                -Math.round((this.state.addSupportFee/installmentTerm),0)
                -Math.round((this.state.shopSupportFee/installmentTerm),0),
            monthlyFee: this.state.data.estimate_info.MONTHLY_FEE
                -Math.round((this.state.addSupportFee/installmentTerm),0)
                -Math.round((this.state.shopSupportFee/installmentTerm),0)
        }
        )



    }

    render() {
        const {
            filterList,
            setDetailParam
        } = this.props;
        const { data, deviceMonthlyFee, monthlyFee, addSupportFee, shopSupportFee } = this.state;

        if(data||this.state.isLoading!=true){

        }else{
            return (
                <div className="loading-container">
                    <ReactLoading type = {"spinningBubbles"} color={"#517892"} height={"30%"} width={"30%"}/>
                </div>
            )
        }

        let icon = ''

        switch(data.estimate_info.CARRIER_OMD_CODE){
            case 'SKT' :
                icon = 'icon_skt.png';
                break;
            case 'KT' :
                icon = 'icon_kt.png';
                break;
            case 'LGU' :
                icon = 'icon_lgu.png';
                break;
        }

        let contractSaleAmount = ''

        if(data.estimate_info.PLAN_TYPE=='CONTRACT'){
            contractSaleAmount = data.estimate_info.CONTRACT_SALE_AMOUNT
        }else{
            contractSaleAmount = 0
        }

        return (
            <div className="body-wrapper space-pt--70 space-pb--120">
                <div className="estimate-container">
                    <div className="estimate-content-header border-bottom--thick border-dark">
                        <img
                            src={process.env.PUBLIC_URL + `/assets/img/icons/${icon}`}
                            className="img-fluid"
                            alt=""
                        />
                        <h4 style={{alignSelf:"center"}}>{data.estimate_info.CARRIER_OMD_CODE} 견적서</h4>
                    </div>

                    <div className="container-lg">
                        <div className="estimate-title">
                            <div className="col d-flex justify-content-between">
                             <h7 className = "estimate-title-text">{data.estimate_info.PRODUCT_GROUP_NAME}</h7>
                            </div>
                            <div className="col d-flex justify-content-between">
                                <h7 className = "estimate-title-text">최종 월 납부액</h7>
                                <h7>{`${commaNumber(monthlyFee)}`}</h7>
                            </div>
                        </div>
                        <div className="estimate-body">
                            <div className="col d-flex justify-content-between border-bottom--medium border-dark" style={{paddingBottom:7}}>
                                <h7 className = "estimate-body-text">월 기기 납부액</h7>
                                <h7>{`${commaNumber(deviceMonthlyFee)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">출고가</h7>
                                <h7>{`${commaNumber(data.estimate_info.FACTORY_PRICE)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">공시지원금</h7>
                                <h7>{`${commaNumber(data.estimate_info.SUPPORT_FEE)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">추가지원금</h7>
                                <h7>
                                    <input className="text-input" style={{width:70, height:25, textAlign:'right'}} type="text"
                                           value = {addSupportFee}
                                           onChange={(e) => this.recalculate(e, data.estimate_info.INSTALLMENT_TERM, 'ADD')}>
                                    </input>
                                </h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">매장지원금</h7>
                                <h7>
                                    <input className="text-input" style={{width:70, height:25, textAlign:'right'}} type="text"
                                           value = {shopSupportFee}
                                           onChange={(e) => this.recalculate(e, data.estimate_info.INSTALLMENT_TERM, 'SHOP')}>
                                    </input>
                                </h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">할부원금</h7>
                                <h7>{`${commaNumber(data.estimate_info.MODEL_PRICE)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">할부이자</h7>
                                <h7>{`${commaNumber(data.estimate_info.INSTALLMENT_FEE)}`}</h7>
                            </div>
                        </div>
                        <div className="estimate-body">
                            <div className="col d-flex justify-content-between border-bottom--medium border-dark" style={{paddingBottom:7}}>
                                <h7 className = "e정stimate-body-text">월 납부 요금제액</h7>
                                <h7>{`${commaNumber(data.estimate_info.SUBSCRIPTION_MONTHLY_FEE)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">요금제명</h7>
                                <h7>{`${commaNumber(data.estimate_info.SUBSCRIPTION_NAME)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">기본료</h7>
                                <h7>{`${commaNumber(data.estimate_info.SUBSCRIPTION_MONTHLY_FEE)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">선택약정</h7>
                                <h7>{`${commaNumber(contractSaleAmount)}`}</h7>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const label = (el) => {
    return (
        <label className={el} htmlFor={el} />
    )
}


Estimate.propTypes = {
    addToWishlist: PropTypes.func,
    products: PropTypes.array,
    wishlistItems: PropTypes.array,
    oemProductList: PropTypes.array,
    sortingList: PropTypes.array,
    filter: PropTypes.string,
    state: PropTypes.array
};


const mapStateToProps = (state, ownProps) => {
    const itemId = ownProps.match.params.id;
    return {
        product:
        state.productData.products,
        wishlistItems: state.wishlistData,
        cartItems: state.cartData,
        filterList: state.filterList.filter,
        subscriptionList: state.subscriptionListData,
        detailParam: state.detailParamData.detailParam
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addToCart: (item, quantityCount, selectedProductColor) => {
            dispatch(addToCartDispatch(item, quantityCount, selectedProductColor));
        },
        addToWishlist: item => {
            dispatch(addToWishlistDispatch(item));
        },
        setDetailParam: (param) => {
            dispatch(setDetailParam(param))
        }

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Estimate);


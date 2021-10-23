import React, { Component } from "react";
import { connect } from "react-redux";
import { ReactSVG } from "react-svg";
import PropTypes from "prop-types";
import axios from "axios";
import ReactLoading from 'react-loading'
import {setDetailParam} from "../../redux/actions/detailParamActions";
import commaNumber from "../../utils/commaNumber";
import DaumPostcode from "react-daum-postcode";
import qs from 'qs';

class EstimateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            childProductList : '',
            param: props.location.param,
            isLoading: true,
            popupOn: false,
            popupTarget: '',
            addSupportFee: '',
            shopSupportFee: '',
            modelPrice:'',
            installmentFee: '',
            memo: '',
            shopName: '',
            postCode: '',
            detailAddr: '',
            detailAddr1: '',
            openPost: false
        };

        this.recalculate = this.recalculate.bind(this);
        this.addrComplete = this.addrComplete.bind(this);
        this.createEstimate = this.createEstimate.bind(this);
    }

    componentDidMount() {
        this.getEstimateData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.checkData()
        if(prevProps.detailParam !== this.props.detailParam){
            this.setState({popupOn:false})
            this.getChildProductData();

        }
    }

    //await axios.get( process.env.REACT_APP_API_DEV_URL + "/product/list", {params: parameter} )

    checkData() {
        if(!this.state.data){
            this.props.history.goBack();
        }
    }

    getEstimateData() {
        axios
            .get(process.env.REACT_APP_API_DEV_URL + "/customer/estimate", {params : {child_product_id: this.props.match.params.id}})

            .then(response => {

                let modelPrice = response.data.estimate_info.FACTORY_PRICE - response.data.estimate_info.SUPPORT_FEE - response.data.estimate_info.ADD_SUPPORT_FEE
                let installmentFee = this.calculateInstallmentFee(modelPrice, 5.9, response.data.estimate_info.INSTALLMENT_TERM)
                let deviceMonthlyFee = Math.round((modelPrice + installmentFee)/response.data.estimate_info.INSTALLMENT_TERM,0)

                if(deviceMonthlyFee < 0){
                    deviceMonthlyFee = 0;
                }

                let monthlyFee = response.data.estimate_info.SUBSCRIPTION_MONTHLY_FEE + deviceMonthlyFee

                console.log(monthlyFee)


                this.setState({
                    data: response.data,
                    isLoading: false,
                    deviceMonthlyFee: deviceMonthlyFee,
                    addSupportFee: response.data.estimate_info.ADD_SUPPORT_FEE,
                    monthlyFee: monthlyFee,
                    modelPrice: modelPrice,
                    installmentFee: installmentFee
                })
                }
            )
            .catch(error =>
                this.setState({ errorMessage: error.message, isLoading: false })
            );
    }

    recalculate(event, installmentTerm, place){

        let addSupportFee = this.state.addSupportFee
        let shopSupportFee = this.state.shopSupportFee

        if(place === 'ADD'){
            this.setState({
                addSupportFee:event.target.value,
            })

            addSupportFee = event.target.value

        }else{
            this.setState({
                shopSupportFee:event.target.value,
            })

            shopSupportFee = event.target.value

        }

        let modelPrice = this.state.data.estimate_info.FACTORY_PRICE - this.state.data.estimate_info.SUPPORT_FEE - addSupportFee - shopSupportFee
        let installmentFee = this.calculateInstallmentFee(modelPrice, 5.9, this.state.data.estimate_info.INSTALLMENT_TERM)


        let deviceMonthlyFee = Math.round((modelPrice + installmentFee)/this.state.data.estimate_info.INSTALLMENT_TERM,0)

        if(deviceMonthlyFee < 0){
            deviceMonthlyFee = 0;
        }

        let monthlyFee = this.state.data.estimate_info.SUBSCRIPTION_MONTHLY_FEE + deviceMonthlyFee

        this.setState({
            modelPrice: modelPrice,
            installmentFee: installmentFee,
            deviceMonthlyFee: deviceMonthlyFee,
            monthlyFee: monthlyFee,
        }
        )

    }

    calculateInstallmentFee(modelPrice, installmentRate, installmentTerm) {

        installmentRate = installmentRate/100;
        let monthlyInstallmentPrice = 0;
        let monthlyInstallmentPriceLeft = modelPrice;
        let monthlyTotalFee = modelPrice * (installmentRate/12)*Math.pow((1+installmentRate/12),installmentTerm)/(Math.pow((1+installmentRate/12),installmentTerm)-1);
        let monthlyInstallmentInterest = 0;
        let totalInstallmentInterest = 0

        for (let i = 1; i <= installmentTerm; i++){
            monthlyInstallmentInterest = monthlyInstallmentPriceLeft * installmentRate/12
            monthlyInstallmentPrice = monthlyTotalFee - monthlyInstallmentInterest
            monthlyInstallmentPriceLeft = monthlyInstallmentPriceLeft - monthlyInstallmentPrice
            totalInstallmentInterest = totalInstallmentInterest + monthlyInstallmentInterest
        }

        return Math.round(totalInstallmentInterest,0)

    }


    addrComplete(data) {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }


        this.setState({
            postCode: data.zonecode,
            detailAddr: data.roadAddress
        })
    }

    postCodeStyle() {
        let pose = document.getElementById('address-search-button').getBoundingClientRect()
        let y = pose.y-200
        let x = (document.body.offsetWidth / 2) - (document.body.offsetWidth*0.9 / 2)
        let width = document.body.offsetWidth*0.9

        let postCodeStyle = {
            display: "block",
            position: "absolute",
            zIndex: "100",
            margin: "auto",
            pointerEvents: "auto",
            top: y,
            left: x,
            border: 'black',
            borderWidth: 'thin',
            borderStyle: 'solid',
            width: width
        }

        return postCodeStyle
    }

    createEstimate(param) {

        let estimateSeq = ''

        axios
            .request({
                method: 'POST',
                url: process.env.REACT_APP_API_DEV_URL+`/customer/estimate/create`,
                data: qs.stringify(param)
            })

            .then((response) => {
                    estimateSeq = response.data[0].result

                if(estimateSeq){
                    this.props.history.push(process.env.PUBLIC_URL + `/estimate/${estimateSeq}`)
                }

                }
            )
            .catch(error =>
                this.setState({ errorMessage: error.message, isLoading: false })
            );
    }

    getDate() {
        let date = new Date();
        let year = date.getFullYear()
        let month = ("0" + (1 + date.getMonth())).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);

        return year+'.'+month+'.'+day
    }

    render() {
        const { data, deviceMonthlyFee, monthlyFee, addSupportFee, shopSupportFee, modelPrice, installmentFee } = this.state;

        if(data||this.state.isLoading!==true){

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
            default :
                break;
        }

        let contractSaleAmount = ''
        let disabled = false

        if(data.estimate_info.PLAN_TYPE==='CONTRACT'){
            contractSaleAmount = data.estimate_info.CONTRACT_SALE_AMOUNT
            disabled = true
        }else{
            contractSaleAmount = 0
        }



        return (
            <div className="body-wrapper space-pt--70 space-pb--15">
                <div className="estimate-container">
                    <div className="estimate-content-header">
                        <img
                            src={process.env.PUBLIC_URL + `/assets/img/icons/${icon}`}
                            className="img-fluid"
                            alt=""
                        />
                        <h4 style={{alignSelf:"center", marginLeft:8}}> {data.estimate_info.CARRIER_OMD_CODE} 견적서
                        </h4>
                    </div>
                    <div className="container-lg">
                        <div className="border-bottom--thick border-dark" style={{marginBottom:15, textAlign:"end"}}>
                            <span>기준일 : {this.getDate()}</span>
                        </div>
                        <div className="estimate-title">
                            <div className="col d-flex justify-content-between">
                             <span className = "estimate-title-text" style={{fontWeight:"bold"}}>{data.estimate_info.PRODUCT_GROUP_NAME}</span>
                            </div>
                            <div className="col d-flex justify-content-between">
                                <span className = "estimate-title-text" style={{fontWeight:"bold"}}>최종 월 납부액</span>
                                <span style={{fontWeight:"bold"}}>{`${commaNumber(monthlyFee)} 원`}</span>
                            </div>
                        </div>
                        <div className="estimate-body">
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">출고가</h7>
                                <h7>{`${commaNumber(data.estimate_info.FACTORY_PRICE)} 원`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <div className = "estimate-body-text">
                                    공시지원금
                                    <span> (-) </span>
                                </div>
                                <h7>{`${commaNumber(data.estimate_info.SUPPORT_FEE)} 원`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <div className = "estimate-body-text">
                                    추가지원금
                                    <span> (-) </span>
                                </div>
                                <h7>
                                    <input className="text-input" style={{width:70, height:25, textAlign:'right'}} type="text"
                                           value = {addSupportFee}
                                           onChange={(e) => this.recalculate(e, data.estimate_info.INSTALLMENT_TERM, 'ADD')}
                                           disabled = {disabled}

                                    >

                                    </input>
                                    <span> </span>원
                                </h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <div className = "estimate-body-text">
                                    매장지원금
                                    <span> (-) </span>
                                </div>
                                <h7>
                                    <input className="text-input" style={{width:70, height:25, textAlign:'right'}} type="text"
                                           value = {shopSupportFee}
                                           onChange={(e) => this.recalculate(e, data.estimate_info.INSTALLMENT_TERM, 'SHOP')}>
                                    </input>
                                    <span> </span>원
                                </h7>
                            </div>
                            <div className="col d-flex justify-content-between border-bottom--medium border-dark" style={{paddingBottom:7}}>

                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">할부원금</h7>
                                <h7>{`${commaNumber(modelPrice)} 원`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <div className = "estimate-body-text">
                                    할부이자
                                    <span> (+) </span>
                                </div>
                                <h7>{`${commaNumber(installmentFee)} 원`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between border-bottom--medium border-dark" style={{paddingBottom:7}}>

                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <span className = "estimate-body-text" style={{fontWeight:"bold"}}>월 기기 납부액</span>
                                <span style={{fontWeight:"bold"}}>{`${commaNumber(deviceMonthlyFee)} 원`}</span>
                            </div>
                        </div>
                        <div className="subscription-estimate-body">
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">요금제명</h7>
                                <span style={{textAlign:"end"}}>
                                    <span>{`${commaNumber(data.estimate_info.SUBSCRIPTION_NAME)}`}</span>
                                    <br></br>
                                    <span style={{fontSize:11}}>(월 데이터 {data.estimate_info.DATA_AMOUNT})</span>
                                </span>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">기본료</h7>
                                <h7>{`${commaNumber(data.estimate_info.SUBSCRIPTION_FEE)} 원`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">선택약정</h7>
                                <h7>{`${commaNumber(contractSaleAmount)} 원`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <span style={{fontSize:11, color:"#ff0000", fontWeight:"lighter", display:"inline-flex"}}>
                                    <ReactSVG
                                        src={process.env.PUBLIC_URL + "/assets/img/icons/arrow_down.svg"}
                                        style={{height:10, width:10, fill:"#ff0000"}}
                                    />
                                    <span style={{marginLeft:5}}>공시지원금 선택시 선택약정 할인이 없습니다.</span>

                                </span>
                            </div>
                            <div className="col d-flex justify-content-between">
                                <span style={{fontSize:11, color:"#ff0000", fontWeight:"lighter", display:"inline-flex"}}>
                                    <ReactSVG
                                        src={process.env.PUBLIC_URL + "/assets/img/icons/arrow_down.svg"}
                                        style={{height:10, width:10, fill:"#ff0000"}}
                                    />
                                    <span style={{marginLeft:5}}>가족, 결합할인은 매장에서 적용 할 수 있습니다.</span>

                                </span>
                            </div>

                            <div className="col d-flex justify-content-between border-bottom--medium border-dark" style={{paddingBottom:7}}>

                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <span className = "estimate-body-text" style={{fontWeight:"bold"}}>월 요금 납부액</span>
                                <span style={{fontWeight:"bold"}}>{`${commaNumber(data.estimate_info.SUBSCRIPTION_MONTHLY_FEE)} 원`}</span>
                            </div>
                        </div>
                    </div>

                    <div className="memo-container border-bottom--thick border-dark">
                        <div className="estimate-body-memo border-0">
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">추가 메모</h7>
                            </div>
                            <div className="" style={{marginTop:7, textAlign:'center'}}>
                                <textarea className="text-input" type="text"
                                       value = {this.state.memo}
                                       onChange={(e) => this.setState({memo:e.target.value})}>
                                </textarea>
                            </div>
                        </div>
                    </div>

                    <div className="container-lg">
                        <div className="shop-title">
                            <ReactSVG color="#0F4C81"
                                src={
                                    process.env.PUBLIC_URL +
                                    "/assets/img/icons/open-store.svg"
                                }
                            />
                            <h6 className="h6">구매 매장</h6>
                        </div>
                        <div className="shop-body">
                            <div className="d-flex justify-content-between" style={{paddingBottom:7}}>
                                <h7 className = "p-2 flex-shrink-1 w-25">이름</h7>
                                <div className= "address-container">
                                    <input className="address-name" type="text"
                                           value = {this.state.shopName}
                                           onChange={(e) => this.setState({shopName:e.target.value})}>
                                    </input>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between" style={{paddingBottom:7}}>
                                <h7 className = "p-2 flex-lg-shrink-1 w-25">주소</h7>
                                <div className= "address-container">
                                    <input className="address-postCode" type="text"
                                           value = {this.state.postCode}
                                    >
                                    </input>
                                    {
                                        this.state.openPost ?
                                            <DaumPostcode
                                                onComplete={(data) => {
                                                    this.addrComplete(data)
                                                    this.setState({openPost:false})

                                                }}
                                                autoClose
                                                style={this.postCodeStyle()}
                                                isDaumPost={this.state.openPost}
                                            />
                                            : null
                                    }
                                    <button id = "address-search-button" className="address-search" style={{marginLeft:5}} onClick={() => {

                                        this.setState({openPost:'true'})
                                    }
                                    }>주소검색</button>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between" style={{paddingBottom:7}}>
                                <h7 className = "p-2 flex-lg-shrink-1 w-25"> </h7>
                                <div className= "address-container">
                                    <input className="address-detail" type="text"
                                           value = {this.state.detailAddr}
                                           onChange={(e) => this.setState({detailAddr:e.target.value})}>
                                    </input>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between" style={{paddingBottom:7}}>
                                <h7 className = "p-2 flex-lg-shrink-1 w-25"> </h7>
                                <div className= "address-container">
                                    <input className="address-detail1" type="text"
                                           value = {this.state.detailAddr1}
                                           onChange={(e) => this.setState({detailAddr1:e.target.value})}>
                                    </input>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="memo-container border-bottom--thick border-dark">
                    </div>

                    <div className="memo-container">
                        <div className="estimate-body-memo border-0">
                            <div className="" style={{marginTop:7, textAlign:'center'}}>
                                <button className="share-button"
                                onClick={() => {
                                    let param = {
                                        //TODO : 모든 데이터 파라미터로 전달
                                        child_product_id: this.props.match.params.id,
                                        add_support_fee: this.state.addSupportFee,
                                        shop_support_fee: this.state.shopSupportFee,
                                        memo: this.state.memo,
                                        shop_name: this.state.shopName,
                                        post_code: this.state.postCode,
                                        detail_addr: this.state.detailAddr,
                                        detail_addr1: this.state.detailAddr1,
                                        plan_type: data.estimate_info.PLAN_TYPE
                                    }
                                    this.createEstimate(param)
                                }}>
                                    <div style={{color:'#0F4C81', fontWeight:'bold', display:"inline-flex"}}>
                                        <span>견적서 생성하기</span>
                                        <div style={{paddingLeft: 10, fill:"#0F4C81"}}>
                                          <ReactSVG
                                              src={
                                                  process.env.PUBLIC_URL +
                                                  "/assets/img/icons/arrow-right.svg"
                                              }
                                          />
                                        </div>
                                    </div>
                                </button>
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


EstimateForm.propTypes = {
    products: PropTypes.array,
    oemProductList: PropTypes.array,
    sortingList: PropTypes.array,
    filter: PropTypes.string,
    state: PropTypes.array
};


const mapStateToProps = (state, ownProps) => {
    return {
        product:
        state.productData.products,
        filterList: state.filterList.filter,
        subscriptionList: state.subscriptionListData,
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

export default connect(mapStateToProps, mapDispatchToProps)(EstimateForm);


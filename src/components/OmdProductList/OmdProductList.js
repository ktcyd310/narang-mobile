import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {getOmdProductLists } from "../../helpers/omdProductList"
import { getsortingLists } from "../../helpers/sortingList"
import { getFilteredProductListDispatch } from "../../redux/actions/oemProductListActions"

import {getFilter} from "../../helpers/filter";
import {changeFilterDataDispatch} from "../../redux/actions/filterActions";
import {setDetailParam} from "../../redux/actions/detailParamActions";
import commaNumber from "../../utils/commaNumber";


class OmdProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridActivate: false,
      listActivate: true,
      planType: 'SUPPORT'
    };
  }

  // Filter 로딩 후 데이터 재로딩을 위함
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (prevProps.filter !== this.props.filter){
  //     this.props.getFilteredProductList(this.props.filter)
  //   }
  // }

  routeChange = (single) => {
    //let history = useHistory();
    this.props.history.push(process.env.PUBLIC_URL + `/omdProduct/detail`)
  }

  render() {
    const { omdProductList,
            // sortingList,
            // filter ,
            // setSortingFilter
          } = this.props;
    const { listActivate } = this.state;

    const totalCount = omdProductList.length


    return (
        <div>
        {omdProductList.map(single => {
          let param={
            product_group_id:single.PRODUCT_GROUP_ID,
            product_id:single.PRODUCT_ID,
            color_hex:single.COLOR_HEX
          }

          let icon=''
          let discountCode = ''

          switch(single.OMD_CODE){

            case 'COUPANG' :
              icon = 'Coupang_logo.png';
              break;

            case '11ST' :
              icon = '11st_logo.png';
              break;

            case 'SSG' :
              icon = 'SSG_logo.png';
              break;

            case 'APPLE' :
              icon = 'Apple_logo.png';
              break;

            case 'HIMART' :
              icon = 'Himart_logo.png';
              break;

            case 'AGENCY' :
              icon = 'Agency_logo.png';
              break;

            case 'SAMSUNG' :
              icon = 'Samsung_logo.png';
              break;


            default :
              break;

          }

          switch(single.DISCOUNT_CODE) {

            case 'BASIC' :
              discountCode = '기본';
              break;

            case 'CARD' :
              discountCode = '카드할인';
              break;

            default :
              break;
          }


          return (
              <a className = "list-a-style" onClick={() => {
                this.props.setDetailParam(param)
                this.routeChange(single)
              }}>
                <div className="list-detail-container">
                  <div className="container-large">
                    <div className="col">
                      <div className="listName border-bottom">{single.PRODUCT_GROUP_NAME}</div>
                      <div className="d-flex justify-content-around">
                        <div className="logo-image">
                          <img
                            src={process.env.REACT_APP_S3_URL + `${single.IMAGE_URL}`}
                            className="img-fluid-list" />
                        </div>
                        <div className="list-row-list">
                          <div className="list-row-big-center">최저가몰</div>
                          <div className="list-row-big-center">최저가</div>
                          <div className="list-row-big-center">할인방법</div>
                        </div>
                        <div className="list-row-list">
                          <div className="list-logo">
                            <img src={process.env.PUBLIC_URL + `/assets/img/icons/${icon}`} className="list-img-fluid-logo" alt=""/>
                          </div>
                          <div className="list-row-big-right">{commaNumber(single.PRICE) + "원 "}</div>
                          <div className="list-row-big-right">{discountCode}
                            {/*<div className="list-row-small">(A급)</div>*/}
                          </div>
                        </div>
                      </div>
                      {single.AGENCY_PRICE?(
                              <div className="list-price-compare"> " 주변 통신사 공식대리점 보다 {commaNumber(single.AGENCY_PRICE-single.PRICE) + "원 "} 저렴 "</div>
                      )
                      :
                          (
                              <div className="list-price-compare"> " 클릭하여 가격을 비교하세요 "</div>
                          )
                      }

                    </div>
                  </div>
                </div>
              </a>
          )
        }
        )
        }
        </div>
    )
  }
}

OmdProductList.propTypes = {
  addToWishlist: PropTypes.func,
  products: PropTypes.array,
  wishlistItems: PropTypes.array,
  omdProductList: PropTypes.array,
  sortingList: PropTypes.array,
  filter: PropTypes.string
};

const mapStateToProps = state => {
  return {
    omdProductList: getOmdProductLists(
        state.omdProductListData.omdProductList.list
    ),
    sortingList: getsortingLists(
        state.sortingListData.sortingList,
        state.filterData.filter.plan_type_list
    )
  };
};

const mapDispatchToProps = dispatch => {
  return {

    setSortingFilter: (value1, value2, filter) => {

      let data = {
        sorting_field: value1,
        sorting_way: value2
      }

      dispatch(changeFilterDataDispatch('sorting', data));
    },

    setDetailParam: (param) => {
      dispatch(setDetailParam(param))
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OmdProductList));
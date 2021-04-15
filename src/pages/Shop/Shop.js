import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { connect } from "react-redux";
import { ShopProducts } from "../../components";
import {
  toggleShopTopFilter,
  getIndividualCategories,
  getIndividualColors,
  setActiveSort,
  getSortedProducts, toggle1depthFilter, toggleSubscriptionFilter, subscriptionFilterButton
} from "../../helpers/product";
import {Dropdown, DropdownButton} from "react-bootstrap";
import {ReactSVG} from "react-svg";
import {forEach} from "react-bootstrap/cjs/ElementChildren";
import {getFilteredProductListDispatch} from "../../redux/actions/oemProductListActions";
import { changeFilterDataDispatch } from "../../redux/actions/filterActions";
import PropTypes from "prop-types";
import {getFilter} from "../../helpers/filter";

class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortType: "",
      sortValue: "",
      filteredProducts: props.products
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.filter != this.props.filter){
      this.props.getFilteredProductList(this.props.filter)
    }
  }


  render() {
    const { filterData, filterList, changeFilter } = this.props;
    const { filteredProducts } = this.state;

    // 5G 요금제 그룹
    const subscriptionGroup = filterList.subscription_group_list.filter(
        subscriptionGroup => subscriptionGroup.NETWORK_TYPE_CODE === '5G'
    )

    const lteSubscriptionGroup = filterList.subscription_group_list.filter(
        lteSubscriptionGroup => lteSubscriptionGroup.NETWORK_TYPE_CODE === 'LTE'
    )

    const codeCategoryNames = {
      company_code_list: '제조사',
      factory_price_list: '출고가',
      plan_type_list: '공시선약',
      installment_term_list: '할부개월'
    }

    const companyCodes = filterList.company_code_list.filter(
        companyCodes => companyCodes.NETWORK_TYPE_CODE === 'LTE'
    )

    let topFilter = ''

    return (
      <div className="body-wrapper space-pt--70 space-pb--120">
        <div className="shop-header bg-color--grey">
          <div className="container space-y--15">
            <div className="row align-items-center">
              <div className="col">
                <button
                    className="filter-trigger-button"
                    id="filter-trigger"
                    onClick={e => toggleSubscriptionFilter(e)}
                >
                  <ReactSVG src="assets/img/icons/list.svg"/>
                  <text className="filter-text">요금제: </text>
                  <text className="filter-text" id = "filter-text">요금제 선택</text>
                </button>
              </div>
              <div className="col">
                <button
                  className="filter-trigger-button"
                  id="filter-trigger"
                  onClick={e => toggleShopTopFilter(e)}
                >
                  <ReactSVG src="assets/img/icons/filter.svg"/>
                  <text className="filter-text">필터</text>
                </button>
              </div>
            </div>
          </div>
          <div className="subscription-filter" id="subscription-menu">
            <div className="container space-mt--15 space-mb--10">
              <div className="row">
                <div className="col-12">
                  {/*요금제 그룹 영역*/}
                  <div className="subscription-filter-block">
                    <h4 className="subscription-filter-block__title space-mb--15">
                      5G 요금제 가격대
                    </h4>
                    {/* 5G 요금제 그룹 */}
                    <div className="subscription-filter-block__content">
                      {subscriptionGroup ? (
                          <ul className="subscription-filter-block__category">
                            {subscriptionGroup.map((e) => {
                              return (
                                  <li key={e.SUBSCRIPTION_GROUP_ID}>
                                    <button
                                        id = "subscription-filter-button"
                                        onClick={en => {
                                          //필터 상단 문구 바꾸는 부분
                                          subscriptionFilterButton(en, e.SUBSCRIPTION_GROUP_NAME);

                                          //설정된 필터의 요금제 값을 바꾸는 부분
                                          changeFilter('subscription_group_id', e.SUBSCRIPTION_GROUP_ID);
                                        }}
                                    >
                                      {e.SUBSCRIPTION_GROUP_NAME}
                                    </button>
                                  </li>
                              );
                            })}
                          </ul>
                      ) : (
                          "No categories found"
                      )}
                    </div>
                    <h4 className="subscription-filter-block__title space-mb--15">
                      LTE 요금제 가격대
                    </h4>
                    <div className="subscription-filter-block__content">
                      {/* LTE 요금제 그룹 */}
                      {lteSubscriptionGroup ? (
                          <ul className="subscription-filter-block__category">
                            {lteSubscriptionGroup.map((e) => {
                              return (
                                  <li key={e.SUBSCRIPTION_GROUP_ID}>
                                    <button
                                        id = "subscription-filter-button"
                                        onClick={en => {
                                          subscriptionFilterButton(en, e.SUBSCRIPTION_GROUP_NAME)

                                          //설정된 필터의 요금제 값을 바꾸는 부분
                                          changeFilter('subscription_group_id', e.SUBSCRIPTION_GROUP_ID);
                                        }}
                                    >
                                      {e.SUBSCRIPTION_GROUP_NAME}
                                    </button>
                                  </li>
                              );
                            })}
                          </ul>
                      ) : (
                          "No categories found"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="shop-filter" id="shop-filter-menu">
            <div className="container space-mt--15 space-mb--10">
              <div className="row">
                <div className="col-12">
                  <div className="shop-filter-block space-mb--25">
                    <div className="shop-filter-block__content">
                      <div className="shop-filter-1depth">
                        {
                          Object.entries(codeCategoryNames).map(([key,value]) => {

                            return (

                                <DropdownButton
                                    className="dropdown-button"
                                    size="sm"
                                    //                      variant="secondary"
                                    title={value}
                                >
                                  {
                                    filterList[key] && filterList[key].map(single => {

                                      return(
                                          <Dropdown.Item className="dropdown-item" onClick={() =>
                                              console.log(single.CODE_VALUE2)

                                          }>
                                            {single.CODE_VALUE1}
                                          </Dropdown.Item>
                                      )
                                    })
                                  }
                                </DropdownButton>
                            );
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* shop products */}
        <ShopProducts products={filteredProducts} />
        </div>
      </div>
    );
  }
}


ShopProducts.propTypes = {
  addToWishlist: PropTypes.func,
  products: PropTypes.array,
  wishlistItems: PropTypes.array,
  oemProductList: PropTypes.array,
  sortingList: PropTypes.array,
  filter: PropTypes.string,
  filterData: PropTypes.array
};


const mapStateToProps = state => {
  return {
    products: state.productData.products,
    wishlistItems: state.wishlistData,
    filterList: state.filterList.filter,
    filter: getFilter(
        state.filterData.filter
    )
  };
};


const mapDispatchToProps = dispatch => {
  return {
    changeFilter: (filterType, data) => {
      dispatch(changeFilterDataDispatch(filterType, data))
    },
    getFilteredProductList: (filter) => {
      dispatch(getFilteredProductListDispatch(filter,));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Shop);

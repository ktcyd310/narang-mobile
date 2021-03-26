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
  getSortedProducts, toggle1depthFilter
} from "../../helpers/product";
import {Dropdown, DropdownButton} from "react-bootstrap";

class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortType: "",
      sortValue: "",
      finalSortedProducts: props.products
    };
  }

  getSortParams = (sortType, sortValue) => {
    this.setState({
      sortType,
      sortValue
    });

    let sortedProducts = getSortedProducts(
      this.props.products && this.props.products,
      sortType,
      sortValue
    );
    this.setState({
      finalSortedProducts: sortedProducts
    });
  };

  render() {
    const { products, filterData, filterList } = this.props;
    const { getSortParams } = this;
    const { finalSortedProducts, sortType, sortValue } = this.state;

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
              <div className="col-6">
                <h4 className="category-title text-center">
                  {sortType === "category" || ""
                    ? sortValue === ""
                      ? "All Categories"
                      : sortValue
                    : "All Categories"}
                </h4>
              </div>
              <div className="col-3 text-right">
                <button
                  className="filter-trigger"
                  id="filter-trigger"
                  onClick={e => toggleShopTopFilter(e)}
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
          <div className="shop-filter" id="shop-filter-menu">
            <div className="container space-mt--15 space-mb--50">
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
                                            <Dropdown.Item clasName="dropdown-item" onClick={() =>
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
                  {/*요금제 그룹 영역*/}
                  <div className="shop-filter-block">
                    <h4 className="shop-filter-block__title space-mb--15">
                      5G 요금제 가격대
                    </h4>
                    <div className="shop-filter-block__content">
                      {subscriptionGroup ? (
                          <ul className="shop-filter-block__category">
                            {subscriptionGroup.map((e) => {
                              return (
                                  <li key={e.SUBSCRIPTION_GROUP_ID}>
                                    <button
                                        onClick={e => {
                                          getSortParams("category", e.SUBSCRIPTION_GROUP_ID);
                                          setActiveSort(e);
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
                    <h4 className="shop-filter-block__title space-mb--15">
                      LTE 요금제 가격대
                    </h4>
                    <div className="shop-filter-block__content">
                      {lteSubscriptionGroup ? (
                          <ul className="shop-filter-block__category">
                            {lteSubscriptionGroup.map((e) => {
                              return (
                                  <li key={e.SUBSCRIPTION_GROUP_ID}>
                                    <button
                                        onClick={e => {
                                          getSortParams("category", e.SUBSCRIPTION_GROUP_ID);
                                          setActiveSort(e);
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
        </div>

        {/* shop products */}
        <ShopProducts products={finalSortedProducts} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    filterData: state.filterData.filter,
    products: state.productData.products,
    wishlistItems: state.wishlistData,
    filterList: state.filterList.filter
  };
};

export default connect(mapStateToProps)(Shop);

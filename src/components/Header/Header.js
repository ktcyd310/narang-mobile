import React, { Component } from "react";
import { Link } from "react-router-dom";
import SubscriptionPopup from "../Popup/SubscriptionPopup";
import Popup from "reactjs-popup";
import axios from "axios";
import qs from "qs";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupOn: false
    };
  }

  toggleModalPopup () {
    this.setState({
      popupOn:true
    })
  }

  checkPopup () {
    if(this.state.popupOn){
        return true;
    }
    return false;
  }

  saveQnA (url, content) {

    let data = qs.stringify({
      'url' : url,
      'content' : content
    })


    let config = {
      method: 'post',
      url: process.env.REACT_APP_API_DEV_URL +'/customer/request',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    }

    axios(config)
        .then(response =>
            this.setState({ data: response.data, isLoading: false })
        )
        .catch(error =>
            this.setState({ errorMessage: error.message, isLoading: false })
        );
  }


  render() {
    return (
      <header>
        <div className="header-wrapper border-bottom">
            <div className="d-flex justify-content-between" style={{paddingLeft:10}}>
                <div className="d-flex justify-content-around">
                  <div className="space-mt--10">
                    <div className="align-items-start">
                      <div className="header-mention">
                        <Link to={process.env.PUBLIC_URL + "/"}>
                          <img
                              src={process.env.PUBLIC_URL + "/assets/img/icons/header_logo.svg" }
                              className="narang-logo-img"
                              alt=""
                          />
                        </Link>
                      </div>
                    </div>

                  </div>
              </div>
              <nav className="navbar pc-navbar">
                <ul>
                  <li>
                    <a className="nav-link scrollto " href="/omdList">최저가 기기</a>
                  </li>
                  <li>
                    <a className="nav-link scrollto" href="/carrierList">매장 견적서</a>
                  </li>
                  {/*<li>*/}
                  {/*  <a className="nav-link scrollto" href="/src/pages/Contents.html">통신이야기</a>*/}
                  {/*</li>*/}

                </ul>
                <i className="bi bi-list mobile-nav-toggle"></i>
              </nav>
              </div>
        </div>
      </header>
    );
  }
}

export default Header;

import React, { Component } from "react";
import { Link } from "react-router-dom";
import Offcanvas from "./Offcanvas";
import SearchKeywords from "./SearchKeywords";
import SubscriptionPopup from "../Popup/SubscriptionPopup";
import Popup from "reactjs-popup";
import axios from "axios";
import qs from "qs";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activateOffcanvas: false,
      activateSearch: false,
      popupOn: false
    };
    this.getMenuActiveStatus = this.getMenuActiveStatus.bind(this);
  }

  handleClickOffcanvas(e) {
    e.preventDefault();
    this.setState({ activateOffcanvas: !this.state.activateOffcanvas });
  }

  handleSearch(e) {
    e.preventDefault();
    this.setState({ activateSearch: !this.state.activateSearch });
  }

  getMenuActiveStatus(status) {
    this.setState({
      activateOffcanvas: status
    });
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
      url: process.env.REACT_APP_API_URL +'/customer/request',
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
          <div className="container space-y--15">
            <div className="row align-items-center">
                {/* header logo */}
                <div className="header-logo">
                  <Link to={process.env.PUBLIC_URL + "/"}>
                    <img
                      src={process.env.PUBLIC_URL + "/assets/img/logo.png"}
                      className="img-fluid"
                      alt=""
                    />
                  </Link>
              </div>
              <div className="col d-flex justify-content-center">
                {/* header search */}
                {/*<div className="header-search">*/}
                {/*  <form>*/}
                {/*    <input*/}
                {/*      type="text"*/}
                {/*      onClick={e => this.handleSearch(e)}*/}
                {/*      placeholder="Search anything"*/}
                {/*    />*/}
                {/*    <ReactSVG*/}
                {/*      src={*/}
                {/*        process.env.PUBLIC_URL + "/assets/img/icons/search.svg"*/}
                {/*      }*/}
                {/*    />*/}
                {/*  </form>*/}
                {/*</div>*/}
              </div>
              {/*<div className="col-auto">*/}
              {/*  /!* header menu trigger *!/*/}
              {/*  <button*/}
              {/*    className="header-menu-trigger"*/}
              {/*    onClick={e => this.handleClickOffcanvas(e)}*/}
              {/*  >*/}
              {/*    <ReactSVG*/}
              {/*      src={process.env.PUBLIC_URL + "/assets/img/icons/menu.svg"}*/}
              {/*    />*/}
              {/*  </button>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
        {/* search keywords */}
        <SearchKeywords show={this.state.activateSearch} />
        {/* offcanvas menu */}
        <Offcanvas
          show={this.state.activateOffcanvas}
          activeStatus={this.getMenuActiveStatus}
        />


        <div className="fab-container">
          <div className="fab fab-icon-holder">
            <i className="fas fa-question" onClick={() => {
                this.toggleModalPopup()
            }}
            ></i>

            <Popup open={this.checkPopup()}
                   closeOnEscape={true}
                   closeOnDocumentClick={false}
                   modal nested
                   close={!this.state.popupOn}
            >
              {close => (
                  <div className="container">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <div className="modal-title" style={{textAlign:"center", color:"#0F4C81", fontWeight:"bold"}}>
                            사용하시면서 의견이나 문의를<br></br>
                            자유롭게 남겨주세요.
                          </div>
                        </div>
                        <div className="container-lg">
                          <div className="" style={{marginTop:7, textAlign:'center'}}>
                            <textarea id= "qna-content" className="qna-input" type="textarea">
                            </textarea>
                          </div>

                          <div style={{textAlign:"end"}}>
                            <button className="modal-button" onClick={() => {

                              let content = document.getElementById('qna-content').value;

                              this.saveQnA(document.location.href, content)
                              this.setState({popupOn:false, popupTarget:''})

                            }}
                            > 저장 </button>
                            <button type="button" className="modal-button" data-dismiss="modal" onClick={() => {this.setState({popupOn:false, popupTarget:''})}}>취소</button>
                          </div>

                        </div>

                      </div>
                    </div>
                  </div>
              )}
            </Popup>


          </div>
        </div>

      </header>
    );
  }
}

export default Header;

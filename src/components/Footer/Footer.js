import React, {Component} from "react";
import { Link, withRouter } from "react-router-dom";
import { ReactSVG } from "react-svg";

class Footer extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

    let imgClassName = ''
    let txtClassName = ''

    switch (window.location.pathname){

      case '/':
            imgClassName = 'omd-img'
            txtClassName = 'omd-txt'
            break;

      case '/omdList':
            imgClassName = 'omd-img'
            txtClassName = 'omd-txt'
            break;
      case '/carrierList':
            imgClassName = 'store-img'
            txtClassName = 'store-txt'
            break;
      default:

    }

    document.querySelectorAll(`#nav-icon`).forEach((e) => {

      if(e.className == imgClassName){
        e.classList.add("active")

      }
    })

    document.querySelectorAll(`#nav-text`).forEach((e) => {
      if(e.className == txtClassName){
        e.classList.add("active")
      }
    })

  }


  handleClick(event) {

    let nav = document.querySelectorAll("#nav-icon");
    let nav_text = document.querySelectorAll("#nav-text");

    for (let i = 0; i < nav.length; i++) {
      nav[i].classList.remove("active");
    }

    for (let i = 0; i < nav_text.length; i++) {
      nav_text[i].classList.remove("active");
    }

    if(event.target.id == 'nav-link'){
      event.target.firstElementChild.classList.add("active");
      event.target.lastElementChild.classList.add("active");
    }
    else if(event.target.id == 'nav-text'){
      event.target.previousSibling.classList.add("active");
    }else{
      event.target.nextSibling.classList.add("active");
    }

    event.target.classList.add("active");



  }


  render() {


    return (
        <footer>
          <div id="bottom-nav">
            <nav className="mobile-bottom-nav navbar">
              <ul>
                <li>
                  <div className="d-flex justify-content-center">
                      <div className="mobile-bottom-nav-item-content">
                        <Link id = 'nav-link' to={process.env.PUBLIC_URL + "/omdList"} className="mobile-bottom-nav-icon"
                              onClick={e => this.handleClick(e)}
                        >
                        <div id = "nav-icon" className="omd-img"></div>
                        <div id = "nav-text" className="omd-txt">
                          최저가 기기
                        </div>
                        </Link>
                      </div>
                  </div>
                </li>
                <li>
                  <div className="d-flex justify-content-center">
                      <div className="mobile-bottom-nav-item-content">
                        <Link id = 'nav-link' to={process.env.PUBLIC_URL + "/carrierList"} className="mobile-bottom-nav-icon"
                              onClick={e => this.handleClick(e)}
                        >
                        <div id = "nav-icon" className="store-img"></div>
                        <div id = "nav-text" className="store-txt">
                          매장 견적서
                        </div>
                        </Link>
                      </div>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </footer>
    );
  };

}
export default Footer;

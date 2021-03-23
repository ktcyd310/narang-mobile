import React, { Component, Fragment } from "react";
import axios from "axios";
import Swiper from "react-id-swiper";
import Preloader from "../Preloader";
import ErrorMessage from "../ErrorMessage";

class HeroSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heroSliderData: [],
      isLoading: true,
      errorMessage: null
    };
  }

  componentDidMount() {
    this.getHeroSliderData();
  }

  getHeroSliderData() {
    axios
        .get(process.env.PUBLIC_URL + "/data/hero-slider.json")
        //      .get(process.env.REACT_APP_API_URL + "/display/banner?display_area=home")
      .then(response =>
        this.setState({
          heroSliderData: response.data,
          isLoading: false
        })
      )
      .catch(error =>
        this.setState({ errorMessage: error.message, isLoading: false })
      );
  }
  render() {
    const { heroSliderData, isLoading, errorMessage } = this.state;
    let content;

    const params = {
      loop: true,
      speed: 1000,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      watchSlidesVisibility: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      }
    };

    if (isLoading) {
      content = <Preloader />;
    } else {
      if (errorMessage) {
        content = <ErrorMessage errorMessage={errorMessage} />;
      } else {
        content = (
          <div className="hero-slider space-y--15">
            <div className="container">
              <div className="row row-10">
                <div className="col-12">
                  <div className="hero-slider-wrapper">
                    <Swiper {...params}>
                      {heroSliderData &&
                        heroSliderData.map(single => {
                          // noinspection CheckTagEmptyBody
                          return (
                            <div key={single.id}>
                              <div
                                className="hero-slider-item d-flex bg-img swiper-slide"
                                style={{
                                  backgroundImage: `url(${process.env
                                    .PUBLIC_URL + single.image})`
                                }}
                              >
                              </div>
                            </div>
                          );
                        })}
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    return <Fragment>{content}</Fragment>;
  }
}

export default HeroSlider;

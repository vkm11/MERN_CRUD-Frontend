import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons';
function Footer() {
  // const footerDiv ={
  //   height: '5rem',
  //   background: "black",
  //   color: "#ffffff",
  //   position: 'relative',
  //   display: 'flex',
  //   alignItem: 'center',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // }
  return (
    <>
      {/* <div style={footerDiv}>
        <p className='mb-0'>Powered By <a href="/#" >iTWINE Technologies Pvt Ltd</a></p>
      </div> */}

      <footer className="footer-section">
        <div className="container">

          <div className="footer-content pt-5 pb-5">
            <div className="row mx-0">
              <div className="col-xl-4 col-lg-4 mb-50">
                <div className="footer-widget">
                  <div className="footer-logo">
                    <a href="index.html"><img src="../../images/logo3.png" className="img-fluid" alt="logo" style={{ filter: 'invert(1)'}} /></a>
                  </div>
                  <div className="footer-text">
                    <p>Lorem ipsum dolor sit amet, consec tetur adipisicing elit, sed do eiusmod tempor incididuntut consec tetur adipisicing
                      elit,Lorem ipsum dolor sit amet.</p>
                  </div>
                  <div className="footer-social-icon">
                    <span>Follow us</span>
                    <a href="/#"><i className="fab fa-facebook-f facebook-bg" /></a>
                    <a href="/#"><i className="fab fa-twitter twitter-bg" /></a>
                    <a href="/#"><i className="fab fa-google-plus-g google-bg" /></a>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
                <div className="footer-widget">
                  <div className="footer-widget-heading">
                    <h3>Useful Links</h3>
                  </div>
                  <ul>
                    <li><a href="/#">Home</a></li>
                    <li><a href="/#">about</a></li>
                    <li><a href="/#">services</a></li>
                    <li><a href="/#">portfolio</a></li>
                    <li><a href="/#">Contact</a></li>
                    <li><a href="/#">About us</a></li>
                    <li><a href="/#">Our Services</a></li>
                    <li><a href="/#">Expert Team</a></li>
                    <li><a href="/#">Contact us</a></li>
                    <li><a href="/#">Latest News</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 mb-50">
                <div className="footer-widget">
                  <div className="footer-widget-heading">
                    <h3>Subscribe</h3>
                  </div>
                  <div className="footer-text mb-25">
                    <p>Don’t miss to subscribe to our new feeds, kindly fill the form below.</p>
                  </div>
                  <div className="subscribe-form">
                    <form >
                      <input type="text" placeholder="Email Address" />
                      <button><FontAwesomeIcon icon={faPenToSquare} /></button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-area">
          <div className="container">
            <div className="">
              <div className="text-center ">
                <div className="copyright-text">
                  <p>Copyright © 2024, All Right Reserved <a href="https://itwinetech.com"> Vijay Mane</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </>
  )
}

export default Footer

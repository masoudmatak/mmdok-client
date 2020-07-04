import React, { Component } from 'react';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {
  Badge, Container, Row, Col, Form, Input, Navbar, Nav,
  NavbarBrand, NavLink, NavItem, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

const LOGO = '/images/mmdok_vit_svart.png';

class Header extends Component {

  constructor(props) {
    super(props);
    this.filter = props.filter;
    this.showSearch = props.showSearch;
    this.showWrite = props.showWrite;
    this.showDocument = props.showDocument;
    this.state = { showSearchField: true, counter: 0, activeTab: 1 };
  }


  componentDidMount() {

    axios.get('http://mmdok.emagnca.webfactional.com/count')
      .then(response => {
        this.setState({ counter: response.data.count });
      })
      .catch(error => { 
        this.setState({ counter: 0 });
        console.log(error.message); 
      })
      

    const client = new W3CWebSocket('ws://185.20.49.7:21898/');
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
        const c = message.data.startsWith("New")? 1:-1;
        let i = this.state.counter + c;
        this.setState({ counter: i })
      console.log("Header:" + message.data);
    };
  }

  handleKeyUp = (e) => {
    this.filter(e.target.value);
  }

  showSearchField = showSearchField => {
    this.setState({ showSearchField: { showSearchField } });
  }

  showRightSidePane = () => {
    if (true) {
      return (
        <Col className="d-flex d-lg-flex justify-content-end">
          <Form inline>
            <Input type="text" className="mr-3" placeholder="Sök metadata" onKeyUp={(v) => this.handleKeyUp(v)} />
          </Form>
        </Col>
      )
    }
  }

  render() {
    return (
      <header>
        <Navbar fixed="top" color="light" light expand="xs" className="d-flex border-bottom border-gray bg-white" style={{ height: 80 }}>
          <Container>
            <Row noGutters className="position-relative w-100 align-items-center">

              <Col className="d-flex d-lg-flex justify-content-start">
                <Nav className="mrx-auto" navbar tabs>

                  <NavItem className="d-flex align-items-center">
                    <NavLink className="font-weight-bold" href="/">
                      <img src={LOGO} alt="avatar" className="img-fluid rounded-circle" style={{ height: 44, width: 64 }} />
                    </NavLink>
                  </NavItem>

                  <NavItem className="d-flex align-items-center">
                    <NavLink className={this.state.activeTab == 1 ? "font-weight-bold" : ""}  
                                  onClick={() => { this.showSearch(); this.setState({ activeTab: 1 }); }}>Sökning</NavLink>
                  </NavItem>

                  <NavItem className="d-flex align-items-center">
                    <NavLink className={this.state.activeTab == 2 ? "font-weight-bold" : ""} 
                                  onClick={() => { this.showWrite(); this.setState({ activeTab: 2 }); }}>Inläsning</NavLink>
                  </NavItem>

                  <NavItem className="d-flex align-items-center">
                    <NavLink className={this.state.activeTab == 3 ? "font-weight-bold" : ""} 
                                  onClick={() => { this.showDocument(); this.setState({ activeTab: 3 }); }}>Document</NavLink>
                  </NavItem>

  
                </Nav>
              </Col>

              <Col className="d-flex justify-content-xs-start justify-content-lg-center">
                <Badge color="success">{this.state.counter}</Badge>
              </Col>

              {this.showRightSidePane()}

            </Row>
          </Container>
        </Navbar>
      </header>
    );
  }
}

//              <NavbarBrand className="d-inline-block p-0" href="/" style={{ width: 80 }}>
//<img src={logo} alt="logo" className="position-relative img-fluid" />
//</NavbarBrand>
export default Header;

import React from 'react';
import {
  Alert, Button, Col, Form, FormGroup, FormText, FormFeedback,
  Label, Input, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import axios from 'axios';
import { SERVER_URL } from '../constants';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.loginCallback = this.props.loginCallback;
    modal: false,
      this.state = {
        email: '',
        password: '',
        isLoginFailed: false,
        validate: {
          emailState: '',
        },
      }
    this.handleChange = this.handleChange.bind(this);
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      isLoginFailed: false
    });
  }

  hide = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  validateEmail(e) {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state
    if (emailRex.test(e.target.value)) {
      validate.emailState = 'has-success'
    } else {
      validate.emailState = 'has-danger'
    }
    this.setState({ validate })
  }

  handleChange = async (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [name]: value,
    });
  }

  submitForm(e) {
    e.preventDefault();
    console.log(`Email: ${this.state.email}`)
    axios.post(SERVER_URL + '/users/login', {
      email: this.state.email,
      password: this.state.password
    })
      .then((response) => {
        console.log(response);
        console.log(response.data.token);
        sessionStorage.setItem("token", response.data.token);  //localStorage
        this.loginCallback();
        this.hide();
      }, (error) => {
        console.log(error);
        this.setState({ isLoginFailed: true })
      });
  }

  warning() {
    if (this.state.isLoginFailed) {
      return (
        <div style={{ paddingTop: 20 }}>
          <Alert color="danger">
            Fel inloggning!
          </Alert>
        </div>
      );
    }
  }

  handleKeyUp() {
    if (this.state.isLoginFailed)
    this.setState({ isLoginFailed: false })
  }

  render() {
    const { email, password } = this.state;
    return (
      <div className="textCenter">
        <Modal isOpen={this.state.modal} close={this.hide} toggle={this.toggle} backdrop={false}>
          <ModalHeader style={{ display: 'flex', justifyContent: 'left' }}>Inloggning</ModalHeader>
          <ModalBody>
            <Form id="loginform" className="form" onSubmit={(e) => this.submitForm(e)}>
              <Col>
                <FormGroup>
                  <Label>Användarnamn</Label>
                  <Input
                    type="email"
                    name="email"
                    id="exampleEmail"
                    placeholder="myemail@foo.bar"
                    value={email}
                    valid={this.state.validate.emailState === 'has-success'}
                    invalid={this.state.validate.emailState === 'has-danger'}
                    onChange={(e) => {
                      this.validateEmail(e)
                      this.handleChange(e)
                    }}
                  />
                  <FormFeedback valid>
                    Det ser bra ut.
                  </FormFeedback>
                  <FormFeedback>
                    Inte en korrekt epost-adress
                  </FormFeedback>
                  <FormText>Ditt användarnamn bör vara en epost-adress.</FormText>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="thePassword">Lösenord</Label>
                  <Input
                    type="password"
                    name="password"
                    id="thePassword"
                    placeholder="********"
                    value={password}
                    onChange={(e) => this.handleChange(e)}
                    onKeyUp={(v) => this.handleKeyUp(v)}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" id="checkbox2" />{' '}
                    Behåll min inloggning
                  </Label>
                </FormGroup>
              </Col>
            </Form>
            {this.warning()}
          </ModalBody>
          <ModalFooter style={{ display: 'flex', justifyContent: 'center' }}>
            <Button color="success" type="submit" form="loginform">Logga in</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}




export default Login;
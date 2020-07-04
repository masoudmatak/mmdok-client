import React, { Component, Fragment } from 'react';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup } from 'reactstrap';
import { Label, Input, Modal, ModalBody, ModalFooter } from 'reactstrap';
import HttpClient from '../utils/HttpClient';

export default class EditMetadataModal extends Component {
  constructor(props) {
    super(props);
    this.data = props.data;
    this.filename = props.data['filename'];
    this.state = {
      modal: false,
      size: 'modal-sm',
      body: '',
      dropdownOpen: false,
      attrName: 'Attribut',
      attrValue: 'Gamla värdet'
    };
  }

  toggle = () => {
    const d = this.data();
    this.setState({
      modal: !this.state.modal,
    });
    for (var property in d) {
      console.log("Prop:" + property);
    }
    this.filename = d['filename'].value;
    console.log("Filename:" + this.filename);
  }

  toggleButton = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onFormSubmit = () => {
    const value = document.getElementById('value').value;
    const name = this.state.attrId;
    let client = new HttpClient();
    client.sendUpdate(this.filename, name, value);
    this.setState({
      modal: !this.state.modal,
    });
  }
  

  hide = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  select = (event) => {
    let p = event.target.innerText;
    let v = this.data()[p].value;
    let x = this.data()[p].id;
    this.setState({
      attrName: p,
      attrValue: v,
      attrId: x
    });
  }

  getAttributes = () => {
    var d = this.data();
    const arr = [];
    let index = 0;
    for (var p in d) {
      const q = d[p];
      if (d[p].write){
        arr.push(<DropdownItem key={index} onClick={this.select}>{p}</DropdownItem>);
        index++;
      }
    }
    return arr.map((row) => {
      return row
    })
  }

  render = () => {
    return (
      <div>
        <Modal isOpen={this.state.modal} close={this.hide} toggle={this.toggle} className={this.props.className} backdrop={false} style={{ backgroundColor: '#f1f1f1' }}>
          <ModalBody>
            <Form inline>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleButton}>
                  <DropdownToggle caret>
                  {this.state.attrName}
              </DropdownToggle>
                  <DropdownMenu>
                    {this.getAttributes()}
                  </DropdownMenu>
                </ButtonDropdown>
              </FormGroup>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="value" className="mr-sm-2"> Nytt värde:</Label>
                <Input type="text" name="value" id="value" placeholder={this.state.attrValue}></Input>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onFormSubmit}>Skicka</Button>
            <Button color="secondary" onClick={this.toggle}>Stäng</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

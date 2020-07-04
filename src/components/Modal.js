import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PdfViewer from "./PdfViewer";
import DropdownButton from './DropdownButton';

class MyModal extends React.Component {
  constructor(props) {
    super(props);   
    this.showDocument = this.props.showDocument;
    this.state = {
      modal: false,
      size: 'modal-xl',
      body: ''
    };
  }

  toggle = (data) => {
    this.setState({
      modal: !this.state.modal,
      body: this.getMetadataTable(data),
      document: this.getDocument(data)
    });
    this.data = data;
  }

  toggleNested = () => {
    const url = 'http://mmdok.emagnca.webfactional.com/view/' +
    this.data['filename'].value + '?token=' + sessionStorage.getItem('token');
    console.log("URL=" + url);
    this.showDocument(url);
    /*
    window.open('http://mmdok.emagnca.webfactional.com/view/' + 
      this.data['filename'].value + '?token=' + sessionStorage.getItem('token'),
      "_blank");
      */
    /*
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: false
    });
    */
  }

  toggleAll = () => {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: true
    });
  }

 
  hide = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  getData = () => {
    return this.data;
  }

  getTableContent(data) {
    const arr = [];
    for (var property in data) {
      arr.push(<tr><td style={{ textAlign: "right" }}>{property}:</td><td style={{ textAlign: "left" }}>{data[property].value}</td></tr>);
    }
    return arr.map((row, index) => {
      return row
    })
  }


  getMetadataTable(data) {
    return <table>
      {this.getTableContent(data)}
    </table>

  }

  getDocument(data) {
    return <PdfViewer data={data}></PdfViewer>
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.state.modal} close={this.hide} toggle={this.toggle} className={this.props.className} backdrop={false}>
          <ModalHeader>Dokumenttitel</ModalHeader>
          <ModalBody>
            {this.state.body}
            <br />
            <Modal isOpen={this.state.nestedModal} onClosed={this.state.closeAll ? this.toggle : undefined} backdrop={false}>
              <ModalHeader>
                <Button color="primary" onClick={this.toggleNested}>Visa metadata</Button>{' '}
                <Button color="primary" onClick={this.toggleAll}>Stäng</Button>{' '}
              </ModalHeader>
              <ModalBody>{this.state.document}</ModalBody>
            </Modal>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleNested}>Visa dokument</Button>{' '}
            <DropdownButton data={this.getData}/>
            <Button color="secondary" onClick={this.hide}>Stäng</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


export default MyModal;
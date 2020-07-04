import React, { Component } from 'react';
import { Document, Page } from 'react-pdf';
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Button } from 'reactstrap';
import UserMessage from '../utils/UserMessage';

export default class PdfViewer extends Component {

  constructor(props) {
    super(props);
    console.log("in constructor file file=" + this.props.data['filename'].value);
    this.messenger = new UserMessage()
    this.filename =  this.props.data['filename'].value;
    this.shouldUpdate = true;
    this.state = {
      numPages: null,
      pageNumber: 1
    }
  }

  shouldComponentUpdate(){
    const shouldUpdate = this.shouldUpdate;
    console.log("Should update: " + shouldUpdate);
    this.shouldUpdate = false;
    return shouldUpdate;
  }

  componentDidUpdate() {
    this.shouldUpdate = false;
    console.log("Did update");
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    console.log("onDocumentLoadSuccess");
    this.setState({ numPages: numPages });
  }

  onRenderSuccess  = () => {
    console.log("OnRenderSucces");
  }

  onLoadError = (error) => {
    let msg = error.message;
    if (error.status == 401) msg = "Du får inte titta på dokumentet"
    this.messenger.alert(msg);
  }

  renderError = () => {
    console.log("renderError")
    return <div>{this.message}</div>
  }

  forward = () => {
    if (this.state.pageNumber < this.state.numPages){
      this.shouldUpdate = true;
      this.setState({ pageNumber: this.state.pageNumber + 1 });
    }
  }

  backward = () => {
    if (this.state.pageNumber > 1){
      this.shouldUpdate = true;
      this.setState({ pageNumber: this.state.pageNumber - 1 });
    }
  }

  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div>
        <Button color="secondary" onClick={this.forward}>&#187;</Button>{' '}
        <Button color="secondary" onClick={this.backward}>&#171;</Button>
        <p>Sida {pageNumber} av {numPages}</p>
        <Document 
            file={{ url: 'http://mmdok.emagnca.webfactional.com/view/' + this.filename, 
                  httpHeaders: {'Authorization': "Bearer " + sessionStorage.getItem('token')}}}
            onLoadSuccess={this.onDocumentLoadSuccess}
            onLoadError={this.onLoadError}
            onRenderSuccess={this.onRenderSuccess}
            error="Kunde ej ladda pdf"
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <Button color="secondary" onClick={this.forward}>&#187;</Button>{' '}
        <Button color="secondary" onClick={this.backward}>&#171;</Button>
        <p>Sida {pageNumber} av {numPages}</p>
      </div>
    );
  }
}
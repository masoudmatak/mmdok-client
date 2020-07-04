import React, { Component, Fragment }  from 'react';
import FileDrop from 'react-file-drop';
import { Button } from 'reactstrap';
import '../styles/Filedrop.css'; 

export default class Filedrop extends Component {
  handleDrop = (files, event) => {
    for (var i = 0; i < files.length; i++) { 
      alert(files[i].name);
    }
  }

  renderx() {
    const styles = { border: '1px solid black', color: 'black', padding: 100 };
    return (
        <div id="react-file-drop-demo" className="clearFix">
          <FileDrop onDrop={this.handleDrop}>
            Släpp filer på denna yta!
          </FileDrop>
      
          <Button>Eller välj fil</Button>
        </div>
      );
  }

  
  render() {
    const styles = { border: '1px solid black', height:400, width: 600, color: 'black', padding: 20 };
    return (

      <div id="react-file-drop-demo" style={styles}>
        <FileDrop onDrop={this.handleDrop} frame="react-file-drop-demo">
          Drop some files here!
        </FileDrop>
      </div>
    );
  }

}

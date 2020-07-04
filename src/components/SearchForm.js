import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Field from '../utils/Field';

export default class SearchForm extends React.Component {

  documentTypes = new Map();
  field = new Field();
 
  constructor(props) {
    super(props);
    this.search = props.search;
    this.state = {types: [], form: []};
  }

  updateConfig(config) {
    this.config = config;
    this.docType = null;
    this.config.map(item => {
      if (this.docType == null) this.docType = item.name;
      const fields = item.fields.filter( field => { return field.search; });
      this.documentTypes[item.name] = fields;
      return true;
    });
    this.fields = this.documentTypes[this.docType];
    this.setState({
      types: this.getDocumentTypes(),
      form: this.fields.map((item, index) => { return this.field.getForm(item); })
    })
  }

  handleChange(v) {
    this.docType = v;
    this.fields = this.documentTypes[v];
    this.setState({
      form: this.fields.map(item => {
        return this.field.getForm(item);
      })
    });
  }

  getDocumentTypes = () => {
    return this.config.map((entry, index) => <option key={index}>{entry.name}</option>);
  }

  getValueById = (id) => {
    return document.getElementById(id).value;
  }

  onFormSubmit = () => {
    let json = this.docType=='*'? '{' : '{"metadata.type":"' + this.docType + '"';
    for (var i = 0; i < this.fields.length; i++) {
      const field = this.fields[i];
      const value = this.getValueById(field['id']);
      if (value != ""){
        if (json.length > 1) json += ','
        json += '"metadata.' + field['id'] + '":"' + this.getValueById(field['id']) + '"';
      }
    }
    json += '}';
    let urlParams = '?params=' + json;
    this.search(urlParams);
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Form>
          <FormGroup>
            <h4>Dokumenttyper</h4>
            <Input type="select" name="select" id="documentTypes" onChange={(e) => { this.handleChange(e.target.value) }}>
              {this.state.types}
            </Input>
          </FormGroup>

          <hr style={{
            color: 'gray',
            backgroundColor: 'gray',
            height: .5,
            borderColor: 'gray'
          }} />
          <h4>Metadata</h4>
          {this.state.form}
          <hr style={{
            color: 'gray',
            backgroundColor: 'gray',
            height: .5,
            borderColor: 'gray'
          }} />

          <Button color='primary' onClick={this.onFormSubmit}>Sök</Button>
        </Form>
      </div>
    );
  }
}
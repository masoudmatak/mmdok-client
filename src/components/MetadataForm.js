import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Field from '../utils/Field';

export default class MetadataForm extends React.Component {

  documentTypes = new Map();
  field = new Field();

  constructor(props) {
    super(props);
    this.search = props.search;
    this.state = { types: [], form: [] };
  }

  updateConfig(config) {
    this.config = config;
    this.docType = null;
    this.config.map(item => {
      if (this.docType == null) this.docType = item.name;
      const fields = item.fields.filter( field => { return field.write; });
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
    return this.config.map((entry, index) => <option key={index}>{entry.name}</option>)
  }

  getValueById = (id) => {
    return document.getElementById(id).value;
  }

  onFormSubmit = () => {
    let urlParams = "?type=" + this.docType;
    for (var i = 0; i < this.fields.length; i++) {
      const field = this.fields[i];
      urlParams += "&" + field['id'] + "=" + this.getValueById(field['id']);
    }
    this.search(urlParams);
  }

  getMetadata = () => {
    let json = '{"type":"' + this.docType + '"';
    for (var i = 0; i < this.fields.length; i++) {
      const field = this.fields[i];
      json += ',"' + field['id'] + '":"' + this.getValueById(field['id']) + '"';
    }
    json += '}';
    return json;
  }

  render() {
    return (
      <Form>
        <FormGroup>
          <h4>Metadata för dokumenten</h4>
          <hr style={{
            color: 'gray',
            backgroundColor: 'gray',
            height: .5,
            borderColor: 'gray'
          }} />
          <Label for="documentTypes">Dokumenttyp</Label>
          <Input type="select" name="select" id="documentTypes" onChange={(e) => { this.handleChange(e.target.value) }}>
            {this.state.types}
          </Input>
        </FormGroup>
        {this.state.form}
      </Form>
    );
  }
}
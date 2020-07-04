import React, { Component, Fragment } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import axios from 'axios';
import Datatable from './Datatable';
import {SERVER_URL} from '../constants';

export default class TablePagination extends Component {

  documentTypes = new Map();

  constructor(props) {
    super(props);
    this.data = [];
    this.showDocument = this.props.showDocument;
    this.state = {
      currentPageNo: 0,
      metadata: [],
      pageCount: 0
    };
    this.pageSize = 10;
  }


  select = data => {
    var d = [];
    for (let i = 0; i < data.length; i++) {
      let e = {};
      let o = data[i];
      let fieldCount = 0;
      if (o.hasOwnProperty('metadata') && typeof o.metadata === 'object') {
        const type = this.documentTypes[o.metadata.type];
        for (var key in o.metadata){
          if (type.has(key)){
            fieldCount++;
            const name = type.get(key).name;
            e[name] = {value: o.metadata[key]};
            Object.assign(e[name], type.get(key));
          }
        }
        e['id'] = {value: o['_id']};
        e['filename'] = {value: o['filename']};
        if (fieldCount >= type.size) 
          d.push(e);
      }

    }
    return d;
  }

  fieldsToSet = fields => {
    const map = new Map();
    fields.map(field => {
      map.set(field.id, field);
    });
    return map;
  }

  updateConfig(config) {
    //this.setState({ metadata: this.data}); this.setState({pageCount: this.getPageCount() })
    //axios.get('http://jsonplaceholder.typicode.com/todos')
    this.config = config;
    this.docType = null;
    this.config.map(item => {
      if (this.docType == null) this.docType = item.name;
      this.documentTypes[item.name] = this.fieldsToSet(item.fields);
      return true;
    });/*
    axios.get(SERVER_URL + '/filelist')
      .then(response => {
        let data = this.select(response.data);
        this.data = data;
        this.setState({ metadata: data });
        this.setState({ pageCount: this.getPageCount() })
      })
      .catch(error => { console.log(error.message); })
      */
  }

  handleClick = (e, index) => {
    e.preventDefault();
    this.setState({ currentPageNo: index });
  }

  currentPage = () => {
    return this.state.metadata.slice(
      this.state.currentPageNo * this.pageSize,
      (this.state.currentPageNo + 1) * this.pageSize)
  }

  getPageCount = () => {
    return Math.ceil(this.state.metadata.length / this.pageSize);
  }

  filter = txt => {
    let arr = this.data.filter((row) => {
      for (var key in row) {
        if (row[key].value.toString().includes(txt)) return true;
      }
      return false;
    });
    this.setState({ currentPageNo: 0, metadata: arr, pageCount: Math.ceil(arr.length / this.pageSize) });
  }

  sort = (column, order) => {
    let arr = [...this.state.metadata];
    arr.sort(sortFunction);
    this.setState({ currentPageNo: 0, metadata: arr });

    function sortFunction(a, b) {
      a = a[column].value;
      b = b[column].value;
      let cmp = (a === b) ? 0 : (a < b) ? -1 : 1;
      return order ? cmp : cmp * -1;
    }
  }

  search = params => {
    var config = {
      headers: {'Authorization': "Bearer " + sessionStorage.getItem('token')}  //localStorage
    };
    axios.get(SERVER_URL + '/filelist' + params, config)
      .then(response => {
        let data = this.select(response.data);
        this.data = data;
        this.setState({ metadata: data });
        this.setState({ pageCount: this.getPageCount() })
      })
      .catch(error => { console.log(error.message); })
  }


  render = () => {
    const currentPageNo = this.state.currentPageNo;
    return (
      <Fragment>

        <Datatable
          data={this.currentPage}
          sort={this.sort}
          showDocument={this.showDocument}
        />

        <div className="pagination-wrapper">
          <Pagination>

            <PaginationItem disabled={currentPageNo <= 0}>
              <PaginationLink
                onClick={e => this.handleClick(e, currentPageNo - 1)}
                previous
                href="#"
              />
            </PaginationItem>

            {[...Array(this.state.pageCount)].map((page, i) =>
              <PaginationItem active={i === currentPageNo} key={i}>
                <PaginationLink onClick={e => this.handleClick(e, i)} href="#">
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem disabled={currentPageNo >= this.state.pageCount - 1}>
              <PaginationLink
                onClick={e => this.handleClick(e, currentPageNo + 1)}
                next
                href="#"
              />
            </PaginationItem>

          </Pagination>

        </div>

      </Fragment>
    );
  }
}



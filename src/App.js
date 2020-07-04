import React, { Component, Fragment } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { PDFObject } from 'react-pdfobject'
import Header from './components/Header';
import TablePagination from './components/TablePagination';
import SearchForm from './components/SearchForm';
import MetadataForm from './components/MetadataForm';
import Filelist from './components/Filelist';
import Login from './components/Login';
import axios from 'axios';
import {CONFIG_URL, SERVER_URL} from './constants';

export default class App extends Component {

	componentDidMount() {
		this.refs.login.toggle();
	}

	showSearch = () => {
		this.refs.contentPane.showSearch();
	}

	showWrite = () => {
		this.refs.contentPane.showWrite();
	}

	showDocument = () => {
		this.refs.contentPane.showDocument();
	}

	loginCallback = () => {
		this.refs.contentPane.search('');
	}

	render = () => {
		return (
			<Fragment>
				<main className="my-5 py-5">
					<ContentPane ref="contentPane" />
				</main>
				<Login ref='login' loginCallback={this.loginCallback}/>
			</Fragment>
		);
	}
}

class ContentPane extends Component {

	constructor() {
		super();
		this.state = { tab: 'search', url: null };
		this.config = [];
	}

	componentDidMount() {
		axios.get('http://mmadmin.emagnca.webfactional.com' + '/types')
			.then(response => {
				this.config = response.data;
				this.updateConfig();
			})
			.catch(error => { alert(error.message + " from " + SERVER_URL); })
	}

	componentDidUpdate() {
		this.updateConfig();
	}

	filter = txt => {
		this.refs.table.filter(txt);
	}

	search = params => {
		this.refs.table.search(params);
	}

	metadata = () => {
		return this.refs.metadata.getMetadata();
	}

	showSearch = () => {
		this.setState({ tab: 'search' });
	}

	showWrite = () => {
		this.setState({ tab: 'write' });
	}

	showDocument = (url) => {
		this.setState({ tab: 'document', url: url});
	}

	getDocument = () => {
		return this.state.url != null? (<PDFObject url={this.state.url} height="800px"/>) : ("Inget dokument att visa");
	}

	updateConfig = () => {
		if (this.state.tab === 'search') {
			this.refs.search.updateConfig(this.config);
			this.refs.table.updateConfig(this.config);
		}
		else if (this.state.tab === 'write')
			this.refs.metadata.updateConfig(this.config);
	}

	render = () => {
		if (this.state.tab === 'search') {
			return (
				<Container className="px-0">
					<Header filter={this.filter} showSearch={this.showSearch} showWrite={this.showWrite} showDocument={this.showDocument} showSearchField={true} />
					<Row noGutters className="pt-2 pt-md-5 w-100 px-4 px-xl-0 position-relative">
						<Col key={1} xs={{ order: 1 }} md={{ size: 2, order: 1 }} tag="aside" className="pb-5 mb-5 pb-md-0 mb-md-0 mx-auto mx-md-0">
							<SearchForm ref='search' search={this.search} config={this.config}/>
						</Col>
						<Col key={2} xs={{ order: 2 }} md={{ size: 9, offset: 1 }} tag="section" className="py-5 mb-5 py-md-0 mb-md-0">
							<TablePagination ref='table' config={this.config} showDocument={this.showDocument}/>
						</Col>
					</Row>
				</Container>

			)
		}
		else if (this.state.tab === 'write') {
			return (
				<Container className="px-0">
					<Header filter={this.filter} showSearch={this.showSearch} showWrite={this.showWrite} showDocument={this.showDocument} showSearchField={false} />
					<Row noGutters className="pt-2 pt-md-5 w-100 px-4 px-xl-0 position-relative">
						<Col key={1} xs={{ order: 1 }} md={{ size: 3, order: 1 }} tag="aside"
							className="pb-5 mb-5 pb-md-0 mb-md-0 mx-auto mx-md-0">
							<MetadataForm ref='metadata' />
						</Col>
						<Col key={2} xs={{ order: 2 }} md={{ size: 7, order: 2, offset: 1 }} tag="section"
							className="py-5 mb-5 py-md-0 mb-md-0">
							<Filelist metadata={this.metadata} />
						</Col>
					</Row>
				</Container>
			)
		}

		else {
			return (
			<Container className="px-0">
			<Header filter={this.filter} showSearch={this.showSearch} showWrite={this.showWrite} showDocument={this.showDocument} showSearchField={false} />
			<Row className="">
			<Col key={1} xs={{ order: 1 }} md={{ size: 12, order: 1 }} tag="aside">
				{this.getDocument()}
			</Col>
			</Row>
		</Container>
			)	
		}
	}
}




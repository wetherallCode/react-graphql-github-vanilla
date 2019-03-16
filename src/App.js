import React, { Component } from 'react'
import axios from 'axios'

const TITLE = 'React GraphQL GitHub Client'
const axiosGitHubGraphQL = axios.create({
	baseURL: 'https://api.github.com/graphql',
	headers: {
		Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS}`
	}
})

class App extends Component {
	render() {
		return (
			<div>
				<h1>{TITLE}</h1>
				<form onSubmit={this.onSubmit}>
					<label htmlFor='url'>Show open issues for https://github.com/</label>
					<input id='url' type='text' onChange={this.onChange} style={{ width: '300px' }} />
					<button type='submit'>Search</button>
				</form>
				<hr />
				{}
			</div>
		)
	}
}

export default App

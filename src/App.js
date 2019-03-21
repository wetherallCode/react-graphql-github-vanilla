import React, { Component } from 'react'
import axios from 'axios'
// require('dotenv').config()

const TITLE = 'React GraphQL GitHub Client'
const axiosGitHubGraphQL = axios.create({
	baseURL: 'https://api.github.com/graphql',
	headers: {
		Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
	}
})

const getIssuesOfRepositoryQuery = (organization, repository) => `
{
	organization(login: "${organization}") {
		name
		url
		repository(name: "${repository}") {
			name
			url
			issues(last: 5) {
				edges {
					node {
						id
						title
						url
					}
				}
			}
		}
	}
}`

const getIssuesOfRepository = path => {
	const [organization, repository] = path.split('/')

	return axiosGitHubGraphQL.post('', {
		query: getIssuesOfRepositoryQuery(organization, repository)
	})
}
const resolveIssuesQuery = queryResult => () => ({
	organization: queryResult.data.data.organization,
	errors: queryResult.data.errors
})

class App extends Component {
	state = {
		path: 'the-road-to-learn-react/the-road-to-learn-react',
		organization: null,
		errors: null
	}
	componentDidMount() {
		this.onFetchFromGithub(this.state.path)
	}
	onChange = event => {
		this.setState({ path: event.target.value })
	}
	onSubmit = event => {
		this.onFetchFromGithub(this.state.path) // fetch data
		event.preventDefault()
	}

	onFetchFromGithub = path => {
		getIssuesOfRepository(path).then(queryResult => this.setState(resolveIssuesQuery(queryResult)))
	}

	render() {
		const { path, organization, errors } = this.state
		return (
			<div>
				<h1>{TITLE}</h1>
				<form onSubmit={this.onSubmit}>
					<label htmlFor='url'>Show open issues for https://github.com/</label>
					<input
						id='url'
						type='text'
						value={path}
						onChange={this.onChange}
						style={{ width: '300px' }}
					/>
					<button type='submit'>Search</button>
				</form>
				<hr />
				{organization ? (
					<Organization organization={organization} errors={errors} />
				) : (
					<p>No Information Yet...</p>
				)}
			</div>
		)
	}
}

const Organization = ({ organization, errors }) => {
	if (errors) {
		return (
			<p>
				<strong>Something went wrong</strong>
				{errors.map(error => error.message).join(' ')}
			</p>
		)
	}
	return (
		<div>
			<p>
				<strong>Issues from Organization:</strong>
				<a href={organization.url}>{organization.name}</a>
			</p>
			<Repository repository={organization.repository} />
		</div>
	)
}

const Repository = ({ repository }) => (
	<div>
		<p>
			<strong>In Repository:</strong>
			<a href={repository.url}>{repository.name}</a>
		</p>
		<ul>
			{repository.issues.edges.map(issue => (
				<li key={issue.node.id}>
					<a href={issue.node.url}>{issue.node.title}</a>
				</li>
			))}
		</ul>
	</div>
)
export default App

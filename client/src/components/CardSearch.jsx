import React, { useState } from 'react'
import { useLazyQuery, gql } from '@apollo/client'

// filter: { _operators: { text: { regex: "/trample/i" } } }

const SEARCH_CARDS = gql`
  query SearchCards($name: RegExpAsString) {
    cardMany(limit: 10, filter: { _operators: { name: { regex: $name } } }) {
      _id
      name
      manaCost
      rarity
      setCode
      convertedManaCost
      colorIdentity
      text
    }
  }
`

function Results({ data }) {
  return data.cardMany.map(({ _id, name, text, setCode, manaCost }) => (
    <div key={_id}>
      <p>
        <strong>{name}</strong>
        <br />
        {setCode}
        <br />
        {manaCost}
        <br />
        {text}
      </p>
    </div>
  ))
}

export default function CardSearch() {
  const [query, setQuery] = useState('')
  const [getCards, { loading, error, data }] = useLazyQuery(SEARCH_CARDS)

  const onSubmit = (e) => {
    e.preventDefault()
    getCards({ variables: { name: `/${query}/i` } })
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          className="text-lg p-1 mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border border-gray-300 rounded-md"
          type="text"
          value={query}
          placeholder="Enter search query"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="inline-flex justify-center mt-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Search
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error :(</p>}
      {data && <Results data={data} />}
    </>
  )
}

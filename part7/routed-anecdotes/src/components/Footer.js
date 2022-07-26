import React from 'react'

const Footer = () => {
  const sourceCode = 'https://github.com/codelikeagirl29/fullstackopen'
  const courseUrl = 'https://lindseyk.dev'

  return (
    <div>
      Anecdote app for <a href={courseUrl}>Full Stack - refactored by lindseyk</a>.
      <br />
      See <a href={sourceCode}>{sourceCode}</a> for the source code.
    </div>
  )
}

export default Footer
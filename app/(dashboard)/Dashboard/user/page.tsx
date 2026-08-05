import Link from 'next/link'
import React from 'react'

const user = () => {
  return (
    <div>
        <h1>Dashboard user</h1>

        <ul>
            <li><Link href="/Dashboard/user/1">User 1</Link></li>
            <li><Link href="/Dashboard/user/2">User 2</Link></li>
            <li><Link href="/Dashboard/user/3">User 3</Link></li>
            <li><Link href="/Dashboard/user/4">User 4</Link></li>
        </ul>
    </div>
  )
}

export default user
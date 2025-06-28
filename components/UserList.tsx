import { getUsers } from '@/app/actions/user-actions'

export default async function UserList() {
  const users = await getUsers()

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      
      {users.length === 0 ? (
        <p className="text-gray-500">No users yet. Create one above!</p>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => (
            <li key={user.id} className="border-b pb-3 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{user.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {user.posts.length} posts
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
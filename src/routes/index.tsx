import { db } from '@/db'
import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ListTodoIcon, PlusIcon } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

const serverLoader = createServerFn({ method: 'GET' }).handler(() => {
  return db.query.todos.findMany()
})

export const Route = createFileRoute('/')({
  component: App,
  loader: () => {
    return serverLoader()
  },
})

function App() {
  const todos = Route.useLoaderData()

  const completedCount = todos.filter((todo) => todo.isCompleted).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen container space-y-8">
      <div className="flex justify-between items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Todo List</h1>
          {totalCount > 0 && (
            <Badge variant="outline">
              {completedCount} of {totalCount} completed
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" asChild>
            <Link to="/todos/new">
              <PlusIcon /> Add Todo
            </Link>
          </Button>
        </div>
      </div>

      <TodoListTable todos={todos} />

      {/* TODO: just for debugging */}
      {todos.map((todo) => (
        <pre key={todo.id} className="p-2 border rounded">
          {JSON.stringify(todo, null, 2)}
        </pre>
      ))}
    </div>
  )
}

function TodoListTable({
  todos,
}: {
  todos: Array<{
    id: string
    name: string
    isCompleted: boolean
    createdAt: Date
    updatedAt: Date
  }>
}) {
  if (todos.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ListTodoIcon />
          </EmptyMedia>
          <EmptyTitle>No Todos</EmptyTitle>
          <EmptyDescription>Try adding a new todo</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link to="/todos/new">
              <PlusIcon /> Add Todo
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return null
}

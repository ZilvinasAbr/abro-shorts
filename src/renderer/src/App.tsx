import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function App(): React.JSX.Element {
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Tailwind + shadcn/ui</CardTitle>
          <CardDescription>
            Components are working! Try the button and input below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-input">Test Input</Label>
            <Input
              id="test-input"
              placeholder="Type something..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => alert(`You typed: ${inputValue}`)}>
              Submit
            </Button>
            <Button variant="secondary" onClick={() => setInputValue('')}>
              Clear
            </Button>
            <Button variant="destructive" onClick={() => alert('Destructive!')}>
              Delete
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Outline
            </Button>
            <Button variant="ghost" size="sm">
              Ghost
            </Button>
            <Button variant="link" size="sm">
              Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App

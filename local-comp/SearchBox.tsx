import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SearchBox() {
  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <Input type="text" placeholder="Enter product link" />
      <Button type="submit" variant="outline">
        Search
      </Button>
    </div>
  )
}

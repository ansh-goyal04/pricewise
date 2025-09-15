import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { log } from "console"
import { useState } from "react"

export default function Modal() {
    const [email,setEmail]=useState('')
    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault()
        console.log('submit')
        console.log(email)
    }
  return ( 
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">Track</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Track this product</DialogTitle>
            <DialogDescription className="font-weight-bold">
              Stay updated with product pricing alerts right in your inbox!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer">
              Track
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
import { addUserEmailToProduct } from "@/local-lib/actions"

interface ModalProps {
  productId: string;
}

export default function Modal({ productId }: ModalProps) {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)
        
        try {
            console.log('Submitting form with:', { productId, email })
            await addUserEmailToProduct(productId, email)
            console.log('Email submitted successfully')
            setSuccess(true)
            setEmail('') // Clear the form
            setTimeout(() => setSuccess(false), 3000) // Hide success message after 3 seconds
        } catch (err) {
            console.error('Error submitting email:', err)
            setError('Failed to submit. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
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
                disabled={isSubmitting}
                placeholder="Enter your email address"
                className="w-full"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-600 text-sm">
                Success! You'll be notified of price changes.
              </div>
            )}
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="cursor-pointer"
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting ? 'Submitting...' : 'Track'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

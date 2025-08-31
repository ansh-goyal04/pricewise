"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { scrapeAndStoreProduct } from "@/local-lib/actions"
import { FormEvent, useState } from "react"

const isValidUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const hostName = parsedUrl.hostname;

    if (
      hostName.includes("amazon.com") ||
      hostName.includes("amazon.") ||
      hostName.endsWith("amazon")
    ) {
      return true;
    }
  } catch (er) {
    return false;
  }
  return false;
};

export default function SearchBox() {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // prevent page reload
    

    const isValidLink = isValidUrl(searchPrompt);
    if (!isValidLink) return alert("Please provide a valid link");

    try {
      setIsLoading(true);
      
      const product = await scrapeAndStoreProduct(searchPrompt);
      
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm items-center gap-2"
    >
      <Input
        type="text"
        placeholder="Enter product link"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
      />
      <Button type="submit" variant="outline" disabled={isLoading || searchPrompt === ""}>
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}

import { GoogleGenerativeAI } from '@google/generative-ai'

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export function getPrompt(data: {
  title: string
  author: string
  subject: string
  quote: string
  body: string
}) {
  return `
  You are trying to make an application to improve yourself by practicing Stoicism. The application provides daily quotes and explanation related to famous Stoic Philosophers. You are to create 2-5 checkboxes for users to have ACTIONABLE tasks that they can accomplish TODAY based on
  1. the title of the day's entry
  2. a quote from popular Stoics like Marcus Aurelius, Seneca, Epictetus, Musonius Rufus, Diogenes, Zeno, Chrysippus, and, Plutarch
  3. Stoic author
  4. a general subject of what to improve or focus on this month
  5. a little explanation from the quote on number 2

  use this as the entry
  1. ${data.title}
  2. ${data.quote}
  3. ${data.author}
  4. ${data.subject}
  5. ${data.body}

  PLEASE KEEP NOTE:
  1. the response MUST be valid JSON and don't include any other response other than the JSON
  2. the response should be in PLAIN TEXT JSON format. ENSURE that it isn't markdown
  3. be as specific as possible on the action item that can be accomplished today and is applicable on our day to day lives
  [
    {
      "actionItem": string,
      // a little quote to support the title from a Stoic Philosopher
      "quote": {
        "body": string,
        "author": string,
        "source": string
      },
      // a little explanation
      "description": string
    }
  ]
`
}

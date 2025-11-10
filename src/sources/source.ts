import fs from 'fs'
import path from 'path'

function isUrl(source: string): boolean {
  try {
    // Check for protocol
    if (!source.includes('://')) {
      return false
    }

    // Try to construct a URL object - will throw if invalid
    new URL(source)
    return true
  } catch {
    return false
  }
}

async function readFromFile(
  filePath: string
): Promise<{ content: string; name: string }> {
  const resolvedPath = path.resolve(filePath)

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`File not found: ${resolvedPath}`)
  }

  console.log(`Reading ${resolvedPath}...`)
  const content = fs.readFileSync(resolvedPath, 'utf-8')
  const name = `${path.basename(resolvedPath)} from local file`

  console.log('✓ Loaded documentation\n')
  return { content, name }
}

async function fetchFromUrl(
  url: string
): Promise<{ content: string; name: string }> {
  // Try to fetch llms.txt
  const llmsTxtUrl = new URL('/llms.txt', url).href

  console.log(`Fetching ${llmsTxtUrl}...`)
  let response = await fetch(llmsTxtUrl)

  if (!response.ok) {
    // Maybe they provided the llms.txt URL directly
    response = await fetch(url)
    if (!response.ok) {
      throw new Error(`No llms.txt found at ${url}`)
    }
  }

  const content = await response.text()
  const name = `llms.txt from ${new URL(url).hostname}`

  console.log('✓ Fetched documentation\n')
  return { content, name }
}

export async function fetchDocumentation(
  source: string
): Promise<{ content: string; name: string }> {
  try {
    if (isUrl(source)) {
      return await fetchFromUrl(source)
    } else {
      return await readFromFile(source)
    }
  } catch (error: any) {
    throw new Error(
      `Failed to fetch documentation from ${source}: ${error.message}`
    )
  }
}

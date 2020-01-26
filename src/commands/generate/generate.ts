/**
 * This should never run, because Ignite's own `generate`
 * command should always take precedence. If it does run,
 * then we throw an error.
 *
 * We mainly want this command to allow for the "ignite g" alias.
 */
export const alias = ['g']
export const run = () => {
  throw new Error(`
    Error with "ignite generate" in ignite-bowser

    please report issue at https://github.com/infinitered/ignite
  `)
}

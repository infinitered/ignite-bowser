/**
 * This file is here to warn legacy Ignite CLI users that they need to
 * use this as a standalone CLI.
 */
export const install = async toolbox => {
  toolbox.print.warning(`
    This version of Ignite Bowser is designed to run as a standalone CLI.
    
    Either:
    
    1. Use an older version of Ignite Bowser that works with your version of Ignite CLI
        npx ignite-cli new Foo -b ignite-bowser@5.3.0
      
    2. Run the new standalone CLI:
        npx ignite-bowser new Foo
  `)

  process.exit(1)
}

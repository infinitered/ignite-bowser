/**
 * This file is here to warn legacy Ignite CLI users that they need to
 * upgrade to the latest.
 */
export const install = async toolbox => {
  toolbox.print.warning(`
    This version of Ignite Bowser is designed to work with Ignite CLI version 4+.
    
    Either:
    
    1. Use an older version of Ignite Bowser that works with your version of Ignite CLI
        ignite new Foo -b ignite-bowser@5.3.0
      
    2. Upgrade your version of Ignite CLI to the latest
        yarn upgrade -g ignite-cli --latest
        or
        yarn remove -g ignite-cli
        npx ignite-cli new Foo -b ignite-bowser
  `)

  process.exit(1)
}

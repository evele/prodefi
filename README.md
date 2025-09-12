## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

## Dev Cast Script

For quick local interactions on Anvil, use `script/dev-cast.sh`.

Setup
- `export RPC_URL=http://127.0.0.1:8545`
- Ensure contracts are deployed: `./deploy.sh`

Examples
- Set deadline (owner): `FROM=0xf39F...2266 bash script/dev-cast.sh deadline +3600`
- Submit prediction for token 2: `FROM=0xf39F...2266 bash script/dev-cast.sh predict 2`
- Predict winners for token 2: `FROM=0xf39F...2266 bash script/dev-cast.sh winners 2 1 2 3 4`
- Check if token used: `bash script/dev-cast.sh used 2`
- Show stored prediction: `bash script/dev-cast.sh show-pred 2`
- Set a result (owner): `FROM=0xf39F...2266 bash script/dev-cast.sh results 0 1 0`
- Recalculate points: `FROM=0xf39F...2266 bash script/dev-cast.sh points 2`
- Get position: `bash script/dev-cast.sh position 2`
- Buy 2 cartons: `FROM=0x7099...C8 bash script/dev-cast.sh buy 2`

Notes
- Override sender with `FROM` or `PK` (private key). If `PK` is set, it takes precedence.
- The script reads contract addresses from `frontend/.env`.

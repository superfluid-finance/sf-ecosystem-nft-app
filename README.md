# **Superfluid Ecosystem NFT Frontend**

This project represents the app code (frontend side) used for the Superfluid NFT Ecosystem Rewards Pass mint as seen [here](https://mint.superfluid.finance/). The smart contracts use Superfluid's [Distribution Pools](https://docs.superfluid.finance/docs/protocol/distributions/guides/pools) in order to assign a share in a pool to all the minters.

If you are interested in the smart contracts code, head to the [smart contracts repository](https://github.com/superfluid-finance/sf-ecosystem-nft-contracts).

## How does it work?

Each time a user mints an NFT, a share (unit) is assigned to that user at a Superfluid Distribution Pool on the blockchain. At the same time, the stream period is extended to end at a month from that last mint. This might make the total flow rate a bit bigger or smaller for the whole Pool, but always makes the flow rate a bit smaller for each member unit (share) in the Pool. However the stream keeps going for a longer period to compensate for that.

## Usage

### Install

```shell
$ npm install
```

### Add Environment variables

Make sure you create and update a file `.env` following the `.env.template` included in this project.

### Run locally

```shell
$ npm run dev
```

# **Superfluid Ecosystem NFT**

To run locally:
`npm run dev`

**WIP / Pending actions**
- Update copy across various screns (including tool tips)
- Update contract addresses, gdaForwarderv1, pool addresses, native token addresses for each network when contracts have been deployed to prod.
- Update `.env` file to use prod Privy API key and node provider keys (I am using Alchemy for testing)
- Remove `Polygon Mumbai Network` from list of supported chains, as that is being used for testing only.
- Update `useCheckMintStatus` and `useGetChainMintInfos` hook to query from indexer once it is ready instead of via contract. 

**Other Notes** 
- Right now the front end is only coded to support Polygon Mumbai. I will start adding more testnets soon.